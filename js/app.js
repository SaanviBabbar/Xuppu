/* add music, starts playing when screen is clicked */

const ambientMusic = new Audio("sounds/arcade_loop.mp3");
ambientMusic.loop = true;
ambientMusic.volume = 0.2;

function startMusic() {
    ambientMusic.play().catch(err => console.log(err));
    document.removeEventListener("click", startMusic);
    document.removeEventListener("keydown", startMusic);
}

document.addEventListener("click", startMusic);
document.addEventListener("keydown", startMusic);

/*XUPPU INTERRUPTS YOU*/
function xuppuInterrupt(title, message, duration = 3000) {
    const overlay = document.getElementById("xuppuInterrupt");

    document.getElementById("interruptTitle").textContent = title;
    document.getElementById("interruptMessage").textContent = message;

    overlay.classList.remove("hidden");

    setTimeout(() => {
        overlay.classList.add("hidden");
    }, duration);
}

/* ================= CONFIG ================= */
const LEVELS = [
  { name:'CHILL',     color:'#6b9b37', pill:'#6b9b37', text:'#fff', anim:'bounce'  },
  { name:'SIDE-EYE',  color:'#8a9b37', pill:'#8a9b37', text:'#fff', anim:'bounce'  },
  { name:'SMIRKING',  color:'#ffc93c', pill:'#c99a1f', text:'#1a1410', anim:'bounce'  },
  { name:'CACKLING',  color:'#ff9d3d', pill:'#e07b1a', text:'#1a1410', anim:'shake'   },
  { name:'MELTDOWN',  color:'#ff3d5f', pill:'#ff3d5f', text:'#fff', anim:'shudder' },
];
const ROASTS = [
  [ // 0 chill
    "Look at you, ahead of schedule. Suspicious, but fine.",
    "Xuppu is cautiously impressed. Don't ruin it.",
    "On track. Xuppu has nothing to say, which is rare.",
    "You're doing fine. Xuppu is bored. Xuppu likes it that way."
  ],
  [ // 1 side-eye
    "Xuppu is watching. Just... watching.",
    "That's a whole lot of 'later' energy you've got going.",
    "Slight gap forming. Xuppu has raised one eyebrow.",
    "Not bad, not great. The monkey remains unconvinced."
  ],
  [ // 2 smirking
    "Oh, you're 'getting to it soon'? Sure you are.",
    "Xuppu has seen this movie before. It ends in panic.",
    "That progress bar is basically a cry for help.",
    "Xuppu is smiling. That's never a good sign for you."
  ],
  [ // 3 cackling
    "The math isn't mathing and Xuppu thinks it's hilarious.",
    "Xuppu is cackling. Actual tears. From a monkey.",
    "This is the part where you panic. Xuppu is enjoying it.",
    "Deadline's closing in and you're still 'thinking about starting.' Iconic."
  ],
  [ // 4 meltdown
    "XUPPU IS SCREAMING. THIS IS A BANANA-LEVEL EMERGENCY.",
    "There is no more time for feelings. Only doing.",
    "Xuppu has thrown a banana peel in protest. Move.",
    "This is the worst goal Xuppu has ever witnessed. Go. NOW."
  ]
];

const DONE_LINES = [
  "Done. Xuppu is speechless. Genuinely didn't see that coming.",
  "100%?! Xuppu is doing a little dance. Don't tell anyone.",
  "Finished. Xuppu will allow one (1) proud noise.",
  "You actually did it. Xuppu owes the jungle an apology."
];
const IDLE_LINE = "No goals yet. Xuppu naps. This is your fault, somehow.";
const STAMP_WORDS = ["PATHETIC","LMAO","QUESTIONABLE","DOUBTFUL","DENIED","EMBARRASSING","YIKES","NOT BUYING IT"];
const PEELS = ["🍌"];
const PROJECTILES_BY_LEVEL = {
  1: ["🧦","🧻"],
  2: ["🥥","☕","🧦"],
  3: ["📚","⏰","🍅","🥥"],
  4: ["💻","🗄️","🔥🍌","⏰","📚"]
};
const PLANE_INSULTS = [
  "You had ONE job.",
  "Still 'thinking about it'?",
  "This message was faster than your progress.",
  "Started yet? No? Cool cool cool.",
  "Xuppu flew further than your goal did."
];
const IMPACT_WORDS = ["THWACK","BONK","SPLAT","SKREEE","PLOP","WHAM"];
const FOURTH_WALL_IDLE = [
  "You moved the mouse. Not the progress bar.",
  "Interesting strategy. Pretending this page will do the work.",
  "Staring at the screen isn't a subtask.",
  "Xuppu can see the cursor hasn't touched a single button."
];
const FOURTH_WALL_TIME = mins => [
  `You've been on this page ${mins} minute${mins===1?'':'s'}. Still thinking?`,
  `${mins} minute${mins===1?'':'s'} in and the progress bar hasn't moved. Bold.`,
  `Xuppu has now judged you for ${mins} straight minute${mins===1?'':'s'}.`
];
const STAGES = [
  { name: 'Cubicle Hell (Office)', maxHP: 100 },
  { name: 'Jungle Canopy', maxHP: 150 },
  { name: 'Volcanic Furnace', maxHP: 200 },
  { name: 'Lunar Crater', maxHP: 300 },
  { name: 'Banana Dimension', maxHP: 500 }
];
const SHOP_ITEMS = [
  { id: 'eyebrows', name: 'Angry Eyebrows', cost: 30, icon: '😠', description: 'Force furious eyebrows on Xuppu' },
  { id: 'sunglasses', name: 'Sunglasses', cost: 50, icon: '🕶️', description: 'Give Xuppu some cool shades' },
  { id: 'coffee', name: 'Coffee Cup', cost: 60, icon: '☕', description: 'Give Xuppu coffee & relaxes him' },
  { id: 'goldenpeel', name: 'Golden Peel', cost: 80, icon: '✨🍌', description: 'Turn peels into shiny gold peels' },
  { id: 'crown', name: 'Golden Crown', cost: 100, icon: '👑', description: 'Dress Xuppu as royalty' },
  { id: 'disco', name: 'Disco Mode', cost: 150, icon: '🪩', description: 'Trigger rainbow background party!' }
];
const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', desc: 'Complete first goal.', icon: '🏆' },
  { id: 'speedrunner', name: 'Speedrunner', desc: 'Complete 3 goals in one day.', icon: '⚡' },
  { id: 'burn_survivor', name: 'Burn Survivor', desc: 'Receive 50 insults.', icon: '🔥' },
  { id: 'golden_banana', name: 'Banana Hoarder', desc: 'Accumulate 200 bananas.', icon: '🍌' },
  { id: 'slayer', name: 'Dragon Slayer', desc: 'Defeat Xuppu for the first time.', icon: '⚔️' },
  { id: 'big_spender', name: 'Big Spender', desc: 'Buy your first shop item.', icon: '💰' },
  { id: 'untouchable', name: 'Untouchable', desc: 'Deflect 10 projectiles.', icon: '🛡️' },
  { id: 'streak_master', name: 'Streak Master', desc: 'Reach a 7-day milestone streak.', icon: '🔥' }
];
const CATEGORIES = {
  study: { icon: '📚', label: 'Study' },
  work: { icon: '💼', label: 'Work' },
  fitness: { icon: '💪', label: 'Fitness' },
  personal: { icon: '🏠', label: 'Personal' },
  projects: { icon: '🛠', label: 'Projects' }
};
const DIFFICULTY = {
  easy: { label: 'Easy', xpMult: 0.75, bananaMult: 0.75, bossDmg: 1 },
  medium: { label: 'Medium', xpMult: 1, bananaMult: 1, bossDmg: 2 },
  hard: { label: 'Hard', xpMult: 1.5, bananaMult: 1.5, bossDmg: 3 }
};
// Random events with per-event cooldowns (ms)
const RANDOM_EVENTS = [
  { id: 'deadline_check', weight: 25, cooldown: 90000, minLevel: 1 },
  { id: 'monkey_ambush', weight: 30, cooldown: 60000, minLevel: 0 },
  { id: 'plane_storm', weight: 25, cooldown: 120000, minLevel: 1 },
  { id: 'banana_barrage', weight: 20, cooldown: 90000, minLevel: 0 }
];
const DEADLINE_MESSAGES = [
  'Every minute you stall, the deadline gets closer.',
  'Xuppu senses your procrastination. ACT NOW.',
  'Your future self is screaming. Listen.',
  'The calendar does not care about your excuses.',
  'Time is a boss fight. You are losing HP.'
];

/* ================= STATE ================= */
let goals = [];
let burnCount = 0;
const notifiedLevels = {}; // goalId -> highest level already counted as a burn
const pageLoadTime = Date.now();
let lastMouseMove = Date.now();
document.addEventListener('mousemove', () => { lastMouseMove = Date.now(); });
// Gamification stats
let xp = 0;
let level = 1;
let bananas = 0;
let bossHP = 100;
let bossMaxHP = 100;
let currentStage = 1;
let soundEnabled = true;
let purchasedItems = [];
let equippedItems = [];
let unlockedAchievements = [];
let dailyQuests = [];
// Combo System
let comboCount = 1;
let comboTimer = null;
let comboTimeLeft = 0;
const COMBO_DURATION = 120; // 2 minutes
// Boss Attacks
let attackWarningTimer = null;
let attackWarningTimeLeft = 5;
let isAttackActive = false;
let currentAttackType = '';
let deflectCount = 0;
let attackInterval = null;
// Daily streak & cumulative stats
let streakCount = 0;
let lastActiveDate = '';
let gameStats = {
  totalMilestonesCompleted: 0,
  longestStreak: 0,
  totalBananasEarned: 0,
  totalXpEarned: 0,
  goalsCompletedThisMonth: 0,
  goalsCreatedThisMonth: 0
};
const eventCooldowns = {}; // eventId -> last trigger timestamp
let isTakeoverActive = false;
let draggedMilestone = null;

/* ================= AUDIO SYNTHESIZER ================= */
const AudioSynth = {
  ctx: null,
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      console.warn("Web Audio API not supported");
    }
  },
  playTone(freq, type, duration, gainStart = 0.1) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  },
  playHit() {
    this.playTone(160, 'sawtooth', 0.15, 0.15);
    setTimeout(() => this.playTone(110, 'sawtooth', 0.2, 0.1), 80);
  },
  playCrit() {
    this.playTone(320, 'sawtooth', 0.2, 0.22);
    setTimeout(() => this.playTone(190, 'sawtooth', 0.25, 0.18), 60);
    setTimeout(() => this.playTone(95, 'sawtooth', 0.35, 0.15), 120);
  },
  playLevelUp() {
    this.playTone(261.63, 'sine', 0.12, 0.15); // C4
    setTimeout(() => this.playTone(329.63, 'sine', 0.12, 0.15), 90); // E4
    setTimeout(() => this.playTone(392.00, 'sine', 0.12, 0.15), 180); // G4
    setTimeout(() => this.playTone(523.25, 'sine', 0.28, 0.2), 270); // C5
  },
  playShopBuy() {
    this.playTone(784, 'triangle', 0.08, 0.15); // G5
    setTimeout(() => this.playTone(1174.66, 'triangle', 0.2, 0.15), 70); // D6
  },
  playDefeat() {
    this.playTone(440, 'sawtooth', 0.15, 0.2); // A4
    setTimeout(() => this.playTone(392, 'sawtooth', 0.15, 0.2), 120); // G4
    setTimeout(() => this.playTone(349.23, 'sawtooth', 0.15, 0.2), 240); // F4
    setTimeout(() => this.playTone(261.63, 'sawtooth', 0.45, 0.2), 360); // C4
  },
  playSelect() {
    this.playTone(587.33, 'sine', 0.06, 0.1);
  },
  playPeelClick() {
    this.playTone(466.16, 'triangle', 0.08, 0.12);
  },
  playWarning() {
    this.playTone(220, 'sawtooth', 0.12, 0.18);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.15, 0.15), 100);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.2, 0.12), 200);
  },
  playVictory() {
    this.playTone(523.25, 'sine', 0.1, 0.18);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.18), 80);
    setTimeout(() => this.playTone(783.99, 'sine', 0.1, 0.18), 160);
    setTimeout(() => this.playTone(1046.5, 'sine', 0.35, 0.22), 240);
  }
};


/* ================= STORAGE ================= */
const hasClaudeStorage = typeof window.storage !== 'undefined' && typeof window.storage.get === 'function';
let hasLocalStorage = false;
try{
  const testKey = '__xuppu_test__';
  localStorage.setItem(testKey, '1');
  localStorage.removeItem(testKey);
  hasLocalStorage = true;
}catch(e){ hasLocalStorage = false; }
function loadLocalSync(){
  if(!hasLocalStorage) return;
  try{
    const g = localStorage.getItem('xuppu_goals');
    goals = g ? JSON.parse(g) : [];
  }catch(e){ goals = []; }
  try{
    const b = localStorage.getItem('xuppu_burnCount');
    burnCount = b ? JSON.parse(b) : 0;
  }catch(e){ burnCount = 0; }
  
  // Game states
  try{ xp = JSON.parse(localStorage.getItem('xuppu_xp')) ?? 0; }catch(e){}
  try{ level = JSON.parse(localStorage.getItem('xuppu_level')) ?? 1; }catch(e){}
  try{ bananas = JSON.parse(localStorage.getItem('xuppu_bananas')) ?? 0; }catch(e){}
  try{ bossHP = JSON.parse(localStorage.getItem('xuppu_bossHP')) ?? 100; }catch(e){}
  try{ currentStage = JSON.parse(localStorage.getItem('xuppu_currentStage')) ?? 1; }catch(e){}
  try{ purchasedItems = JSON.parse(localStorage.getItem('xuppu_purchasedItems')) ?? []; }catch(e){}
  try{ equippedItems = JSON.parse(localStorage.getItem('xuppu_equippedItems')) ?? []; }catch(e){}
  try{ unlockedAchievements = JSON.parse(localStorage.getItem('xuppu_unlockedAchievements')) ?? []; }catch(e){}
  try{ dailyQuests = JSON.parse(localStorage.getItem('xuppu_dailyQuests')) ?? []; }catch(e){}
  try{ soundEnabled = JSON.parse(localStorage.getItem('xuppu_soundEnabled')) ?? true; }catch(e){}
  try{ streakCount = JSON.parse(localStorage.getItem('xuppu_streakCount')) ?? 0; }catch(e){}
  try{ lastActiveDate = localStorage.getItem('xuppu_lastActiveDate') || ''; }catch(e){}
  try{
    const s = localStorage.getItem('xuppu_gameStats');
    if (s) gameStats = { ...gameStats, ...JSON.parse(s) };
  }catch(e){}

  // Migrate legacy goals to milestone schema
  goals = goals.map(migrateGoal);
  updateMonthlyGoalCounts();

  bossMaxHP = getStageMaxHP(currentStage);
}
function withTimeout(promise, ms){
  return Promise.race([
    promise,
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('storage timeout')), ms))
  ]);
}
async function loadClaudeStorage(){
  if(!hasClaudeStorage) return false;
  try{
    const g = await withTimeout(window.storage.get('goals', false), 3000);
    goals = g ? JSON.parse(g.value) : [];
  }catch(e){ return false; }
  
  try{
    const stateVal = await withTimeout(window.storage.get('xuppu_game_state', false), 3000);
    if(stateVal){
      const s = JSON.parse(stateVal.value);
      xp = s.xp ?? 0;
      level = s.level ?? 1;
      bananas = s.bananas ?? 0;
      bossHP = s.bossHP ?? 100;
      currentStage = s.currentStage ?? 1;
      purchasedItems = s.purchasedItems ?? [];
      equippedItems = s.equippedItems ?? [];
      unlockedAchievements = s.unlockedAchievements ?? [];
      dailyQuests = s.dailyQuests ?? [];
      soundEnabled = s.soundEnabled ?? true;
      burnCount = s.burnCount ?? 0;
      streakCount = s.streakCount ?? streakCount;
      lastActiveDate = s.lastActiveDate ?? lastActiveDate;
      if (s.gameStats) gameStats = { ...gameStats, ...s.gameStats };

      goals = goals.map(migrateGoal);
      updateMonthlyGoalCounts();

      bossMaxHP = getStageMaxHP(currentStage);
    }
  }catch(e){}
  return true;
}
async function saveGoals(){
  if(hasLocalStorage){ try{ localStorage.setItem('xuppu_goals', JSON.stringify(goals)); }catch(e){} }
  if(hasClaudeStorage){ try{ await withTimeout(window.storage.set('goals', JSON.stringify(goals), false), 3000); }catch(e){} }
}
async function saveGameState(){
  if(hasLocalStorage){
    try{
      localStorage.setItem('xuppu_xp', JSON.stringify(xp));
      localStorage.setItem('xuppu_level', JSON.stringify(level));
      localStorage.setItem('xuppu_bananas', JSON.stringify(bananas));
      localStorage.setItem('xuppu_bossHP', JSON.stringify(bossHP));
      localStorage.setItem('xuppu_currentStage', JSON.stringify(currentStage));
      localStorage.setItem('xuppu_purchasedItems', JSON.stringify(purchasedItems));
      localStorage.setItem('xuppu_equippedItems', JSON.stringify(equippedItems));
      localStorage.setItem('xuppu_unlockedAchievements', JSON.stringify(unlockedAchievements));
      localStorage.setItem('xuppu_dailyQuests', JSON.stringify(dailyQuests));
      localStorage.setItem('xuppu_soundEnabled', JSON.stringify(soundEnabled));
      localStorage.setItem('xuppu_burnCount', JSON.stringify(burnCount));
      localStorage.setItem('xuppu_streakCount', JSON.stringify(streakCount));
      localStorage.setItem('xuppu_lastActiveDate', lastActiveDate);
      localStorage.setItem('xuppu_gameStats', JSON.stringify(gameStats));
    }catch(e){}
  }
  if(hasClaudeStorage){
    try{
      const stateObj = { xp, level, bananas, bossHP, currentStage, purchasedItems, equippedItems, unlockedAchievements, dailyQuests, soundEnabled, burnCount, streakCount, lastActiveDate, gameStats };
      await withTimeout(window.storage.set('xuppu_game_state', JSON.stringify(stateObj), false), 3000);
    }catch(e){}
  }
}

/* ================= MILESTONES & PROGRESS ================= */
function migrateGoal(goal) {
  if (!goal.milestones) {
    goal.milestones = [];
    // Convert legacy 10% progress into placeholder milestones if any progress existed
    if (typeof goal.progress === 'number' && goal.progress > 0) {
      for (let i = 0; i < 10; i++) {
        goal.milestones.push({
          id: 'm_' + goal.id + '_' + i,
          text: `Step ${i + 1}`,
          completed: (i + 1) * 10 <= goal.progress,
          order: i
        });
      }
    }
  }
  goal.difficulty = goal.difficulty || 'medium';
  goal.category = goal.category || 'personal';
  if (goal.expanded === undefined) goal.expanded = true;
  return goal;
}
function getGoalProgress(goal) {
  if (!goal.milestones || goal.milestones.length === 0) return 0;
  const completed = goal.milestones.filter(m => m.completed).length;
  return Math.round((completed / goal.milestones.length) * 100);
}
function sortedMilestones(goal) {
  return [...(goal.milestones || [])].sort((a, b) => a.order - b.order);
}
function createMilestoneId() {
  return 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}
function getStreakMultiplier() {
  if (streakCount >= 7) return 1.5;
  if (streakCount >= 3) return 1.25;
  return 1;
}
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}
function getMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function updateMonthlyGoalCounts() {
  const month = getMonthStr();
  const storedMonth = localStorage.getItem('xuppu_stats_month');
  if (storedMonth !== month) {
    localStorage.setItem('xuppu_stats_month', month);
    gameStats.goalsCompletedThisMonth = 0;
    gameStats.goalsCreatedThisMonth = goals.filter(g => {
      const created = g.createdAt ? g.createdAt.split('T')[0] : '';
      return created.startsWith(month);
    }).length;
    saveGameState();
  }
}
function updateDailyStreak() {
  const today = getTodayStr();
  if (lastActiveDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (lastActiveDate === yesterdayStr) {
    streakCount++;
  } else if (lastActiveDate !== today) {
    streakCount = 1;
  }
  lastActiveDate = today;
  if (streakCount > gameStats.longestStreak) {
    gameStats.longestStreak = streakCount;
  }
  if (streakCount >= 7) unlockAchievement('streak_master');
  saveGameState();
}
function recordStat(key, amount = 1) {
  if (gameStats[key] !== undefined) gameStats[key] += amount;
}

/* ================= LOGIC ================= */
function daysBetween(a,b){
  return Math.round((b-a)/(1000*60*60*24));
}
function getStageMaxHP(stageNum) {
  return STAGES[Math.max(0, Math.min(STAGES.length - 1, stageNum - 1))].maxHP;
}
function computeUrgency(goal){
  const created = new Date(goal.createdAt);
  const deadline = new Date(goal.deadline+'T23:59:59');
  const now = new Date();
  const totalDays = Math.max(1, daysBetween(created, deadline));
  const daysLeft = daysBetween(now, deadline);
  const elapsedRatio = Math.min(1, Math.max(0, (totalDays - daysLeft) / totalDays));
  const expected = elapsedRatio * 100;
  const gap = expected - getGoalProgress(goal);
  let level = 0;
  if(getGoalProgress(goal) >= 100){
    level = -1; // done
  } else if(daysLeft < 0){
    level = 4;
  } else if(gap >= 55 || daysLeft <= 0){
    level = 4;
  } else if(gap >= 35){
    level = 3;
  } else if(gap >= 18){
    level = 2;
  } else if(gap >= 6){
    level = 1;
  } else {
    level = 0;
  }
  return { level, gap, daysLeft, expected: Math.round(expected) };
}
function pickRoast(level){
  if(level >= 1){
    const idleSecs = (Date.now() - lastMouseMove) / 1000;
    const onPageMins = Math.floor((Date.now() - pageLoadTime) / 60000);
    if(idleSecs > 20 && Math.random() < 0.4){
      return FOURTH_WALL_IDLE[Math.floor(Math.random()*FOURTH_WALL_IDLE.length)];
    }
    if(onPageMins >= 1 && Math.random() < 0.25){
      const pool = FOURTH_WALL_TIME(onPageMins);
      return pool[Math.floor(Math.random()*pool.length)];
    }
  }
  const arr = level === -1 ? DONE_LINES : ROASTS[level];
  return arr[Math.floor(Math.random()*arr.length)];
}
function globalLevel(){
  const active = goals.filter(g => getGoalProgress(g) < 100);
  if(active.length === 0) return -1;
  let best = 0;
  for(const g of active){ best = Math.max(best, computeUrgency(g).level); }
  return best;
}
function mostUrgentGoal(){
  const active = goals.filter(g => getGoalProgress(g) < 100);
  if(active.length === 0) return null;
  let best = null, bestScore = -Infinity;
  for(const g of active){
    const u = computeUrgency(g);
    if(u.level > bestScore){ bestScore = u.level; best = g; }
  }
  return best;
}

/* ================= MASCOT SVG ================= */
function mascotSVG(level, size){
  const faces = {
    '-1': { mouth:'M70,118 Q100,150 130,118', browL:'M62,72 Q75,64 88,70', browR:'M112,70 Q125,64 138,72', eyeOffset:0, blush:true, prop:'banana' },
    '0':  { mouth:'M75,120 Q100,138 125,120', browL:'M62,74 Q75,68 88,74', browR:'M112,74 Q125,68 138,74', eyeOffset:0 },
    '1':  { mouth:'M78,124 Q100,128 122,122', browL:'M60,72 Q75,66 90,72', browR:'M110,68 Q125,74 140,70', eyeOffset:4 },
    '2':  { mouth:'M76,126 Q100,116 124,124', browL:'M58,70 Q75,62 92,70', browR:'M108,72 Q125,66 142,72', eyeOffset:6, smirk:true },
    '3':  { mouth:'M72,120 Q100,150 128,120 Q100,136 72,120', browL:'M58,68 Q75,58 92,68', browR:'M108,68 Q125,58 142,68', eyeOffset:2, wide:true },
    '4':  { mouth:'M68,116 Q100,158 132,116 Q100,142 68,116', browL:'M56,64 Q75,78 94,66', browR:'M106,66 Q125,78 144,64', eyeOffset:0, panic:true }
  };
  const f = faces[String(level)] || faces['0'];
  const lvlColor = level === -1 ? '#6b9b37' : LEVELS[Math.max(0,level)].color;
  let pupilY = 96 + (f.eyeOffset||0);
  let sweat = f.panic ? `<circle cx="150" cy="90" r="5" fill="#7ec8ff"><animate attributeName="cy" values="88;104;88" dur="0.6s" repeatCount="indefinite"/></circle>` : '';
  let banana = f.prop==='banana' ? `<g transform="translate(128,150) rotate(20)"><path d="M0,0 Q20,-6 30,10 Q15,18 0,10 Z" fill="#ffc93c" stroke="#1a1410" stroke-width="3"/></g>` : '';
  let blush = f.blush ? `<circle cx="66" cy="112" r="8" fill="#ff9db3" opacity="0.6"/><circle cx="134" cy="112" r="8" fill="#ff9db3" opacity="0.6"/>` : '';
  // Render equipped cosmetic item SVGs
  let cosmeticsSvg = '';
  if (equippedItems.includes('sunglasses')) {
    cosmeticsSvg += `<g id="cosmetic-sunglasses"><ellipse cx="78" cy="98" rx="17" ry="13" fill="#1a1410"/><ellipse cx="122" cy="98" rx="17" ry="13" fill="#1a1410"/><line x1="78" y1="98" x2="122" y2="98" stroke="#1a1410" stroke-width="5"/></g>`;
  }
  if (equippedItems.includes('eyebrows')) {
    cosmeticsSvg += `<g id="cosmetic-eyebrows" stroke="#1a1410" stroke-width="6" stroke-linecap="round"><line x1="52" y1="62" x2="94" y2="76"/><line x1="148" y1="62" x2="106" y2="76"/></g>`;
  }
  if (equippedItems.includes('crown')) {
    cosmeticsSvg += `<g id="cosmetic-crown" fill="#ffc93c" stroke="#1a1410" stroke-width="3" stroke-linejoin="round"><path d="M70,42 L60,18 L80,28 L100,10 L120,28 L140,18 L130,42 Z"/><circle cx="60" cy="18" r="3" fill="#ff3d5f"/><circle cx="100" cy="10" r="3" fill="#ff3d5f"/><circle cx="140" cy="18" r="3" fill="#ff3d5f"/></g>`;
  }
  if (equippedItems.includes('coffee')) {
    cosmeticsSvg += `<g id="cosmetic-coffee" transform="translate(42, 134)"><rect x="0" y="0" width="22" height="26" rx="3" fill="#fff" stroke="#1a1410" stroke-width="3"/><path d="M22,6 Q28,6 28,12 Q28,18 22,18" fill="none" stroke="#1a1410" stroke-width="3"/><rect x="4" y="6" width="14" height="6" fill="#8b5a2b"/><line x1="11" y1="-4" x2="11" y2="-1" stroke="#ccc" stroke-width="2"/><line x1="6" y1="-5" x2="6" y2="-2" stroke="#ccc" stroke-width="2"/></g>`;
  }

return `
  <svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="175" rx="70" ry="14" fill="rgba(0,0,0,0.25)"/>
    <circle cx="38" cy="100" r="26" fill="#8a5a35" stroke="#1a1410" stroke-width="4"/>
    <circle cx="162" cy="100" r="26" fill="#8a5a35" stroke="#1a1410" stroke-width="4"/>
    <circle cx="38" cy="100" r="13" fill="#c9926a"/>
    <circle cx="162" cy="100" r="13" fill="#c9926a"/>
    <circle cx="100" cy="105" r="70" fill="#a9713f" stroke="#1a1410" stroke-width="5"/>
    <ellipse cx="100" cy="128" rx="42" ry="34" fill="#e8c496" stroke="#1a1410" stroke-width="4"/>
    ${blush}
    <path d="${f.browL}" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/>
    <path d="${f.browR}" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/>
    <circle cx="78" cy="98" r="12" fill="#fff" stroke="#1a1410" stroke-width="3"/>
    <circle cx="122" cy="98" r="12" fill="#fff" stroke="#1a1410" stroke-width="3"/>
    <circle cx="80" cy="${pupilY}" r="5" fill="#1a1410"/>
    <circle cx="124" cy="${pupilY}" r="5" fill="#1a1410"/>
    ${sweat}
    <path d="${f.mouth}" fill="${f.wide||f.panic ? '#5c2a1a' : 'none'}" stroke="#1a1410" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="100" cy="105" r="70" fill="none" stroke="${lvlColor}" stroke-width="3" opacity="0.55"/>
    ${banana}
    ${cosmeticsSvg}
  </svg>`;
}

/* ================= RENDER COMPONENTS ================= */
function renderStage(){
  const holder = document.getElementById('mascotHolder');
  const glow = document.getElementById('stageGlow');
  const speech = document.getElementById('speech');
  const meta = document.getElementById('stageMeta');
  const goal = mostUrgentGoal();
  if(goals.length === 0){
    holder.innerHTML = mascotSVG(0, 180);
    holder.className = 'mascot-holder bounce';
    glow.style.setProperty('--glow-color', LEVELS[0].color);
    speech.textContent = IDLE_LINE;
    meta.innerHTML = 'AWAITING YOUR FIRST MISTAKE';
    return;
  }
  if(!goal){
    // all done
    holder.innerHTML = mascotSVG(-1, 180);
    holder.className = 'mascot-holder bounce';
    glow.style.setProperty('--glow-color', LEVELS[0].color);
    speech.textContent = pickRoast(-1);
    meta.innerHTML = `<b>ALL GOALS CLEARED</b> — xuppu is unemployed`;
    return;
  }
  const u = computeUrgency(goal);
  const lvl = LEVELS[u.level];
  holder.innerHTML = mascotSVG(u.level, 180);
  holder.className = 'mascot-holder ' + lvl.anim;
  glow.style.setProperty('--glow-color', lvl.color);
  speech.textContent = pickRoast(u.level);
  const daysTxt = u.daysLeft < 0 ? `${Math.abs(u.daysLeft)}d overdue` : (u.daysLeft === 0 ? 'due today' : `${u.daysLeft}d left`);
  meta.innerHTML = `re: <b>${escapeHtml(goal.title)}</b> — ${daysTxt}, you're at <b>${getGoalProgress(goal)}%</b> (should be ~${u.expected}%)`;
  // burn tracking: count a burn the first time we render at level >= 2 for this goal (per level increase)
  const prevMax = notifiedLevels[goal.id] ?? -1;
  if(u.level > prevMax && u.level >= 2){
    burnCount++;
    notifiedLevels[goal.id] = u.level;
    saveGameState();
    updateBurnBadge();
    
    if (burnCount >= 50) {
      unlockAchievement('burn_survivor');
    }
  } else if(u.level > prevMax){
    notifiedLevels[goal.id] = u.level;
  }
}
function updateBurnBadge(){
  document.getElementById('burnBadge').textContent = `🔥 ${burnCount} burn${burnCount===1?'':'s'} delivered`;
}


function renderBossHud() {
  const phaseTxt = document.getElementById('bossPhase');
  const hpFill = document.getElementById('bossHpFill');
  const hpTxt = document.getElementById('bossHpText');
  if (!phaseTxt || !hpFill || !hpTxt) return;
  
  let phaseName = `STAGE ${currentStage}`;
  if (bossHP <= 0) {
    phaseName = "☠ DEFEATED";
  } else if (bossHP < bossMaxHP * 0.3) {
    phaseName = `STAGE ${currentStage} (💥 PANIC)`;
  } else {
    const phaseIcons = ['🙂', '😠', '😈', '💀', '👑'];
    const icon = phaseIcons[Math.min(phaseIcons.length - 1, currentStage - 1)] || '👑';
    phaseName = `STAGE ${currentStage} (${icon})`;
  }
  
  phaseTxt.textContent = phaseName;
  const pct = (bossHP / bossMaxHP) * 100;
  hpFill.style.width = `${pct}%`;
  hpTxt.textContent = `HP: ${bossHP} / ${bossMaxHP}`;
  
  // Body shake if boss is panicking
  if (bossHP > 0 && bossHP < bossMaxHP * 0.3) {
    document.body.classList.add('apocalypse');
  } else if (globalLevel() !== 4) {
    document.body.classList.remove('apocalypse');
  }
}
function renderPlayerCard() {
  const lvl = document.getElementById('playerLevel');
  const stage = document.getElementById('playerStage');
  const coins = document.getElementById('playerBananas');
  const xpFill = document.getElementById('xpBarFill');
  const xpTxt = document.getElementById('xpText');
  if (!lvl || !stage || !coins || !xpFill || !xpTxt) return;
  
  lvl.textContent = `LV ${level}`;
  
  const stageInfo = STAGES[Math.max(0, Math.min(STAGES.length - 1, currentStage - 1))];
  const ngp = parseInt(localStorage.getItem('xuppu_ngp') || '0');
  stage.textContent = `STAGE: ${stageInfo.name}${ngp > 0 ? ` (NG+ ${ngp})` : ''}`;
  coins.textContent = `🍌 ${bananas} Bananas`;

  const streakEl = document.getElementById('playerStreak');
  if (streakEl) {
    const mult = getStreakMultiplier();
    streakEl.textContent = `🔥 ${streakCount} day streak${mult > 1 ? ` (${mult}x)` : ''}`;
  }
  
  const xpNeeded = level * 100;
  const pct = (xp / xpNeeded) * 100;
  xpFill.style.width = `${pct}%`;
  xpTxt.textContent = `XP: ${xp} / ${xpNeeded}`;
}
function generateDailyQuests() {
  const today = new Date().toISOString().split('T')[0];
  const completionsDate = localStorage.getItem('xuppu_completions_date');
  if (completionsDate !== today) {
    localStorage.setItem('xuppu_completions_date', today);
    localStorage.setItem('xuppu_completions_today', '0');
  }
  if (dailyQuests.length === 3 && dailyQuests[0].date === today) {
    return;
  }
  const questPool = [
    { type: 'milestone', title: 'Complete 3 milestones', target: 3, rewardXp: 40, rewardBananas: 10 },
    { type: 'complete', title: 'Complete 1 goal', target: 1, rewardXp: 50, rewardBananas: 15 },
    { type: 'deflect', title: 'Deflect 5 items/peels', target: 5, rewardXp: 30, rewardBananas: 10 },
    { type: 'xp', title: 'Earn 60 XP from actions', target: 60, rewardXp: 40, rewardBananas: 15 },
    { type: 'survive', title: 'Survive 2 boss attacks', target: 2, rewardXp: 50, rewardBananas: 20 },
    { type: 'spend', title: 'Buy or equip a shop item', target: 1, rewardXp: 30, rewardBananas: 10 }
  ];
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed += today.charCodeAt(i);
  }
  const selected = [];
  const poolCopy = [...questPool];
  for (let i = 0; i < 3; i++) {
    const idx = (seed + i * 7) % poolCopy.length;
    const q = poolCopy.splice(idx, 1)[0];
    selected.push({
      id: 'dq_' + i,
      date: today,
      title: q.title,
      type: q.type,
      count: 0,
      target: q.target,
      rewardXp: q.rewardXp,
      rewardBananas: q.rewardBananas,
      completed: false
    });
  }
  dailyQuests = selected;
  saveGameState();
}


function updateQuestProgress(type, amount = 1) {
  let changed = false;
  dailyQuests.forEach(q => {
    if (q.type === type && !q.completed) {
      q.count = Math.min(q.target, q.count + amount);
      if (q.count >= q.target) {
        q.completed = true;
        addXP(q.rewardXp);
        addBananas(q.rewardBananas);
        AudioSynth.playLevelUp();
        showScreenNotification(`📜 Quest Completed: ${q.title}! (+${q.rewardXp} XP, +${q.rewardBananas} 🍌)`);
      }
      changed = true;
    }
  });
  if (changed) {
    saveGameState();
    renderDailyQuests();
  }
}
function renderDailyQuests() {
  generateDailyQuests();
  const list = document.getElementById('questsList');
  if (!list) return;
  list.innerHTML = '';
  
  dailyQuests.forEach(q => {
    const item = document.createElement('div');
    item.className = `quest-item ${q.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div>
        <span>${q.completed ? '✅' : '📌'} ${escapeHtml(q.title)}</span>
        <div style="font-size: 11px; opacity: 0.7; margin-top: 2.5px;">
          Progress: ${q.count} / ${q.target}
        </div>
      </div>
      <span class="quest-reward">+${q.rewardXp} XP / +${q.rewardBananas} 🍌</span>
    `;
    list.appendChild(item);
  });
}
function buyShopItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  const isOwned = purchasedItems.includes(itemId);
  if (isOwned) {
    if (equippedItems.includes(itemId)) {
      equippedItems = equippedItems.filter(id => id !== itemId);
      AudioSynth.playSelect();
    } else {
      equippedItems.push(itemId);
      AudioSynth.playSelect();
    }
    updateQuestProgress('spend', 1);
  } else {
    if (bananas < item.cost) {
      showScreenNotification("❌ Not enough Bananas!");
      return;
    }
    bananas -= item.cost;
    purchasedItems.push(itemId);
    equippedItems.push(itemId);
    
    AudioSynth.playShopBuy();
    unlockAchievement('big_spender');
    
    if (itemId === 'goldenpeel') {
      unlockAchievement('golden_banana');
    }
    updateQuestProgress('spend', 1);
  }
  
  saveGameState();
  renderShop();
  renderAll();
}
function renderShop() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  SHOP_ITEMS.forEach(item => {
    const isOwned = purchasedItems.includes(item.id);
    const isEquipped = equippedItems.includes(item.id);
    
    let statusTxt = `${item.cost} 🍌`;
    let classVal = '';
    if (isEquipped) {
      statusTxt = 'EQUIPPED';
      classVal = 'equipped';
    } else if (isOwned) {
      statusTxt = 'EQUIP';
      classVal = 'owned';
    }
    
    const card = document.createElement('div');
    card.className = `shop-item ${classVal}`;
    card.title = item.description;
    card.innerHTML = `
      <span class="shop-item-icon">${item.icon}</span>
      <span class="shop-item-name">${item.name}</span>
      <span class="shop-item-cost">${isOwned ? 'Owned' : item.cost + ' 🍌'}</span>
      <span class="shop-item-status">${statusTxt}</span>
    `;
    card.addEventListener('click', () => buyShopItem(item.id));
    grid.appendChild(card);
  });
}
function unlockAchievement(id) {
  if (unlockedAchievements.includes(id)) return;
  unlockedAchievements.push(id);
  saveGameState();
  
  AudioSynth.playLevelUp();
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (ach) {
    showScreenNotification(`🏆 ACHIEVEMENT UNLOCKED: ${ach.name} (${ach.desc})`);
  }
  renderAchievements();
}
function renderAchievements() {
  const grid = document.getElementById('achievementsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  ACHIEVEMENTS.forEach(ach => {
    const isUnlocked = unlockedAchievements.includes(ach.id);
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <span class="achievement-icon">${ach.icon}</span>
      <div class="achievement-details">
        <span class="achievement-name">${ach.name}</span>
        <span class="achievement-desc">${ach.desc}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}
function renderStatistics() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;

  const month = getMonthStr();
  const goalsThisMonth = goals.filter(g => {
    const created = g.createdAt ? g.createdAt.split('T')[0] : '';
    return created.startsWith(month);
  });
  const completedThisMonth = goalsThisMonth.filter(g => getGoalProgress(g) >= 100).length;
  const monthlyRate = goalsThisMonth.length > 0
    ? Math.round((completedThisMonth / goalsThisMonth.length) * 100)
    : 0;

  const stats = [
    { label: 'Monthly Rate', value: `${monthlyRate}%` },
    { label: 'Milestones Done', value: gameStats.totalMilestonesCompleted },
    { label: 'Longest Streak', value: `${gameStats.longestStreak}d` },
    { label: 'Bananas Earned', value: gameStats.totalBananasEarned },
    { label: 'Total XP', value: gameStats.totalXpEarned },
    { label: 'Goals This Month', value: completedThisMonth }
  ];

  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `).join('');
}
function renderGoalGrid(){
  const grid = document.getElementById('goalGrid');
  grid.innerHTML = '';
  if(goals.length === 0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Nothing here yet. Add a goal above and give Xuppu something to judge.</div>`;
    return;
  }
  const sorted = [...goals].sort((a,b)=>{
    const pa = getGoalProgress(a), pb = getGoalProgress(b);
    if(pa>=100 && pb<100) return 1;
    if(pb>=100 && pa<100) return -1;
    return computeUrgency(b).level - computeUrgency(a).level;
  });
  for(const goal of sorted){
    const progress = getGoalProgress(goal);
    const done = progress >= 100;
    const u = computeUrgency(goal);
    const lvl = done ? {name:'CLEARED', pill:'#6b9b37', text:'#fff'} : LEVELS[u.level];
    const cat = CATEGORIES[goal.category] || CATEGORIES.personal;
    const diff = DIFFICULTY[goal.difficulty] || DIFFICULTY.medium;
    const milestones = sortedMilestones(goal);
    const completedCount = milestones.filter(m => m.completed).length;

    const card = document.createElement('div');
    let cardClass = 'goal-card';
    if(!done && u.level===4) cardClass += ' lvl4';
    else if(!done && u.level===3) cardClass += ' lvl3';
    card.className = cardClass;
    card.dataset.goalId = goal.id;

    const daysTxt = u.daysLeft < 0 ? `${Math.abs(u.daysLeft)} days overdue` : (u.daysLeft===0 ? 'due today' : `${u.daysLeft} days left`);

    const milestoneItems = milestones.length === 0
      ? `<div class="milestone-empty">No milestones yet — add one below!</div>`
      : milestones.map(m => `
        <div class="milestone-item" draggable="true" data-ms-id="${m.id}" data-goal-id="${goal.id}">
          <span class="drag-handle">⠿</span>
          <input type="checkbox" ${m.completed ? 'checked' : ''} ${done ? 'disabled' : ''}
            data-act="toggle-ms" data-id="${goal.id}" data-ms-id="${m.id}">
          <input type="text" class="milestone-text ${m.completed ? 'completed' : ''}" value="${escapeHtml(m.text)}"
            data-act="edit-ms" data-id="${goal.id}" data-ms-id="${m.id}" ${done ? 'readonly' : ''}>
          <button class="milestone-del" data-act="del-ms" data-id="${goal.id}" data-ms-id="${m.id}" title="Delete milestone">✕</button>
        </div>
      `).join('');

    card.innerHTML = `
      <div class="goal-top">
        <div>
          <div class="goal-meta-row">
            <span class="category-icon" title="${cat.label}">${cat.icon}</span>
            <span class="difficulty-badge ${goal.difficulty}">${diff.label}</span>
          </div>
          <p class="goal-title">${escapeHtml(goal.title)}</p>
        </div>
        <div class="mini-face">${mascotSVG(done ? -1 : u.level, 44)}</div>
      </div>
      <div class="goal-deadline ${u.daysLeft<0 && !done ? 'late':''}">${done ? 'goal cleared' : daysTxt}</div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill ${done ? 'done' : ''}" style="width:${progress}%"></div>
      </div>
      <div class="goal-controls">
        <span class="progress-num">${progress}% (${completedCount}/${milestones.length || 0})</span>
      </div>
      <button class="milestone-toggle" data-act="expand" data-id="${goal.id}">
        ${goal.expanded ? '▼' : '▶'} Milestones (${completedCount}/${milestones.length})
      </button>
      <div class="milestone-list ${goal.expanded ? 'expanded' : ''}">
        ${milestoneItems}
        ${!done ? `
        <div class="milestone-add-row">
          <input type="text" placeholder="Add milestone..." maxlength="80" data-add-ms="${goal.id}">
          <button class="btn small" data-act="add-ms" data-id="${goal.id}">+</button>
        </div>` : ''}
      </div>
      <div class="badge-row">
        <span class="urgency-pill" style="background:${lvl.pill};color:${lvl.text||'#1a1410'}">${lvl.name}</span>
        <button class="del-btn" data-act="del" data-id="${goal.id}" title="Remove goal">✕</button>
      </div>
    `;
    if(!done && u.level>=3 && Math.random() < 0.7){
      const stamp = document.createElement('div');
      stamp.className = 'stamp';
      stamp.textContent = STAMP_WORDS[Math.floor(Math.random()*STAMP_WORDS.length)];
      card.appendChild(stamp);
    }
    grid.appendChild(card);
  }

  bindGoalGridEvents(grid);
}
function bindGoalGridEvents(grid) {
  grid.querySelectorAll('button[data-act], input[data-act]').forEach(el => {
    el.addEventListener('click', onGoalAction);
  });
  grid.querySelectorAll('input[data-act="toggle-ms"]').forEach(el => {
    el.addEventListener('change', onMilestoneToggle);
  });
  grid.querySelectorAll('input[data-act="edit-ms"]').forEach(el => {
    el.addEventListener('blur', onMilestoneEdit);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  });
  grid.querySelectorAll('input[data-add-ms]').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const goalId = e.target.getAttribute('data-add-ms');
        addMilestoneToGoal(goalId, e.target.value);
        e.target.value = '';
      }
    });
  });
  grid.querySelectorAll('.milestone-item[draggable]').forEach(el => {
    el.addEventListener('dragstart', onMilestoneDragStart);
    el.addEventListener('dragover', onMilestoneDragOver);
    el.addEventListener('drop', onMilestoneDrop);
    el.addEventListener('dragend', onMilestoneDragEnd);
  });
}
function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}


/* ================= GAME ACTION EFFECTS ================= */
function addXP(amount) {
  const streakMult = getStreakMultiplier();
  const multiplied = Math.round(amount * comboCount * streakMult);
  xp += multiplied;
  recordStat('totalXpEarned', multiplied);
  
  let xpNeeded = level * 100;
  let leveledUp = false;
  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;
    leveledUp = true;
    xpNeeded = level * 100;
  }
  if (leveledUp) {
    AudioSynth.playLevelUp();
    showScreenNotification(`🎉 LEVEL UP! You reached Level ${level}!`);
  }
  saveGameState();
  renderPlayerCard();
}
function addBananas(amount) {
  const streakMult = getStreakMultiplier();
  const multiplied = Math.round(amount * comboCount * streakMult);
  bananas += multiplied;
  recordStat('totalBananasEarned', multiplied);
  if (bananas >= 200) {
    unlockAchievement('golden_banana');
  }
  saveGameState();
  renderPlayerCard();
}
function triggerComboAction() {
  if (comboTimer) {
    clearTimeout(comboTimer);
  }
  
  comboCount = Math.min(5, comboCount + 1);
  comboTimeLeft = COMBO_DURATION;
  
  document.getElementById('comboBadge').style.display = 'flex';
  document.getElementById('comboText').textContent = `COMBO x${comboCount}`;
  
  tickCombo();
}
function tickCombo() {
  if (comboTimeLeft <= 0) {
    comboCount = 1;
    document.getElementById('comboBadge').style.display = 'none';
    showScreenNotification("💥 COMBO BROKEN!");
    return;
  }
  
  const fill = document.getElementById('comboTimeFill');
  if (fill) {
    fill.style.width = `${(comboTimeLeft / COMBO_DURATION) * 100}%`;
  }
  
  comboTimeLeft--;
  comboTimer = setTimeout(tickCombo, 1000);
}
function damageBoss(amount) {
  if (goals.length === 0) return;
  
  bossHP = Math.max(0, bossHP - amount);
  
  // Shake mascot
  const holder = document.getElementById('mascotHolder');
  if (holder) {
    holder.className = 'mascot-holder shudder';
    setTimeout(() => {
      const goal = mostUrgentGoal();
      const u = goal ? computeUrgency(goal) : { level: 0 };
      const lvl = LEVELS[Math.max(0, u.level)];
      holder.className = 'mascot-holder ' + (lvl?.anim || 'bounce');
    }, 1000);
  }
  
  // Flash boss HUD red
  const hud = document.getElementById('bossHud');
  if (hud) {
    hud.style.borderColor = 'red';
    setTimeout(() => {
      hud.style.borderColor = 'var(--ink)';
    }, 500);
  }
  
  if (bossHP <= 0) {
    AudioSynth.playDefeat();
    showScreenNotification("🎉 STAGE CLEARED! You defeated Xuppu!");
    
    // Reward
    addXP(200);
    addBananas(50);
    
    // Stage transition
    currentStage++;
    let ngTxt = "";
    if (currentStage > STAGES.length) {
      currentStage = 1;
      let ngp = parseInt(localStorage.getItem('xuppu_ngp') || '0') + 1;
      localStorage.setItem('xuppu_ngp', ngp);
      ngTxt = ` (NG+ ${ngp})`;
    }
    
    bossMaxHP = getStageMaxHP(currentStage);
    bossHP = bossMaxHP;
    
    unlockAchievement('slayer');
  } else {
    AudioSynth.playHit();
  }
  
  saveGameState();
  renderBossHud();
  renderPlayerCard();
}


/* ================= CHAOS ENGINE ================= */
const CHAOS_LAYER = document.getElementById('chaosLayer');
const MAX_CHAOS_NODES = 30;
function chaosNodeCount(){
  return CHAOS_LAYER.childElementCount;
}
function addChaosNode(el, lifespanMs){
  if(chaosNodeCount() >= MAX_CHAOS_NODES){ return; }
  CHAOS_LAYER.appendChild(el);
  setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, lifespanMs);
}
function applyAmbiance(level){
  const body = document.body;
  
  // Stage specific styles
  body.className = body.className.replace(/\bstage-\d\b/g, '').trim();
  body.classList.add('stage-' + currentStage);
  
  // Disco Mode active
  body.classList.toggle('disco-active', equippedItems.includes('disco'));
  
  const clamped = Math.max(0, level); // -1 (calm/no goals) renders same as 0
  body.className = body.className.replace(/\bamb-\d\b/g, '').trim();
  body.classList.add('amb-' + clamped);
  body.classList.toggle('apocalypse', level === 4);
}
function spawnPeel(){
  const el = document.createElement('div');
  el.className = 'peel';
  el.textContent = equippedItems.includes('goldenpeel') ? '✨🍌' : PEELS[0];
  el.style.left = Math.random()*95 + 'vw';
  el.style.setProperty('--dx', (Math.random()*120-60) + 'px');
  el.style.setProperty('--rot', (720 + Math.random()*720) + 'deg');
  const dur = 3.5 + Math.random()*2.5;
  el.style.animationDuration = dur + 's';
  addChaosNode(el, dur*1000 + 200);
}
function spawnProjectile(level){
  const pool = PROJECTILES_BY_LEVEL[level] || PROJECTILES_BY_LEVEL[1];
  const emoji = pool[Math.floor(Math.random()*pool.length)];
  const el = document.createElement('div');
  el.className = 'projectile';
  el.textContent = emoji;
  const y = 10 + Math.random()*70;
  el.style.top = y + 'vh';
  el.style.setProperty('--dy', (Math.random()*40-20) + 'px');
  el.style.setProperty('--rot', (360 + Math.random()*720) + 'deg');
  const dur = 1.4 + Math.random()*1.1;
  el.style.animationDuration = dur + 's';
  addChaosNode(el, dur*1000 + 100);
  
  setTimeout(() => {
    spawnComicPop(70 + Math.random()*20, y);
  }, dur*1000*0.85);
}
function spawnComicPop(xVw, yVh){
  const el = document.createElement('div');
  el.className = 'comic-pop';
  el.textContent = IMPACT_WORDS[Math.floor(Math.random()*IMPACT_WORDS.length)];
  el.style.left = xVw + 'vw';
  el.style.top = yVh + 'vh';
  addChaosNode(el, 800);
}
function spawnPlane(){
  const el = document.createElement('div');
  el.className = 'plane';
  el.textContent = '✈️';
  const y = 10 + Math.random()*50;
  el.style.top = y + 'vh';
  const dur = 4 + Math.random()*1.5;
  el.style.animationDuration = dur + 's';
  const insult = document.createElement('span');
  insult.className = 'insult';
  insult.textContent = PLANE_INSULTS[Math.floor(Math.random()*PLANE_INSULTS.length)];
  el.appendChild(insult);
  addChaosNode(el, dur*1000 + 100);
}
function spawnPeek(){
  const el = document.createElement('div');
  el.className = 'peek';
  el.textContent = '🐒';
  const fromLeft = Math.random() < 0.5;
  el.style[fromLeft ? 'left' : 'right'] = (2 + Math.random()*4) + 'vw';
  addChaosNode(el, 2700);
}
function showToast(){
  if(document.querySelector('.xuppu-toast')) return;
  const el = document.createElement('div');
  el.className = 'xuppu-toast';
  el.textContent = '🔔 XUPPU HAS AN OPINION — tap to hear it';
  el.addEventListener('click', () => {
    const goal = mostUrgentGoal();
    const level = goal ? computeUrgency(goal).level : 0;
    document.getElementById('speech').textContent = pickRoast(goal ? level : 0);
    el.remove();
  });
  document.body.appendChild(el);
  setTimeout(() => { if(el.parentNode) el.remove(); }, 8000);
}
function showScreenNotification(text) {
  const el = document.createElement('div');
  el.className = 'xuppu-toast';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 4500);
}
function bananaRain(){
  const count = 40;
  for(let i=0;i<count;i++){
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'rain-banana';
      el.textContent = equippedItems.includes('goldenpeel') ? '✨🍌' : '🍌';
      el.style.left = Math.random()*100 + 'vw';
      el.style.setProperty('--rot', (360 + Math.random()*400) + 'deg');
      const dur = 1.6 + Math.random()*1.2;
      el.style.animationDuration = dur + 's';
      document.body.appendChild(el);
      setTimeout(() => { if(el.parentNode) el.remove(); }, dur*1000+150);
    }, i*35);
  }
}
function confettiBurst() {
  const layer = document.getElementById('confettiLayer');
  if (!layer) return;
  const colors = ['#ff3d5f', '#ffc93c', '#6b9b37', '#00bcd4', '#ff007f', '#fff'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      layer.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.remove(); }, 4000);
    }, i * 25);
  }
}
function playVictoryEffects(goal) {
  confettiBurst();
  bananaRain();
  AudioSynth.playVictory();

  const diff = DIFFICULTY[goal.difficulty] || DIFFICULTY.medium;
  let dmg = Math.round(25 * diff.bossDmg);
  const isCrit = Math.random() < 0.15;
  if (isCrit) {
    dmg = Math.round(50 * diff.bossDmg);
    AudioSynth.playCrit();
    const crit = document.getElementById('critOverlay');
    if (crit) {
      crit.classList.add('active');
      setTimeout(() => crit.classList.remove('active'), 900);
    }
    showScreenNotification(`💥 CRITICAL HIT! -${dmg} HP`);
  } else {
    showScreenNotification(`💥 DIRECT HIT! -${dmg} HP`);
  }

  damageBoss(dmg);
  addXP(Math.round(50 * diff.xpMult));
  addBananas(Math.round(15 * diff.bananaMult));

  updateQuestProgress('complete', 1);
  updateQuestProgress('xp', Math.round(50 * diff.xpMult));
  triggerComboAction();

  unlockAchievement('first_blood');

  let completionsToday = parseInt(localStorage.getItem('xuppu_completions_today') || '0') + 1;
  localStorage.setItem('xuppu_completions_today', completionsToday);
  if (completionsToday >= 3) unlockAchievement('speedrunner');

  recordStat('goalsCompletedThisMonth', 1);
  gameStats.goalsCompletedThisMonth++;
  saveGameState();
}
function maybeTriggerBananaBarrage() {
  if (isAttackActive || isTakeoverActive) return;
  if (Math.random() >= 0.25) return;

  currentAttackType = 'barrage';
  xuppuInterrupt(
    '🍌 BANANA BARRAGE!',
    'A milestone completed! Xuppu retaliates — DODGE THIS!',
    2500
  );
  setTimeout(() => {
    if (!isAttackActive && !isTakeoverActive) warnAttack();
  }, 2500);
}
function onMilestoneComplete(goal) {
  const diff = DIFFICULTY[goal.difficulty] || DIFFICULTY.medium;
  const xpGain = Math.round(8 * diff.xpMult);
  const bananaGain = Math.round(3 * diff.bananaMult);
  const bossDmg = diff.bossDmg;

  updateDailyStreak();
  damageBoss(bossDmg);
  addXP(xpGain);
  addBananas(bananaGain);
  triggerComboAction();
  updateQuestProgress('milestone', 1);
  updateQuestProgress('xp', xpGain);
  recordStat('totalMilestonesCompleted', 1);

  maybeTriggerBananaBarrage();
}
function executeDeadlineTakeover() {
  if (isTakeoverActive || isAttackActive) return;
  isTakeoverActive = true;
  document.body.classList.add('takeover-active');

  const overlay = document.getElementById('deadlineTakeover');
  const countdownEl = document.getElementById('deadlineCountdown');
  const titleEl = document.getElementById('deadlineTitle');
  const msgEl = document.getElementById('deadlineMessage');

  if (!overlay) { isTakeoverActive = false; return; }

  titleEl.textContent = '⚠️ DEADLINE CHECK';
  msgEl.textContent = DEADLINE_MESSAGES[Math.floor(Math.random() * DEADLINE_MESSAGES.length)];
  overlay.classList.remove('hidden');
  overlay.classList.add('active');
  AudioSynth.playWarning();

  let count = 5;
  countdownEl.textContent = count;

  const tick = () => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
      AudioSynth.playTone(300 + count * 40, 'sawtooth', 0.1, 0.12);
      setTimeout(tick, 1000);
    } else {
      countdownEl.textContent = 'NOW!';
      AudioSynth.playTone(880, 'sawtooth', 0.3, 0.2);
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('active');
        document.body.classList.remove('takeover-active');
        isTakeoverActive = false;
        showScreenNotification('⏰ Deadline Check passed. Back to work!');
      }, 1500);
    }
  };
  setTimeout(tick, 1000);
}
function executeMonkeyAmbush() {
  showScreenNotification('🐒 MONKEY AMBUSH! Peels incoming!');
  for (let i = 0; i < 6; i++) {
    setTimeout(() => spawnPeek(), i * 400);
    setTimeout(() => spawnPeel(), i * 500 + 200);
  }
}
function triggerRandomEvent() {
  if (goals.length === 0 || isAttackActive || isTakeoverActive) return;
  const level = globalLevel();
  const now = Date.now();

  const available = RANDOM_EVENTS.filter(ev => {
    if (level < ev.minLevel && level !== -1) return false;
    const last = eventCooldowns[ev.id] || 0;
    return now - last >= ev.cooldown;
  });
  if (available.length === 0) return;

  const totalWeight = available.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let chosen = available[0];
  for (const ev of available) {
    roll -= ev.weight;
    if (roll <= 0) { chosen = ev; break; }
  }

  eventCooldowns[chosen.id] = now;

  switch (chosen.id) {
    case 'deadline_check':
      executeDeadlineTakeover();
      break;
    case 'monkey_ambush':
      executeMonkeyAmbush();
      break;
    case 'plane_storm':
      if (!isAttackActive) {
        currentAttackType = 'plane_storm';
        xuppuInterrupt('✈️ PLANE STORM!', 'Insult planes incoming — shoot them down!', 2000);
        setTimeout(() => { if (!isAttackActive) warnAttack(); }, 2000);
      }
      break;
    case 'banana_barrage':
      if (!isAttackActive) {
        currentAttackType = 'barrage';
        xuppuInterrupt('🍌 BANANA BARRAGE!', 'Random event — dodge the peels!', 2000);
        setTimeout(() => { if (!isAttackActive) warnAttack(); }, 2000);
      }
      break;
  }
}
// Probability table per global level: how likely each effect is to fire on a given tick.
const CHAOS_PROBS = {
  '-1': { peel:0.02, projectile:0,    plane:0,     peek:0.01 },
  0:    { peel:0.06, projectile:0,    plane:0,     peek:0.02 },
  1:    { peel:0.16, projectile:0.06, plane:0.02,  peek:0.05 },
  2:    { peel:0.30, projectile:0.16, plane:0.08,  peek:0.10 },
  3:    { peel:0.50, projectile:0.30, plane:0.15,  peek:0.18 },
  4:    { peel:0.80, projectile:0.50, plane:0.25,  peek:0.30 },
};
function chaosTick(){
  const level = globalLevel();
  applyAmbiance(level);
  const probs = CHAOS_PROBS[String(level)];
  if(Math.random() < probs.peel) spawnPeel();
  if(level >= 1 && Math.random() < probs.projectile) spawnProjectile(level);
  if(level >= 1 && Math.random() < probs.plane) spawnPlane();
  if(Math.random() < probs.peek) spawnPeek();
}
const PLACEHOLDER_CYCLE = [
  "e.g. Finally learn to ollie",
  "Finally learn React",
  "Finally start React",
  "Finally stop procrastinating",
  "Be honest, you're opening YouTube after this"
];
let placeholderIdx = 0;
function cyclePlaceholder(){
  const input = document.getElementById('goalTitle');
  if(document.activeElement === input || input.value) return; // don't mess with active typing
  placeholderIdx = (placeholderIdx + 1) % PLACEHOLDER_CYCLE.length;
  input.placeholder = PLACEHOLDER_CYCLE[placeholderIdx];
}

/* ================= BOSS ACTIVE ATTACKS ================= */
function warnAttack() {
  if (isTakeoverActive) return;
  const banner = document.getElementById('bossAttackBanner');
  if (!banner) return;
  banner.style.display = 'block';
  attackWarningTimeLeft = 5;
  
  const tickWarning = () => {
    if (attackWarningTimeLeft <= 0) {
      banner.style.display = 'none';
      isAttackActive = true;
      if (currentAttackType === 'barrage') {
        executeBananaBarrage();
      } else {
        executePlaneStorm();
      }
      return;
    }
    
    banner.textContent = `⚠️ WARNING: XUPPU IS CHARGING A ${currentAttackType === 'barrage' ? 'BANANA BARRAGE' : 'PLANE INSULT STORM'}! (${attackWarningTimeLeft}s)`;
    AudioSynth.playTone(380, 'sine', 0.08, 0.08); // warning beep
    attackWarningTimeLeft--;
    attackWarningTimer = setTimeout(tickWarning, 1000);
  };
  
  tickWarning();
}
function executeBananaBarrage() {
  const count = 5 + Math.floor(Math.random() * 4);
  deflectCount = 0;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!isAttackActive) return;
      spawnStickyPeel();
    }, i * 350);
  }
  
  // Timer for barrage survival review
  setTimeout(() => {
    endAttack('barrage');
  }, 10000);
}
function spawnStickyPeel() {
  const el = document.createElement('div');
  el.className = 'sticky-peel';
  el.textContent = equippedItems.includes('goldenpeel') ? '✨🍌' : '🍌';
  
  el.style.left = (15 + Math.random() * 70) + 'vw';
  el.style.top = (15 + Math.random() * 70) + 'vh';
  el.style.transform = `rotate(${Math.random() * 360}deg)`;
  
el.addEventListener('click', () => {
    AudioSynth.playPeelClick();

    // play pop animation
    el.classList.add('peel-pop');

    // remove after animation finishes
    setTimeout(() => {
        el.remove();
    }, 250);

    deflectCount++;
    updateQuestProgress('deflect', 1);

    if (deflectCount >= 10) {
        unlockAchievement('untouchable');
    }
});
  
  document.body.appendChild(el);
}
function executePlaneStorm() {
  const count = 5 + Math.floor(Math.random() * 3);
  deflectCount = 0;
  let shotDown = 0;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!isAttackActive) return;
      spawnAttackPlane(() => {
        shotDown++;
        deflectCount++;
        updateQuestProgress('deflect', 1);
        if (deflectCount >= 10) {
          unlockAchievement('untouchable');
        }
      });
    }, i * 750);
  }
  
  setTimeout(() => {
    if (!isAttackActive) return;
    isAttackActive = false;
    
    const remaining = document.querySelectorAll('.attack-plane');
    if (remaining.length > 0) {
      const healVal = remaining.length * 8;
      bossHP = Math.min(bossMaxHP, bossHP + healVal);
      remaining.forEach(p => p.remove());
      
      showScreenNotification(`✈️ Planes hit! Xuppu heals for +${healVal} HP.`);
      AudioSynth.playTone(180, 'sine', 0.25, 0.1);
      renderBossHud();
    } else {
      const rewardXp = 40;
      const rewardBananas = 15;
      addXP(rewardXp);
      addBananas(rewardBananas);
      
      damageBoss(20);
      showScreenNotification(`🛡️ Defended! Gained +${rewardXp} XP, +${rewardBananas} Bananas, and dealt 20 damage to Xuppu!`);
      updateQuestProgress('survive', 1);
    }
    saveGameState();
    renderAll();
  }, count * 750 + 4000);
}
function spawnAttackPlane(onShootDown) {
  const el = document.createElement('div');
  el.className = 'plane attack-plane';
  el.textContent = '✈️';
  
  const y = 10 + Math.random() * 60;
  el.style.top = y + 'vh';
  el.style.cursor = 'pointer';
  el.style.zIndex = '999';
  
  const dur = 3.5 + Math.random() * 1.5;
  el.style.animationDuration = dur + 's';
  
  const insult = document.createElement('span');
  insult.className = 'insult';
  insult.textContent = PLANE_INSULTS[Math.floor(Math.random() * PLANE_INSULTS.length)];
  el.appendChild(insult);
  
  el.addEventListener('click', () => {
    AudioSynth.playPeelClick();
    spawnComicPop(75, y);
    el.remove();
    onShootDown();
  });
  
  document.getElementById('chaosLayer').appendChild(el);
  
  setTimeout(() => {
    if (el.parentNode) el.remove();
  }, dur * 1000 + 100);
}
function endAttack(type) {
  if (!isAttackActive) return;
  isAttackActive = false;
  
  const remaining = document.querySelectorAll('.sticky-peel');
  if (remaining.length > 0) {
    const dmg = remaining.length * 8;
    xp = Math.max(0, xp - dmg);
    remaining.forEach(p => p.remove());
    
    showScreenNotification(`💥 Blast! You lost ${dmg} XP from un-cleared peels.`);
    AudioSynth.playHit();
    renderPlayerCard();
  } else {
    const rewardXp = 30;
    const rewardBananas = 10;
    addXP(rewardXp);
    addBananas(rewardBananas);
    
    damageBoss(15);
    showScreenNotification(`🛡️ Safe! Gained +${rewardXp} XP, +${rewardBananas} Bananas, and dealt 15 damage to Xuppu!`);
    updateQuestProgress('survive', 1);
  }
  
  saveGameState();
  renderAll();
}
function startAttackCycle() {
  if (attackInterval) clearInterval(attackInterval);
  attackInterval = setInterval(() => {
    if (goals.length === 0 || isAttackActive || document.getElementById('bossAttackBanner').style.display !== 'none') {
      return;
    }
    // Coffee cup cosmetic slows down/calms down attacks
    if (equippedItems.includes('coffee') && Math.random() < 0.45) {
      showScreenNotification("☕ Xuppu is sipping coffee and decides not to attack right now.");
      return;
    }
    
    currentAttackType = Math.random() < 0.5 ? 'barrage' : 'plane_storm';
    warnAttack();
  }, 48000);
}
/* ================= ACTIONS ================= */
async function onMilestoneToggle(e) {
  const goalId = e.target.getAttribute('data-id');
  const msId = e.target.getAttribute('data-ms-id');
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  const ms = goal.milestones.find(m => m.id === msId);
  if (!ms) return;

  const wasCompleted = ms.completed;
  ms.completed = e.target.checked;

  if (ms.completed && !wasCompleted) {
    onMilestoneComplete(goal);
    const allComplete = goal.milestones.length > 0 && goal.milestones.every(m => m.completed);
    if (allComplete) {
      playVictoryEffects(goal);
    }
  }

  await saveGoals();
  if (typeof DeadManSwitch !== 'undefined') await DeadManSwitch.syncGoal(goal);
  await saveGameState();
  renderAll();
}
async function onMilestoneEdit(e) {
  const goalId = e.target.getAttribute('data-id');
  const msId = e.target.getAttribute('data-ms-id');
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  const ms = goal.milestones.find(m => m.id === msId);
  if (!ms) return;
  const val = e.target.value.trim();
  if (val && val !== ms.text) {
    ms.text = val;
    await saveGoals();
  } else {
    e.target.value = ms.text;
  }
}
async function addMilestoneToGoal(goalId, text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return;
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  const maxOrder = goal.milestones.reduce((m, ms) => Math.max(m, ms.order), -1);
  goal.milestones.push({
    id: createMilestoneId(),
    text: trimmed,
    completed: false,
    order: maxOrder + 1
  });
  goal.expanded = true;
  AudioSynth.playSelect();
  await saveGoals();
  if (typeof DeadManSwitch !== 'undefined') await DeadManSwitch.syncGoal(goal);
  renderAll();
}
function onMilestoneDragStart(e) {
  draggedMilestone = { goalId: e.currentTarget.dataset.goalId, msId: e.currentTarget.dataset.msId };
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onMilestoneDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}
function onMilestoneDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.milestone-item.drag-over').forEach(el => el.classList.remove('drag-over'));
  draggedMilestone = null;
}
async function onMilestoneDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!draggedMilestone) return;

  const goal = goals.find(g => g.id === draggedMilestone.goalId);
  if (!goal || goal.id !== e.currentTarget.dataset.goalId) return;

  const fromId = draggedMilestone.msId;
  const toId = e.currentTarget.dataset.msId;
  if (fromId === toId) return;

  const sorted = sortedMilestones(goal);
  const fromIdx = sorted.findIndex(m => m.id === fromId);
  const toIdx = sorted.findIndex(m => m.id === toId);
  if (fromIdx < 0 || toIdx < 0) return;

  const [moved] = sorted.splice(fromIdx, 1);
  sorted.splice(toIdx, 0, moved);
  sorted.forEach((m, i) => { m.order = i; });
  goal.milestones = sorted;

  await saveGoals();
  renderAll();
}
async function onGoalAction(e){
  const id = e.currentTarget.getAttribute('data-id');
  const act = e.currentTarget.getAttribute('data-act');
  const goal = goals.find(g=>g.id===id);
  if(!goal) return;

  if (act === 'expand') {
    goal.expanded = !goal.expanded;
    await saveGoals();
    renderGoalGrid();
    return;
  }
  if (act === 'add-ms') {
    const input = e.currentTarget.parentElement.querySelector('input[data-add-ms]');
    if (input) {
      await addMilestoneToGoal(id, input.value);
      input.value = '';
    }
    return;
  }
  if (act === 'del-ms') {
    const msId = e.currentTarget.getAttribute('data-ms-id');
    goal.milestones = goal.milestones.filter(m => m.id !== msId);
    await saveGoals();
    if (typeof DeadManSwitch !== 'undefined') await DeadManSwitch.syncGoal(goal);
    renderAll();
    return;
  }
  if(act === 'del'){
    if (typeof DeadManSwitch !== 'undefined') await DeadManSwitch.onGoalDeleted(id);
    goals = goals.filter(g=>g.id!==id);
    delete notifiedLevels[id];
    await saveGoals();
    await saveGameState();
    renderAll();
  }
}
async function addGoal(){
  const titleInput = document.getElementById('goalTitle');
  const dateInput = document.getElementById('goalDeadline');
  const diffInput = document.getElementById('goalDifficulty');
  const catInput = document.getElementById('goalCategory');
  const title = titleInput.value.trim();
  const deadline = dateInput.value;
  if(!title){ titleInput.focus(); return; }
  if(!deadline){ dateInput.focus(); return; }
  goals.push({
    id: 'g_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
    title,
    deadline,
    createdAt: new Date().toISOString(),
    milestones: [],
    expanded: true,
    difficulty: diffInput ? diffInput.value : 'medium',
    category: catInput ? catInput.value : 'personal'
  });
  recordStat('goalsCreatedThisMonth', 1);
  gameStats.goalsCreatedThisMonth++;
  titleInput.value = '';
  dateInput.value = '';

  AudioSynth.playSelect();
  await saveGoals();
  if (typeof DeadManSwitch !== 'undefined') await DeadManSwitch.syncGoal(goals[goals.length - 1]);
  await saveGameState();
  renderAll();
}
function renderAll(){
  renderStage();
  renderGoalGrid();
  renderBossHud();
  renderPlayerCard();
  renderDailyQuests();
  renderShop();
  renderAchievements();
  renderStatistics();
  applyAmbiance(globalLevel());
}

/* ================= INIT ================= */
document.getElementById('addGoalBtn').addEventListener('click', addGoal);
document.getElementById('goalTitle').addEventListener('keydown', e=>{ if(e.key==='Enter') addGoal(); });
document.getElementById('audioToggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  document.getElementById('audioToggle').textContent = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
  AudioSynth.playSelect();
  saveGameState();
});
(function init(){
  loadLocalSync();
  updateBurnBadge();
  document.getElementById('audioToggle').textContent = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
  renderAll();
  loadClaudeStorage().then(gotData=>{
    if(gotData){
      updateBurnBadge();
      document.getElementById('audioToggle').textContent = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
      renderAll();
    }
  });
  setInterval(renderStage, 15000);
  applyAmbiance(globalLevel());
  setInterval(chaosTick, 900);
  setInterval(cyclePlaceholder, 3500);
  setInterval(() => {
    const level = globalLevel();
    if(level < 1) return;
    const chance = { 1:0.15, 2:0.25, 3:0.4, 4:0.55 }[level] || 0;
    if(Math.random() < chance) showToast();
  }, 25000);
  
  // Random events with cooldowns (replaces old scripted interrupts)
  setInterval(() => {
    if (goals.length === 0) return;
    const level = globalLevel();
    const baseChance = { '-1': 0.05, 0: 0.08, 1: 0.12, 2: 0.18, 3: 0.25, 4: 0.35 }[String(level)] || 0.1;
    if (Math.random() < baseChance) triggerRandomEvent();
  }, 45000);
})();
