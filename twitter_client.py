"""
twitter_client.py

Handles:
  1. The OAuth 2.0 Authorization Code + PKCE flow ("Login with X")
  2. Storing/refreshing the resulting access + refresh tokens
  3. Posting a tweet on the user's behalf via Tweepy

Token storage is plain JSON (see storage.py) to keep this hackathon MVP
lightweight. For anything beyond a demo, encrypt tokens at rest before
writing them to disk.
"""

import base64
import hashlib
import os
import secrets
import time
import logging
from typing import Any, Dict, Tuple

import requests
import tweepy
from dotenv import load_dotenv

import storage as storage

load_dotenv()

TWITTER_CLIENT_ID = os.environ.get("TWITTER_CLIENT_ID")
TWITTER_CLIENT_SECRET = os.environ.get("TWITTER_CLIENT_SECRET")
TWITTER_REDIRECT_URI = os.environ.get("TWITTER_REDIRECT_URI", "http://127.0.0.1:5000/twitter/callback")

AUTH_BASE_URL = "https://twitter.com/i/oauth2/authorize"
TOKEN_URL = "https://api.twitter.com/2/oauth2/token"
SCOPES = "tweet.read tweet.write users.read offline.access"

# In-memory map of oauth "state" -> pkce verifier + user_id, cleared once
# the callback consumes it. Fine for a single-process hackathon deploy.
_PENDING_AUTH: Dict[str, Dict[str, Any]] = {}
logger = logging.getLogger("deadmans_switch.twitter")


def _generate_pkce_pair() -> Tuple[str, str]:
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(40)).rstrip(b"=").decode("ascii")
    challenge = base64.urlsafe_b64encode(
        hashlib.sha256(verifier.encode("ascii")).digest()
    ).rstrip(b"=").decode("ascii")
    return verifier, challenge


def build_authorize_url(user_id: str) -> str:
    """Starts the OAuth flow for a given local user_id and returns the
    URL the browser should be redirected to."""
    if not TWITTER_CLIENT_ID:
        raise RuntimeError("TWITTER_CLIENT_ID is not set. Add it to your .env file.")

    state = secrets.token_urlsafe(24)
    verifier, challenge = _generate_pkce_pair()
    _PENDING_AUTH[state] = {"user_id": user_id, "verifier": verifier, "created_at": time.time()}

    params = {
        "response_type": "code",
        "client_id": TWITTER_CLIENT_ID,
        "redirect_uri": TWITTER_REDIRECT_URI,
        "scope": SCOPES,
        "state": state,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
    }
    query = "&".join(f"{k}={requests.utils.quote(v)}" for k, v in params.items())
    return f"{AUTH_BASE_URL}?{query}"


def handle_oauth_callback(code: str, state: str) -> str:
    """Exchanges the authorization code for tokens and stores them.
    Returns the local user_id the tokens belong to."""
    pending = _PENDING_AUTH.pop(state, None)
    if not pending:
        raise ValueError("Unknown or expired OAuth state. Please restart the connect flow.")

    user_id = pending["user_id"]
    verifier = pending["verifier"]

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": TWITTER_CLIENT_ID,
        "redirect_uri": TWITTER_REDIRECT_URI,
        "code_verifier": verifier,
    }
    auth = None
    if TWITTER_CLIENT_SECRET:
        auth = (TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET)

    resp = requests.post(TOKEN_URL, data=data, auth=auth, timeout=15)
    resp.raise_for_status()
    payload = resp.json()

    token_record = {
        "access_token": payload["access_token"],
        "refresh_token": payload.get("refresh_token"),
        "expires_at": time.time() + payload.get("expires_in", 7200),
        "token_type": payload.get("token_type", "bearer"),
    }
    storage.set_user_tokens(user_id, token_record)
    return user_id


def _refresh_if_needed(user_id: str, token_record: Dict[str, Any]) -> Dict[str, Any]:
    if time.time() < token_record["expires_at"] - 60:
        return token_record

    if not token_record.get("refresh_token"):
        raise RuntimeError("Access token expired and no refresh token is available. Reconnect X account.")

    data = {
        "grant_type": "refresh_token",
        "refresh_token": token_record["refresh_token"],
        "client_id": TWITTER_CLIENT_ID,
    }
    auth = None
    if TWITTER_CLIENT_SECRET:
        auth = (TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET)

    resp = requests.post(TOKEN_URL, data=data, auth=auth, timeout=15)
    resp.raise_for_status()
    payload = resp.json()

    new_record = {
        "access_token": payload["access_token"],
        "refresh_token": payload.get("refresh_token", token_record.get("refresh_token")),
        "expires_at": time.time() + payload.get("expires_in", 7200),
        "token_type": payload.get("token_type", "bearer"),
    }
    storage.set_user_tokens(user_id, new_record)
    return new_record


def is_connected(user_id: str) -> bool:
    return storage.get_user_tokens(user_id) is not None


def disconnect(user_id: str) -> None:
    storage.delete_user_tokens(user_id)


#actual twitter posting for twitter api
#def post_tweet(user_id: str, text: str) -> Dict[str, Any]:
#    """Posts `text` as the connected user. Returns the created tweet's
#    API response payload. Raises if the user hasn't connected X."""
#    token_record = storage.get_user_tokens(user_id)
#    if not token_record:
#        raise RuntimeError(f"No X account connected for user {user_id}.")
#
#    token_record = _refresh_if_needed(user_id, token_record)
#
#    client = tweepy.Client(bearer_token=None, access_token=token_record["access_token"])
#    response = client.create_tweet(text=text)
#    return response.data

#mock twitter for hackathon: posting tweets
def post_tweet(user_id: str, text: str) -> Dict[str, Any]:
    """Mock version used during development."""

    if not isinstance(user_id, str) or not user_id.strip():
        raise RuntimeError("A valid user_id is required to post a mock tweet.")
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError("Tweet text is required to post a mock tweet.")

    logger.info("Mock tweet posted for user_id=%s (%d characters)", user_id, len(text))
 
    return {
        "id": "mock_tweet_123",
        "text": text,
    }
