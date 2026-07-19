"""
storage.py

Simple in-memory storage for the hackathon demo.
Everything resets when the Flask server stops.
"""

from datetime import datetime, timezone

# ----------------------------
# Switch statuses
# ----------------------------

STATUS_ARMED = "ARMED"
STATUS_DISARMED = "DISARMED"
STATUS_TRIGGERED = "TRIGGERED"
STATUS_FAILED = "FAILED"

# ----------------------------
# Dead Man's Switch storage
# ----------------------------

SWITCHES = {}
USER_TOKENS = {}
GOALS = {}


# ----------------------------
# Time helper
# ----------------------------

def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ----------------------------
# Switch helpers
# ----------------------------

def save_switch(record):
    SWITCHES[record["id"]] = record
    return record


def update_switch(record):
    SWITCHES[record["id"]] = record
    return record


# app.py is expecting this
def upsert_switch(switch_id, record):
    SWITCHES[switch_id] = record
    return record

def update_switch_status(switch_id, status, reason=None, **fields):
    switch = SWITCHES.get(switch_id)
    if not switch:
        return None

    switch["status"] = status
    switch["updated_at"] = now_iso()

    if reason:
        switch["reason"] = reason

    switch.update(fields)

    SWITCHES[switch_id] = switch
    return switch

def get_switch(switch_id):
    return SWITCHES.get(switch_id)


def delete_switch(switch_id):
    SWITCHES.pop(switch_id, None)


def get_switch_by_goal(user_id, goal_id):
    for switch in SWITCHES.values():
        if (
            switch["user_id"] == user_id
            and switch["goal_id"] == goal_id
        ):
            return switch
    return None


def list_switches_for_user(user_id):
    return [
        switch
        for switch in SWITCHES.values()
        if switch["user_id"] == user_id
    ]


def all_armed_switches():
    return [
        switch
        for switch in SWITCHES.values()
        if switch.get("status") == STATUS_ARMED
    ]


# ----------------------------
# Mock Twitter storage
# ----------------------------

def set_user_tokens(user_id, token_record):
    USER_TOKENS[user_id] = token_record


def get_user_tokens(user_id):
    return USER_TOKENS.get(user_id)


def delete_user_tokens(user_id):
    USER_TOKENS.pop(user_id, None)


# ----------------------------
# Goal syncing
# ----------------------------

def save_goal(user_id, goal):
    GOALS[(user_id, goal["goal_id"])] = goal


def get_goal(user_id, goal_id):
    return GOALS.get((user_id, goal_id))


def delete_goal(user_id, goal_id):
    GOALS.pop((user_id, goal_id), None)


def sync_goal(user_id, goal_id, title, progress, deadline):
    return save_goal(user_id, {
        "goal_id": goal_id,
        "title": title,
        "progress": progress,
        "deadline": deadline,
        "updated_at": now_iso(),
    })


def get_goal_progress(user_id, goal_id):
    goal = get_goal(user_id, goal_id)
    return goal.get("progress") if goal else None


def remove_goal(user_id, goal_id):
    delete_goal(user_id, goal_id)


def delete_switches_for_goal(user_id, goal_id):
    switch_ids = [
        switch_id for switch_id, switch in SWITCHES.items()
        if switch.get("user_id") == user_id and switch.get("goal_id") == goal_id
    ]
    for switch_id in switch_ids:
        delete_switch(switch_id)
    return len(switch_ids)
