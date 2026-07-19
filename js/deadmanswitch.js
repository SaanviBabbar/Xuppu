/* =====================================================================
   deadmans_switch.js

   Frontend module for XUPPU's Dead Man's Switch feature.

   Load this file AFTER app.js in chaos.html:
     <script src="js/app.js"></script>
     <script src="js/deadmans_switch.js"></script>

   It assumes the following globals already exist from app.js:
     goals, saveGoals, getGoalProgress, escapeHtml, AudioSynth,
     showScreenNotification, CATEGORIES

   Integration points you need to add inside app.js (see README.md for
   exact snippets):
     1. After `await saveGoals();` inside onMilestoneToggle(), addGoal(),
        and any place milestone completion changes progress -> call
        `DeadManSwitch.syncGoal(goal)`.
     2. Inside the `del` branch of onGoalAction() -> call
        `DeadManSwitch.onGoalDeleted(id)` before the goal is spliced out.
   ===================================================================== */

const DeadManSwitch = (function () {
  const BACKEND_URL = window.XUPPU_DMS_BACKEND_URL || "http://127.0.0.1:5000";
  const USER_ID_KEY = "xuppu_dms_user_id";

  function getUserId() {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  }

  const state = {
    userId: getUserId(),
    twitterConnected: false,
    switchesByGoal: {}, // goalId -> switch record
    roastsByGoal: {}, // goalId -> generated roast; survives UI re-renders
    countdownIntervals: {}, // goalId -> interval id
  };

  async function apiCall(path, options = {}) {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json().catch(() => null)
      : null;
    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || `Request to ${path} failed (${res.status} ${res.statusText})`);
    }
    if (!data) throw new Error(`Request to ${path} returned invalid JSON.`);
    return data;
  }

  /* ---------------- X connection ---------------- */
 /*FUNCTION FOR ACTUAL TWITTER CONNECTION
  async function connectTwitter() {
    try {
      const data = await apiCall("/twitter/connect", {
        method: "POST",
        body: JSON.stringify({ user_id: state.userId }),
      });
      window.open(data.authorize_url, "_blank", "noopener,width=520,height=720");
      showScreenNotification("🔗 Complete the X login in the new tab, then come back here.");
    } catch (e) {
      showScreenNotification("❌ Couldn't start X connection: " + e.message);
    }
  }
 */

  function checkTwitterCallbackParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("twitter_connect") === "success") {
      state.twitterConnected = true;
      showScreenNotification("✅ X account connected. Xuppu is delighted.");
      renderPanel();
      // Clean the URL so a refresh doesn't re-trigger this.
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("twitter_connect") === "denied") {
      showScreenNotification("🚫 X connection was cancelled.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }


 /* mock twitter function for hackathon*/
  async function connectTwitter() {
    try {
      const data = await apiCall("/twitter/connect", {
        method: "POST",
        body: JSON.stringify({ user_id: state.userId }),
      });

      if (data.connected) {
        state.twitterConnected = true;
        showScreenNotification("✅ Mock X account connected!");
        renderPanel();
      }
    } catch (e) {
      showScreenNotification("❌ Couldn't connect X: " + e.message);
    }
  }

  /* ---------------- Switch lifecycle ---------------- */

  async function refreshSwitchStatuses() {
    try {
      const data = await apiCall(`/switch/status?user_id=${encodeURIComponent(state.userId)}`);
      state.switchesByGoal = {};
      (data.switches || []).forEach((s) => {
        state.switchesByGoal[s.goal_id] = s;
      });
    } catch (e) {
      console.error("Dead Man's Switch status refresh failed:", e);
      showScreenNotification("⚠️ Dead Man's Switch status unavailable: " + e.message);
      state.switchesByGoal = {};
    }
  }

  async function previewRoast(goal) {
    const progress = typeof getGoalProgress === "function" ? getGoalProgress(goal) : 0;
    const daysOverdue = 0; // preview happens before the deadline, so always 0
    const data = await apiCall("/switch/preview", {
      method: "POST",
      body: JSON.stringify({
        goal_name: goal.title,
        progress,
        difficulty: goal.difficulty || "medium",
        days_overdue: daysOverdue,
      }),
    });
    return data.tweet;
  }

  async function armSwitch(goal, tweetText) {
     console.log("armSwitch called", goal);
    const data = await apiCall("/switch/arm", {
      method: "POST",
      body: JSON.stringify({
        user_id: state.userId,
        goal_id: goal.id,
        goal_name: goal.title,
        deadline: goal.deadline,
        tweet: tweetText,
      }),
    });
    state.switchesByGoal[goal.id] = data.switch;
    AudioSynth.playWarning();
    showScreenNotification(`🚨 SWITCH ARMED for "${goal.title}". Xuppu is watching the clock.`);
    renderPanel();
  }

  async function disarmSwitch(goal, reason = "manual") {
    const data = await apiCall("/switch/disarm", {
      method: "POST",
      body: JSON.stringify({ user_id: state.userId, goal_id: goal.id, reason }),
    });
    if (data.switch) state.switchesByGoal[goal.id] = data.switch;
    AudioSynth.playSelect();
    renderPanel();
  }

  /** Call this any time a goal's progress or deadline changes (after
   * saveGoals() in app.js). Mirrors state to the backend and
   * auto-disarms if the goal just hit 100%. */
  async function syncGoal(goal) {
    const progress = typeof getGoalProgress === "function" ? getGoalProgress(goal) : 0;
    try {
      await apiCall("/goals/sync", {
        method: "POST",
        body: JSON.stringify({
          user_id: state.userId,
          goal_id: goal.id,
          title: goal.title,
          progress,
          deadline: goal.deadline,
        }),
      });
      if (progress >= 100 && state.switchesByGoal[goal.id]?.status === "ARMED") {
        state.switchesByGoal[goal.id].status = "DISARMED";
        showScreenNotification(`🛡️ Dead Man's Switch for "${goal.title}" auto-disarmed. Crisis averted.`);
        AudioSynth.playLevelUp();
        renderPanel();
      }
    } catch (e) {
      console.error("Dead Man's Switch goal sync failed:", e);
      showScreenNotification("⚠️ Goal sync failed: " + e.message);
    }
  }

  /** Call this before a goal is removed from the `goals` array. */
  async function onGoalDeleted(goalId) {
    try {
      await apiCall("/goals/delete", {
        method: "POST",
        body: JSON.stringify({ user_id: state.userId, goal_id: goalId }),
      });
    } catch (e) {
      console.error("Dead Man's Switch goal deletion failed:", e);
      showScreenNotification("⚠️ Switch cleanup failed: " + e.message);
    }
    delete state.switchesByGoal[goalId];
    delete state.roastsByGoal[goalId];
    clearCountdown(goalId);
  }

  /* ---------------- Countdown ---------------- */

  function clearCountdown(goalId) {
    if (state.countdownIntervals[goalId]) {
      clearInterval(state.countdownIntervals[goalId]);
      delete state.countdownIntervals[goalId];
    }
  }

  function formatCountdown(ms) {
    if (ms <= 0) return "00:00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function startCountdown(goalId, deadlineStr, el) {
    clearCountdown(goalId);
    const deadline = new Date(deadlineStr + "T23:59:59").getTime();
    const tick = () => {
      const remaining = deadline - Date.now();
      if (!el.isConnected) {
        clearCountdown(goalId);
        return;
      }
      el.textContent = remaining > 0 ? formatCountdown(remaining) : "\u{1F4A5} DETONATED";
    };
    tick();
    state.countdownIntervals[goalId] = setInterval(tick, 1000);
  }

  /* ---------------- UI ---------------- */

  function activeGoals() {
    return (typeof goals !== "undefined" ? goals : []).filter(
      (g) => (typeof getGoalProgress === "function" ? getGoalProgress(g) : 0) < 100
    );
  }

  function statusBadge(status) {
    const map = {
      ARMED: { label: "\u{1F6A8} ARMED", cls: "dms-badge-armed" },
      DISARMED: { label: "\u{1F6E1} DISARMED", cls: "dms-badge-disarmed" },
      TRIGGERED: { label: "\u{1F4A5} TRIGGERED", cls: "dms-badge-triggered" },
      FAILED: { label: "\u26A0 FAILED TO POST", cls: "dms-badge-failed" },
    };
    return map[status] || { label: "\u2796 NOT ARMED", cls: "dms-badge-none" };
  }

  function renderPanel() {
    const root = document.getElementById("deadmansSwitchPanel");
    if (!root) return;

    const goalsList = activeGoals();

    if (!state.twitterConnected) {
      root.innerHTML = `
        <div class="dms-connect-row">
          <p class="dms-copy">Connect X to unlock high-stakes accountability. 100% opt-in.</p>
          <button class="btn danger dms-connect-btn" id="dmsConnectBtn">\u{1F517} CONNECT X ACCOUNT</button>
        </div>`;
      document.getElementById("dmsConnectBtn").addEventListener("click", connectTwitter);
      return;
    }

    if (goalsList.length === 0) {
      root.innerHTML = `<p class="dms-copy">Add an active goal above to arm a switch against it.</p>`;
      return;
    }

    root.innerHTML = goalsList
      .map((g) => {
        const sw = state.switchesByGoal[g.id];
        const roast = state.roastsByGoal[g.id];
        const badge = statusBadge(sw?.status);
        return `
        <div class="dms-goal-card" data-goal-id="${g.id}">
          <div class="dms-goal-head">
            <span class="dms-goal-title">${escapeHtml(g.title)}</span>
            <span class="dms-badge ${badge.cls}">${badge.label}</span>
          </div>
          ${
            sw?.status === "ARMED"
              ? `<div class="dms-countdown" data-countdown="${g.id}">00:00:00:00</div>
                 <div class="dms-tweet-preview">${escapeHtml(sw.tweet)}</div>
                 <button class="btn ghost dms-disarm-btn" data-goal="${g.id}">\u{1F6E1} DISARM</button>`
              : `<div class="dms-tweet-preview" data-preview="${g.id}" ${roast ? "" : "style=\"display:none;\""}>${roast ? escapeHtml(roast) : ""}</div>
                 <button class="btn dms-preview-btn" data-goal="${g.id}">\u{1F441} ${roast ? "REGENERATE ROAST" : "GENERATE ROAST"}</button>
                 <button class="btn danger dms-arm-btn" data-goal="${g.id}" ${state.roastsByGoal[g.id] ? "" : "disabled"}>\u2620 ARM SWITCH</button>`
          }
        </div>`;
      })
      .join("");

    // Wire up countdowns
    goalsList.forEach((g) => {
      const sw = state.switchesByGoal[g.id];
      if (sw?.status === "ARMED") {
        const el = root.querySelector(`[data-countdown="${g.id}"]`);
        if (el) startCountdown(g.id, g.deadline, el);
      }
    });

    // Wire up buttons
    root.querySelectorAll(".dms-preview-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        // Event.currentTarget is cleared after an await, so keep stable DOM
        // reference before calling the backend.
        const previewButton = e.currentTarget;
        const goalId = previewButton.getAttribute("data-goal");
        const goal = goalsList.find((g) => g.id === goalId);
        previewButton.textContent = "\u23F3 Xuppu is thinking of something mean...";
        previewButton.disabled = true;
        try {
          const tweet = await previewRoast(goal);
          state.roastsByGoal[goalId] = tweet;
          renderPanel();
        } catch (err) {
          showScreenNotification("\u274C Roast generation failed: " + err.message);
          renderPanel();
        }
      });
    });

    root.querySelectorAll(".dms-arm-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const goalId = e.currentTarget.getAttribute("data-goal");
        const goal = goalsList.find((g) => g.id === goalId);
        const tweetText = state.roastsByGoal[goalId];
        if (!tweetText) {
          showScreenNotification("⚠️ Generate a roast before arming the switch.");
          return;
        }
        const confirmed = window.confirm(
          `This WILL be posted publicly to your connected X account if "${goal.title}" is not finished by ${goal.deadline}. Continue?`
        );
        if (!confirmed) return;
        try {
          await armSwitch(goal, tweetText);
          delete state.roastsByGoal[goalId];
        } catch (err) {
          showScreenNotification("\u274C Couldn't arm switch: " + err.message);
        }
      });
    });

    root.querySelectorAll(".dms-disarm-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const goalId = e.currentTarget.getAttribute("data-goal");
        const goal = goalsList.find((g) => g.id === goalId);
        try {
          await disarmSwitch(goal);
          showScreenNotification(`\u{1F6E1} Switch disarmed for "${goal.title}".`);
        } catch (err) {
          showScreenNotification("\u274C Couldn't disarm switch: " + err.message);
        }
      });
    });
  }

  async function init() {
    checkTwitterCallbackParams();
    // Optimistically assume connected if we already have an armed/disarmed
    // switch on record (backend enforces the real check on /switch/arm).
    await refreshSwitchStatuses();
    if (Object.keys(state.switchesByGoal).length > 0) state.twitterConnected = true;
    // Probe connection status implicitly: try a lightweight preview-less check.
    renderPanel();
    setInterval(refreshSwitchStatuses, 30000);
  }

  return {
    init,
    connectTwitter,
    syncGoal,
    onGoalDeleted,
    renderPanel,
    _state: state, // exposed for debugging only
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  // app.js's own init() already ran its IIFE by the time this fires
  // since script tags execute in order; this just bootstraps our panel.
  DeadManSwitch.init();
});
