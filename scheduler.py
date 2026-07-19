"""
scheduler.py

Runs a background APScheduler job, once per minute, that:
  1. Loads every ARMED switch
  2. Checks whether its deadline has passed
  3. Checks the mirrored goal progress (synced from the frontend)
  4. If the goal is incomplete and the deadline is gone, publishes the
     stored roast tweet and marks the switch TRIGGERED
  5. If publishing fails, leaves the switch ARMED so the next tick retries
     (a FAILED status is recorded after repeated attempts to avoid a
     silent infinite retry loop)
"""

import logging
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler

import storage as storage
import twitter_client

logger = logging.getLogger("deadmans_switch.scheduler")
logging.basicConfig(level=logging.INFO)

MAX_RETRY_ATTEMPTS = 5


def _parse_deadline(deadline_str: str) -> datetime:
    """Deadlines are stored as ISO date or datetime strings. A bare
    date (YYYY-MM-DD) is treated as end-of-day UTC, matching the
    urgency engine's own end-of-day deadline semantics."""
    if "T" in deadline_str:
        dt = datetime.fromisoformat(deadline_str.replace("Z", "+00:00"))
    else:
        dt = datetime.fromisoformat(deadline_str + "T23:59:59+00:00")
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def check_and_trigger_switches() -> None:
    now = datetime.now(timezone.utc)
    armed = storage.all_armed_switches()

    for switch in armed:
        switch_id = switch["id"]
        user_id = switch["user_id"]
        goal_id = switch["goal_id"]

        try:
            deadline = _parse_deadline(switch["deadline"])
        except (ValueError, KeyError):
            logger.warning("Switch %s has an unparseable deadline, skipping.", switch_id)
            continue

        if now < deadline:
            continue  # deadline hasn't passed yet

        progress = storage.get_goal_progress(user_id, goal_id)
        if progress is not None and progress >= 100:
            # Goal was actually completed but the app failed to call
            # /switch/disarm (e.g. offline sync). Disarm defensively.
            storage.update_switch_status(switch_id, storage.STATUS_DISARMED,
                                          reason="goal_complete_on_check")
            logger.info("Switch %s defensively disarmed: goal already complete.", switch_id)
            continue

        logger.info("Deadline passed for switch %s (goal %s) — triggering roast tweet.",
                    switch_id, goal_id)
        try:
            result = twitter_client.post_tweet(user_id, switch["tweet"])
            storage.update_switch_status(
                switch_id,
                storage.STATUS_TRIGGERED,
                tweet_id=result.get("id") if isinstance(result, dict) else None,
                triggered_at=storage.now_iso(),
            )
            logger.info("Switch %s triggered successfully.", switch_id)
        except Exception as exc:  # noqa: BLE001 - we want to catch and retry any failure
            attempts = switch.get("post_attempts", 0) + 1
            logger.error("Failed to post tweet for switch %s (attempt %s): %s",
                         switch_id, attempts, exc)
            if attempts >= MAX_RETRY_ATTEMPTS:
                storage.update_switch_status(
                    switch_id, storage.STATUS_FAILED,
                    post_attempts=attempts, last_error=str(exc),
                )
            else:
                storage.update_switch_status(
                    switch_id, storage.STATUS_ARMED,
                    post_attempts=attempts, last_error=str(exc),
                )


_scheduler: "BackgroundScheduler | None" = None


def start_scheduler() -> BackgroundScheduler:
    global _scheduler
    if _scheduler is not None:
        return _scheduler

    _scheduler = BackgroundScheduler(timezone="UTC")
    _scheduler.add_job(
        check_and_trigger_switches,
        trigger="interval",
        minutes=1,
        id="deadmans_switch_check",
        max_instances=1,
        coalesce=True,
    )
    _scheduler.start()
    logger.info("Dead Man's Switch scheduler started (checking every 60s).")
    return _scheduler


def stop_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None