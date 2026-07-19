"""
app.py

Flask backend for XUPPU's Dead Man's Switch feature.

Run with:
    pip install -r requirements.txt
    cp .env.example .env   # then fill in your keys
    python app.py

Routes
------
POST /twitter/connect        -> { user_id } => { authorize_url }
GET  /twitter/callback        -> OAuth redirect target (code, state)
POST /switch/preview          -> { user_id, goal_id, goal_name, deadline,
                                    progress?, difficulty? }
                                  => generates & returns a roast tweet
                                  WITHOUT arming anything yet
POST /switch/arm               -> { user_id, goal_id, goal_name, deadline,
                                     tweet } => arms the switch
POST /switch/disarm            -> { user_id, goal_id } => disarms
GET  /switch/status?user_id=&goal_id= -> current switch record
POST /goals/sync                -> { user_id, goal_id, title, progress,
                                      deadline } mirrors goal completion
                                     state for the scheduler to read
POST /goals/delete               -> { user_id, goal_id } removes any
                                      associated switch + mirror entry
"""

import os
import uuid
import logging

from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, send_from_directory
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

import roast_generator as roast_generator
import scheduler
import storage as storage
import twitter_client

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500"])
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-secret-change-me")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deadmans_switch.api")

# Where the frontend should be redirected back to after OAuth completes.
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://127.0.0.1:5500")


def _err(message: str, status: int = 400):
    return jsonify({"ok": False, "error": message}), status


def _ok(payload: dict, status: int = 200):
    payload = {"ok": True, **payload}
    return jsonify(payload), status


@app.errorhandler(HTTPException)
def handle_http_error(exc):
    return _err(exc.description, exc.code or 500)


@app.errorhandler(Exception)
def handle_unexpected_error(exc):
    logger.exception("Unhandled API exception on %s", request.path)
    return _err("Internal server error. Check the backend logs for details.", 500)


# ------------------------------------------------------------------
# X (Twitter) OAuth
# ------------------------------------------------------------------

#actual twitter auth for connection with twitter api
"""
@app.route("/twitter/connect", methods=["POST"])
def twitter_connect():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    if not user_id:
        return _err("user_id is required")

    try:
        url = twitter_client.build_authorize_url(user_id)
    except RuntimeError as exc:
        return _err(str(exc), 500)

    return _ok({"authorize_url": url})


@app.route("/twitter/callback", methods=["GET"])
def twitter_callback():
    code = request.args.get("code")
    state = request.args.get("state")
    error = request.args.get("error")

    if error:
        return redirect(f"{FRONTEND_URL}?twitter_connect=denied")
    if not code or not state:
        return _err("Missing code or state in callback.")

    try:
        user_id = twitter_client.handle_oauth_callback(code, state)
    except ValueError as exc:
        return _err(str(exc), 400)
    except Exception as exc:  # noqa: BLE001
        return _err(f"Failed to complete X OAuth: {exc}", 502)

    return redirect(f"{FRONTEND_URL}?twitter_connect=success&user_id={user_id}")


@app.route("/twitter/disconnect", methods=["POST"])
def twitter_disconnect():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    if not user_id:
        return _err("user_id is required")
    twitter_client.disconnect(user_id)
    return _ok({"disconnected": True})
    
"""
#mock twitter workflow for hackathon
@app.route("/twitter/connect", methods=["POST"])
def twitter_connect():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")

    if not user_id:
        return _err("user_id is required")

    # Pretend the user connected Twitter.
    storage.set_user_tokens(user_id, {
        "access_token": "mock_access_token",
        "refresh_token": "mock_refresh_token",
        "expires_at": 9999999999,
        "token_type": "bearer"
    })
 #actual workflow that returns url
    """"
    return _ok({
        "authorize_url": "http://127.0.0.1:5500/chaos.html?twitter_connect=success"
    """
 #mock hackathon workflow
    return _ok({
    "connected": True
    })

# ------------------------------------------------------------------
# Dead Man's Switch
# ------------------------------------------------------------------

@app.route("/switch/preview", methods=["POST"])
def switch_preview():
    body = request.get_json(silent=True) or {}
    goal_name = body.get("goal_name")
    if not goal_name:
        return _err("goal_name is required")

    progress = int(body.get("progress", 0))
    difficulty = body.get("difficulty", "medium")
    days_overdue = int(body.get("days_overdue", 0))

    tweet = roast_generator.generate_roast_tweet(
        goal_name=goal_name,
        progress=progress,
        days_overdue=days_overdue,
        difficulty=difficulty,
    )
    return _ok({"tweet": tweet})


@app.route("/switch/arm", methods=["POST"])
def switch_arm():
    logger.info("/switch/arm received request")
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    goal_id = body.get("goal_id")
    goal_name = body.get("goal_name")
    deadline = body.get("deadline")
    tweet = body.get("tweet")

    missing = [k for k in ("user_id", "goal_id", "goal_name", "deadline", "tweet") if not body.get(k)]
    if missing:
        logger.warning("/switch/arm validation failed: missing=%s", ",".join(missing))
        return _err(f"Missing required fields: {', '.join(missing)}")

    logger.info("/switch/arm validating X connection user_id=%s goal_id=%s", user_id, goal_id)
    if not twitter_client.is_connected(user_id):
        logger.warning("/switch/arm rejected: X account not connected user_id=%s", user_id)
        return _err("Connect an X account before arming the switch.", 403)

    try:
        logger.info("/switch/arm looking up existing switch user_id=%s goal_id=%s", user_id, goal_id)
        existing = storage.get_switch_by_goal(user_id, goal_id)
        switch_id = existing["id"] if existing else str(uuid.uuid4())

        logger.info("/switch/arm building switch record switch_id=%s", switch_id)
        record = {
            "id": switch_id, "user_id": user_id, "goal_id": goal_id,
            "goal_name": goal_name, "deadline": deadline, "tweet": tweet,
            "status": storage.STATUS_ARMED, "post_attempts": 0,
            "created_at": storage.now_iso(), "updated_at": storage.now_iso(),
        }
        logger.info("/switch/arm saving switch switch_id=%s", switch_id)
        storage.upsert_switch(switch_id, record)
    except Exception as exc:  # noqa: BLE001
        logger.exception("/switch/arm failed user_id=%s goal_id=%s", user_id, goal_id)
        return _err(f"Unable to save switch: {exc}", 500)

    logger.info("/switch/arm armed successfully switch_id=%s", switch_id)
    return _ok({"switch": record})


@app.route("/switch/disarm", methods=["POST"])
def switch_disarm():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    goal_id = body.get("goal_id")
    if not user_id or not goal_id:
        return _err("user_id and goal_id are required")

    existing = storage.get_switch_by_goal(user_id, goal_id)
    if not existing:
        return _ok({"switch": None, "message": "No switch existed for this goal."})

    if existing["status"] == storage.STATUS_TRIGGERED:
        # Already posted -- disarming now doesn't un-post the tweet.
        return _ok({"switch": existing, "message": "Switch already triggered; nothing to disarm."})

    updated = storage.update_switch_status(existing["id"], storage.STATUS_DISARMED,
                                            reason=body.get("reason", "manual"))
    return _ok({"switch": updated})


@app.route("/switch/status", methods=["GET"])
def switch_status():
    user_id = request.args.get("user_id")
    goal_id = request.args.get("goal_id")
    if not user_id:
        return _err("user_id is required")

    if goal_id:
        record = storage.get_switch_by_goal(user_id, goal_id)
        return _ok({"switch": record})

    records = storage.list_switches_for_user(user_id)
    return _ok({"switches": records})


# ------------------------------------------------------------------
# Goal lifecycle integration hooks
#
# The existing XUPPU frontend (app.js) keeps goals client-side. These
# two endpoints let it mirror just enough state (completion % and
# deadline) for the scheduler to check without needing a shared
# database. Call /goals/sync from saveGoals(), and /goals/delete from
# the goal-deletion action handler.
# ------------------------------------------------------------------

@app.route("/goals/sync", methods=["POST"])
def goals_sync():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    goal_id = body.get("goal_id")
    title = body.get("title", "")
    progress = int(body.get("progress", 0))
    deadline = body.get("deadline", "")

    if not user_id or not goal_id:
        return _err("user_id and goal_id are required")

    storage.sync_goal(user_id, goal_id, title, progress, deadline)

    # If the goal just hit 100%, auto-disarm any live switch for it.
    if progress >= 100:
        existing = storage.get_switch_by_goal(user_id, goal_id)
        if existing and existing["status"] == storage.STATUS_ARMED:
            storage.update_switch_status(existing["id"], storage.STATUS_DISARMED,
                                          reason="goal_completed")

    return _ok({"synced": True})


@app.route("/goals/delete", methods=["POST"])
def goals_delete():
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    goal_id = body.get("goal_id")
    if not user_id or not goal_id:
        return _err("user_id and goal_id are required")

    storage.remove_goal(user_id, goal_id)
    removed = storage.delete_switches_for_goal(user_id, goal_id)
    return _ok({"removed_switches": removed})


@app.route("/health", methods=["GET"])
def health():
    return _ok({"status": "alive", "message": "Xuppu is watching."})


# Serve the frontend
@app.route("/")
def home():
    return send_from_directory(".", "chaos.html")


# CSS
@app.route("/css/<path:filename>")
def css_files(filename):
    return send_from_directory("css", filename)


# JavaScript
@app.route("/js/<path:filename>")
def js_files(filename):
    return send_from_directory("js", filename)


# Audio
@app.route("/sounds/<path:filename>")
def sound_files(filename):
    return send_from_directory("sounds", filename)

if __name__ == "__main__":
    scheduler.start_scheduler()
    try:
        app.run(
            host="0.0.0.0",
            port=int(os.environ.get("PORT", 5000)),
            debug=False,
            use_reloader=False
)
    finally:
        scheduler.stop_scheduler()
