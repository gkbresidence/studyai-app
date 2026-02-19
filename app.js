/* ============================================================
   StudyAI — Full Application Logic
   Free + Premium | AI Solver | Study Plans | Gamification
   ============================================================ */

'use strict';

// ─── STATE ───────────────────────────────────────────────────
const STATE = {
  user: null,
  isPremium: false,
  dailySolves: 0,
  maxFreeSolves: 3,
  xp: 1240,
  streak: 7,
  level: 5,
  selectedSubject: 'math',
  currentPage: 'home',
  notifications: [],
  achievements: [],
  studyPlan: null,
  leaderboard: [],
  solveHistory: [],
  solveAudio: false,
  solveVideo: false,
  inputMode: 'type',
  planSelectedSubjects: [],
  currentOnboardSlide: 0,
  selectedPlan: 'monthly',
  adShown: false,
};

// ─── MOCK DATA ────────────────────────────────────────────────
const SUBJECTS = [
  { id: 'math',    name: 'Math',     emoji: '🔢', color: '#6C5CE7', bg: 'rgba(108,92,231,0.2)' },
  { id: 'physics', name: 'Physics',  emoji: '⚡', color: '#00b894', bg: 'rgba(0,184,148,0.2)' },
  { id: 'chemistry',name: 'Chemistry',emoji:'🧪', color: '#fd79a8', bg: 'rgba(253,121,168,0.2)' },
  { id: 'biology', name: 'Biology',  emoji: '🦠', color: '#00cec9', bg: 'rgba(0,206,201,0.2)' },
  { id: 'history', name: 'History',  emoji: '📜', color: '#fdcb6e', bg: 'rgba(253,203,110,0.2)' },
  { id: 'language',name: 'Language', emoji: '🗣️', color: '#e17055', bg: 'rgba(225,112,85,0.2)' },
  { id: 'literature',name:'Lit.',    emoji: '📖', color: '#a29bfe', bg: 'rgba(162,155,254,0.2)' },
  { id: 'economics',name:'Econ.',    emoji: '📊', color: '#55efc4', bg: 'rgba(85,239,196,0.2)' },
];

const BADGES = [
  { id: 'streak7',   emoji: '🔥', label: '7-Day Streak',      earned: true },
  { id: 'solver10',  emoji: '🧠', label: '10 Problems Solved', earned: true },
  { id: 'topClass',  emoji: '🏆', label: 'Top of Class',       earned: true },
  { id: 'earlybird', emoji: '🌅', label: 'Early Bird',         earned: false },
  { id: 'perfectScore',emoji:'⭐', label: 'Perfect Score',     earned: false },
  { id: 'vip',       emoji: '👑', label: 'VIP Member',         earned: false },
];

const LEADERBOARD_DATA = [
  { rank:1, name:'Sarah K.',   initials:'SK', xp:4820, level:'College', badge:'👑', color:'#6C5CE7' },
  { rank:2, name:'Marcus L.',  initials:'ML', xp:4210, level:'High School', badge:'🔥', color:'#fd79a8' },
  { rank:3, name:'Amira T.',   initials:'AT', xp:3990, level:'College', badge:'⭐', color:'#00cec9' },
  { rank:4, name:'David R.',   initials:'DR', xp:3450, level:'High School', badge:'🧠', color:'#fdcb6e' },
  { rank:5, name:'Fatima N.',  initials:'FN', xp:3120, level:'College', badge:'📚', color:'#00b894' },
  { rank:6, name:'You',        initials:'YU', xp:1240, level:'High School', badge:'🔥', color:'#6C5CE7', isMe:true },
  { rank:7, name:'Omar B.',    initials:'OB', xp:980,  level:'High School', badge:'',  color:'#a29bfe' },
];

const MOCK_SOLUTIONS = {
  math: {
    question: 'Solve: 2x² + 5x - 3 = 0',
    steps: [
      { title: 'Identify the equation type', content: 'This is a quadratic equation in the form ax² + bx + c = 0', math: 'a = 2, b = 5, c = -3' },
      { title: 'Apply the Quadratic Formula', content: 'Use the discriminant formula to find both roots.', math: 'x = (-b ± √(b²-4ac)) / 2a' },
      { title: 'Calculate the Discriminant', content: 'Compute b² - 4ac to determine the nature of roots.', math: 'Δ = 5² - 4(2)(-3) = 25 + 24 = 49' },
      { title: 'Find the Roots', content: 'Since Δ = 49 > 0, we have two distinct real roots.', math: 'x₁ = (-5 + √49) / 4 = (-5 + 7) / 4 = 0.5\nx₂ = (-5 - √49) / 4 = (-5 - 7) / 4 = -3' },
    ],
    answer: 'x = 0.5 or x = −3',
    xp: 25,
  },
  physics: {
    question: 'A ball is thrown upward with v₀ = 20 m/s. Find max height.',
    steps: [
      { title: 'Identify knowns', content: 'Initial velocity upward, acceleration due to gravity downward.', math: 'v₀ = 20 m/s, a = -9.8 m/s², v = 0 at max height' },
      { title: 'Choose the kinematic equation', content: 'Use v² = v₀² + 2aΔy and set v = 0 at the top.', math: '0 = v₀² + 2aH' },
      { title: 'Solve for H', content: 'Isolate H and substitute known values.', math: 'H = -v₀² / (2a) = -(20)² / (2 × -9.8) = 400 / 19.6' },
    ],
    answer: 'H ≈ 20.4 meters',
    xp: 30,
  },
  chemistry: {
    question: 'Balance: H₂ + O₂ → H₂O',
    steps: [
      { title: 'Count atoms on each side', content: 'Left: 2H, 2O. Right: 2H, 1O — oxygen is unbalanced.', math: 'H₂ + O₂ → H₂O (unbalanced)' },
      { title: 'Balance Oxygen first', content: 'Add a coefficient of 2 in front of H₂O to balance oxygen.', math: 'H₂ + O₂ → 2H₂O' },
      { title: 'Balance Hydrogen', content: 'Now H is unbalanced: 2H left, 4H right. Add 2 in front of H₂.', math: '2H₂ + O₂ → 2H₂O ✓' },
    ],
    answer: '2H₂ + O₂ → 2H₂O',
    xp: 20,
  },
  biology: {
    question: 'Explain the process of mitosis.',
    steps: [
      { title: 'Interphase', content: 'The cell prepares by replicating its DNA. Each chromosome is duplicated into sister chromatids.', math: '1 cell → DNA replication → 2× genetic material' },
      { title: 'Prophase → Metaphase', content: 'Chromosomes condense and line up at the cell equator (metaphase plate).', math: 'Chromatids align at metaphase plate' },
      { title: 'Anaphase → Telophase', content: 'Sister chromatids are pulled to opposite poles. Two nuclei form.', math: '2 nuclei, each with original chromosome number' },
      { title: 'Cytokinesis', content: 'The cytoplasm divides, producing two genetically identical daughter cells.', math: '1 cell → 2 identical daughter cells (same n)' },
    ],
    answer: 'Mitosis produces 2 genetically identical diploid daughter cells through 4 phases: Prophase, Metaphase, Anaphase, Telophase.',
    xp: 20,
  },
  default: {
    question: 'Explain the concept of supply and demand.',
    steps: [
      { title: 'Define Demand', content: 'Demand is the quantity of a good consumers are willing to buy at various price levels.', math: 'Law of Demand: Price ↑ → Quantity Demanded ↓' },
      { title: 'Define Supply', content: 'Supply is the quantity sellers are willing to offer at different price points.', math: 'Law of Supply: Price ↑ → Quantity Supplied ↑' },
      { title: 'Equilibrium', content: 'The market equilibrium is where supply = demand, determining the market price.', math: 'P* where Qs = Qd' },
    ],
    answer: 'Equilibrium price is where quantity supplied equals quantity demanded.',
    xp: 15,
  },
};

const WEEKLY_PLAN = [
  { day: 'Monday', emoji: '📘', tasks: [
    { name: 'Algebra: Quadratic Equations', subject: 'math', duration: '30 min', color: '#6C5CE7', done: true },
    { name: 'Read Chapter 4 – Cell Division', subject: 'biology', duration: '20 min', color: '#00cec9', done: true },
    { name: 'Practice 10 French vocabulary words', subject: 'language', duration: '15 min', color: '#e17055', done: false },
  ]},
  { day: 'Tuesday', emoji: '⚡', tasks: [
    { name: 'Physics: Kinematics problems', subject: 'physics', duration: '40 min', color: '#00b894', done: false },
    { name: 'History essay outline: WW2 causes', subject: 'history', duration: '25 min', color: '#fdcb6e', done: false },
  ]},
  { day: 'Wednesday', emoji: '🧪', tasks: [
    { name: 'Chemistry: Balancing equations x10', subject: 'chemistry', duration: '30 min', color: '#fd79a8', done: false },
    { name: 'Math: Trigonometry identities', subject: 'math', duration: '35 min', color: '#6C5CE7', done: false },
    { name: 'Biology: Mock test – Cell Theory', subject: 'biology', duration: '20 min', color: '#00cec9', done: false },
  ]},
  { day: 'Thursday', emoji: '📜', tasks: [
    { name: 'Language: Essay writing practice', subject: 'language', duration: '45 min', color: '#e17055', done: false },
    { name: 'History: Review notes + flashcards', subject: 'history', duration: '30 min', color: '#fdcb6e', done: false },
  ]},
  { day: 'Friday', emoji: '🔢', tasks: [
    { name: 'Math: Full practice exam (1 hr)', subject: 'math', duration: '60 min', color: '#6C5CE7', done: false },
    { name: 'Physics: Revision – Optics & Waves', subject: 'physics', duration: '25 min', color: '#00b894', done: false },
  ]},
  { day: 'Saturday', emoji: '📖', tasks: [
    { name: 'Literature: Novel analysis Chapter 5-8', subject: 'literature', duration: '40 min', color: '#a29bfe', done: false },
    { name: 'Free study session / weak subject focus', subject: 'general', duration: '60 min', color: '#55efc4', done: false },
  ]},
  { day: 'Sunday', emoji: '🌟', tasks: [
    { name: 'Weekly review all subjects', subject: 'general', duration: '30 min', color: '#a29bfe', done: false },
    { name: 'Rest & light revision only', subject: 'general', duration: '20 min', color: '#55efc4', done: false },
  ]},
];

const NOTIFICATIONS_DATA = [
  { icon: '🔥', bg: 'rgba(253,121,168,0.2)', text: '<strong>7-day streak!</strong> You\'re on fire! Keep it going tomorrow.', time: '2 min ago' },
  { icon: '📅', bg: 'rgba(108,92,231,0.2)', text: '<strong>Study reminder:</strong> Physics – Kinematics is scheduled for today.', time: '1 hr ago' },
  { icon: '🏆', bg: 'rgba(249,202,36,0.2)', text: '<strong>Sarah K.</strong> just passed you on the leaderboard. Time to catch up!', time: '3 hrs ago' },
  { icon: '🧠', bg: 'rgba(0,184,148,0.2)', text: 'You\'ve solved <strong>10 problems</strong> this week. Earning the Scholar badge!', time: 'Yesterday' },
  { icon: '🎁', bg: 'rgba(255,255,255,0.1)', text: 'Invite a friend and get <strong>50 XP</strong> + 1 free AI solve bonus.', time: 'Yesterday' },
];

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
});

function initSplash() {
  setTimeout(() => {
    document.getElementById('splash-screen').classList.add('hidden');
    const visited = localStorage.getItem('studyai_visited');
    if (!visited) {
      showOnboarding();
    } else {
      const savedUser = localStorage.getItem('studyai_user');
      if (savedUser) {
        STATE.user = JSON.parse(savedUser);
        STATE.isPremium = STATE.user.premium || false;
        launchApp();
      } else {
        showAuth();
      }
    }
  }, 3000);
}

// ─── ONBOARDING ────────────────────────────────────────────────
function showOnboarding() {
  show('onboarding');
  document.getElementById('onboard-next').addEventListener('click', () => {
    if (STATE.currentOnboardSlide < 2) {
      STATE.currentOnboardSlide++;
      updateOnboardSlide();
    } else {
      finishOnboard();
    }
  });
  document.getElementById('onboard-skip').addEventListener('click', finishOnboard);
  document.querySelectorAll('.dot').forEach(d => d.addEventListener('click', () => {
    STATE.currentOnboardSlide = parseInt(d.dataset.dot);
    updateOnboardSlide();
  }));
}
function updateOnboardSlide() {
  document.querySelectorAll('.onboard-slide').forEach((s, i) => s.classList.toggle('active', i === STATE.currentOnboardSlide));
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === STATE.currentOnboardSlide));
  document.getElementById('onboard-next').textContent = STATE.currentOnboardSlide === 2 ? 'Get Started' : 'Next';
}
function finishOnboard() {
  localStorage.setItem('studyai_visited', '1');
  hide('onboarding');
  showAuth();
}

// ─── AUTH ──────────────────────────────────────────────────────
function showAuth() {
  show('auth-screen');
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('login-form').classList.toggle('hidden', tab.dataset.tab !== 'login');
      document.getElementById('register-form').classList.toggle('hidden', tab.dataset.tab !== 'register');
    });
  });
  document.getElementById('btn-login').addEventListener('click', handleLogin);
  document.getElementById('btn-register').addEventListener('click', handleRegister);
}

function handleLogin() {
  const email = document.getElementById('login-email').value || 'demo@studyai.com';
  const name = email.split('@')[0].replace(/[^a-zA-Z]/g,'') || 'Alex';
  loginUser({ name: capitalize(name), email, premium: false });
}
function handleRegister() {
  const name = document.getElementById('reg-name').value || 'Alex';
  const email = document.getElementById('reg-email').value || 'alex@studyai.com';
  loginUser({ name: capitalize(name), email, premium: false });
}
function loginUser(user) {
  STATE.user = user;
  STATE.isPremium = user.premium;
  localStorage.setItem('studyai_user', JSON.stringify(user));
  hide('auth-screen');
  launchApp();
}

// ─── APP LAUNCH ────────────────────────────────────────────────
function launchApp() {
  show('app');
  buildNotifications();
  updateNavBar();
  setupNavigation();
  setupPaywall();
  setupNotifications();
  navigateTo('home');
  if (!STATE.isPremium) {
    setTimeout(showAdBanner, 5000);
  }
}

function updateNavBar() {
  const u = STATE.user;
  document.getElementById('nav-username').textContent = u.name.split(' ')[0];
  document.getElementById('nav-avatar').textContent = u.name[0].toUpperCase();
  document.getElementById('nav-xp').textContent = STATE.xp.toLocaleString();
  document.getElementById('nav-streak').textContent = STATE.streak;
  document.getElementById('premium-indicator').textContent = STATE.isPremium ? '👑' : '⭐';
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });
}

function navigateTo(page) {
  STATE.currentPage = page;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  const content = document.getElementById('page-content');
  content.innerHTML = '';
  const pages = { home: renderHome, solver: renderSolver, plans: renderPlans, leaderboard: renderLeaderboard, profile: renderProfile };
  if (pages[page]) pages[page](content);
}

// ─── HOME PAGE ─────────────────────────────────────────────────
function renderHome(container) {
  const doneTasks = WEEKLY_PLAN.flatMap(d => d.tasks).filter(t => t.done).length;
  const totalTasks = WEEKLY_PLAN.flatMap(d => d.tasks).length;
  const pct = Math.round((doneTasks / totalTasks) * 100);
  const sub = SUBJECTS.find(s => s.id === STATE.selectedSubject) || SUBJECTS[0];

  container.innerHTML = `
    <div class="home-page">
      <div class="home-hero">
        <h2>Good ${greeting()}, ${STATE.user.name.split(' ')[0]}! 🎓</h2>
        <p>You're on a <strong>${STATE.streak}-day streak</strong>. Keep up the momentum and reach the top!</p>
        <button class="hero-btn" id="hero-solve-btn"><i class="fas fa-bolt"></i> Solve a Problem</button>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${STATE.streak}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">${(STATE.xp/1000).toFixed(1)}k</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${STATE.solveHistory.length + 23}</div>
          <div class="stat-label">Solved</div>
        </div>
      </div>

      <div class="section-header">
        <span class="section-title">📚 Subjects</span>
        <span class="section-link" id="home-see-all-link">See all</span>
      </div>
      <div class="subjects-scroll">
        ${SUBJECTS.map(s => `
          <div class="subject-chip ${s.id === STATE.selectedSubject ? 'active' : ''}" data-subject="${s.id}">
            <span class="subject-emoji">${s.emoji}</span>
            <span class="subject-name">${s.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-title">📅 Weekly Progress</span>
          <span class="progress-pct">${pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" id="weekly-progress-bar" style="width:0%"></div>
        </div>
        <div class="progress-detail">${doneTasks} of ${totalTasks} tasks completed this week</div>
      </div>

      <div class="section-header">
        <span class="section-title">⚡ Quick Actions</span>
      </div>
      <div class="quick-actions">
        <div class="quick-action" id="qa-solve">
          <div class="qa-icon">🤖</div>
          <div class="qa-title">AI Solver</div>
          <div class="qa-desc">Snap or type any question for step-by-step solutions</div>
        </div>
        <div class="quick-action" id="qa-plan">
          <div class="qa-icon">📅</div>
          <div class="qa-title">Study Plan</div>
          <div class="qa-desc">View today's tasks and track your schedule</div>
        </div>
        <div class="quick-action" id="qa-rank">
          <div class="qa-icon">🏆</div>
          <div class="qa-title">Leaderboard</div>
          <div class="qa-desc">See how you rank vs friends and classmates</div>
        </div>
        <div class="quick-action" id="qa-premium">
          <div class="qa-icon">👑</div>
          <div class="qa-title">${STATE.isPremium ? 'Premium ✓' : 'Go Premium'}</div>
          <div class="qa-desc">${STATE.isPremium ? 'Enjoy unlimited features' : 'Unlock unlimited solves & more'}</div>
        </div>
      </div>

      ${STATE.solveHistory.length > 0 ? `
        <div class="section-header">
          <span class="section-title">🕐 Recent Solutions</span>
          <span class="section-link">View all</span>
        </div>
        <div class="recent-solutions">
          ${STATE.solveHistory.slice(0,3).map(h => `
            <div class="solution-item">
              <div class="solution-subject-icon" style="background:${h.bg}">${h.emoji}</div>
              <div class="solution-info">
                <div class="solution-q">${h.question}</div>
                <div class="solution-meta">${h.subject} · ${h.time}</div>
              </div>
              <i class="fas fa-chevron-right solution-arrow"></i>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="section-header">
        <span class="section-title">🏅 My Badges</span>
        <span class="section-link" id="home-badge-link">View all</span>
      </div>
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;margin-bottom:20px;">
        ${BADGES.filter(b=>b.earned).map(b=>`
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;">
            <div style="width:52px;height:52px;border-radius:50%;background:rgba(108,92,231,0.15);border:2px solid rgba(108,92,231,0.3);display:flex;align-items:center;justify-content:center;font-size:26px;">${b.emoji}</div>
            <span style="font-size:10px;color:var(--text-muted);text-align:center;max-width:60px;">${b.label}</span>
          </div>
        `).join('')}
        ${BADGES.filter(b=>!b.earned).map(b=>`
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;opacity:0.4;">
            <div style="width:52px;height:52px;border-radius:50%;background:var(--card2);border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;font-size:26px;">🔒</div>
            <span style="font-size:10px;color:var(--text-muted);text-align:center;max-width:60px;">${b.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Animate progress bar
  setTimeout(() => {
    const bar = document.getElementById('weekly-progress-bar');
    if (bar) bar.style.width = pct + '%';
  }, 100);

  // Events
  document.getElementById('hero-solve-btn').addEventListener('click', () => navigateTo('solver'));
  document.getElementById('qa-solve').addEventListener('click', () => navigateTo('solver'));
  document.getElementById('qa-plan').addEventListener('click', () => navigateTo('plans'));
  document.getElementById('qa-rank').addEventListener('click', () => navigateTo('leaderboard'));
  document.getElementById('qa-premium').addEventListener('click', () => {
    if (!STATE.isPremium) openPaywall();
    else navigateTo('profile');
  });
  document.querySelectorAll('.subject-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      STATE.selectedSubject = chip.dataset.subject;
      document.querySelectorAll('.subject-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

// ─── SOLVER PAGE ───────────────────────────────────────────────
function renderSolver(container) {
  const remaining = STATE.isPremium ? '∞' : (STATE.maxFreeSolves - STATE.dailySolves);
  const quotaClass = !STATE.isPremium && STATE.dailySolves >= STATE.maxFreeSolves ? 'low' : 'ok';

  container.innerHTML = `
    <div class="solver-page">
      <div class="solver-header">
        <h2>🤖 AI Problem Solver</h2>
        <p>Get step-by-step solutions instantly</p>
      </div>

      <div class="solver-quota">
        <span class="quota-label">Daily solves remaining</span>
        <span class="quota-val ${quotaClass}">${STATE.isPremium ? '∞ Unlimited' : remaining + ' / ' + STATE.maxFreeSolves}</span>
      </div>

      <div class="section-title" style="margin-bottom:10px;">Select Subject</div>
      <div class="subject-select-grid">
        ${SUBJECTS.map(s => `
          <button class="subj-btn ${s.id === STATE.selectedSubject ? 'active' : ''}" data-subj="${s.id}">
            <span>${s.emoji}</span>${s.name}
          </button>
        `).join('')}
      </div>

      <div class="input-zone">
        <div class="input-zone-tabs">
          <button class="input-tab ${STATE.inputMode==='type'?'active':''}" data-mode="type"><i class="fas fa-keyboard"></i> Type</button>
          <button class="input-tab ${STATE.inputMode==='photo'?'active':''}" data-mode="photo"><i class="fas fa-camera"></i> Photo</button>
        </div>
        <div class="input-zone-body">
          <div id="type-input" class="${STATE.inputMode!=='type'?'hidden':''}">
            <textarea class="question-textarea" id="question-text" placeholder="Type your question here…\nEx: Solve 2x² + 5x - 3 = 0\nEx: What is photosynthesis?\nEx: Balance: H₂ + O₂ → H₂O" rows="5"></textarea>
          </div>
          <div id="photo-input" class="${STATE.inputMode!=='photo'?'hidden':''}">
            <div class="photo-zone" id="photo-zone">
              <i class="fas fa-camera"></i>
              <p>Tap to take a photo or upload</p>
              <p style="font-size:11px;color:var(--text-muted);">Supports JPG, PNG</p>
              <input type="file" id="photo-file-input" accept="image/*" capture="environment" style="display:none"/>
            </div>
            <img id="photo-preview" src="" alt="Preview" />
          </div>
        </div>
      </div>

      <div class="solve-options">
        <div class="option-toggle ${STATE.solveAudio?'on':''}" id="toggle-audio">
          <i class="fas fa-volume-up"></i> Audio
        </div>
        <div class="option-toggle ${STATE.solveVideo?'on':''}" id="toggle-video">
          <i class="fas fa-video"></i> Video
        </div>
        <div class="option-toggle" id="toggle-instant" ${!STATE.isPremium?'':'style="border-color:var(--gold);color:var(--gold);"'}>
          <i class="fas fa-bolt"></i> Instant ${!STATE.isPremium?'👑':''}
        </div>
      </div>

      <button class="btn-solve" id="btn-solve">
        <i class="fas fa-magic"></i> Solve Now
      </button>

      <div id="solution-area"></div>
    </div>
  `;

  // Subject selection
  document.querySelectorAll('.subj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.selectedSubject = btn.dataset.subj;
      document.querySelectorAll('.subj-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Input mode tabs
  document.querySelectorAll('.input-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      STATE.inputMode = tab.dataset.mode;
      document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('type-input').classList.toggle('hidden', STATE.inputMode !== 'type');
      document.getElementById('photo-input').classList.toggle('hidden', STATE.inputMode !== 'photo');
    });
  });

  // Photo upload
  document.getElementById('photo-zone').addEventListener('click', () => {
    document.getElementById('photo-file-input').click();
  });
  document.getElementById('photo-file-input').addEventListener('change', function() {
    if (this.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        const preview = document.getElementById('photo-preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
        document.getElementById('photo-zone').style.display = 'none';
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Options toggles
  document.getElementById('toggle-audio').addEventListener('click', () => {
    STATE.solveAudio = !STATE.solveAudio;
    document.getElementById('toggle-audio').classList.toggle('on', STATE.solveAudio);
  });
  document.getElementById('toggle-video').addEventListener('click', () => {
    if (!STATE.isPremium) { openPaywall(); return; }
    STATE.solveVideo = !STATE.solveVideo;
    document.getElementById('toggle-video').classList.toggle('on', STATE.solveVideo);
  });
  document.getElementById('toggle-instant').addEventListener('click', () => {
    if (!STATE.isPremium) { openPaywall(); return; }
  });

  // SOLVE button
  document.getElementById('btn-solve').addEventListener('click', handleSolve);
}

function handleSolve() {
  // Check quota
  if (!STATE.isPremium && STATE.dailySolves >= STATE.maxFreeSolves) {
    openPaywall();
    showToast('⛔', 'Daily limit reached', 'Upgrade to Premium for unlimited solves');
    return;
  }

  const btn = document.getElementById('btn-solve');
  const area = document.getElementById('solution-area');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Solving…';

  area.innerHTML = `<div class="spinner"></div><p style="text-align:center;color:var(--text-muted);font-size:13px;margin-top:-8px;">Analyzing your question…</p>`;

  const delay = STATE.isPremium && STATE.solveVideo ? 1500 : 2200;
  setTimeout(() => {
    STATE.dailySolves++;
    const sol = MOCK_SOLUTIONS[STATE.selectedSubject] || MOCK_SOLUTIONS.default;
    const sub = SUBJECTS.find(s => s.id === STATE.selectedSubject) || SUBJECTS[0];

    // Record history
    STATE.solveHistory.unshift({
      question: sol.question,
      subject: sub.name,
      emoji: sub.emoji,
      bg: sub.bg,
      time: 'Just now',
    });
    STATE.xp += sol.xp;
    updateNavBar();

    renderSolution(area, sol, sub);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-magic"></i> Solve Now';

    // XP toast
    showToast('⭐', `+${sol.xp} XP earned!`, `Great job solving that ${sub.name} problem!`);

    // Streak check
    if (STATE.dailySolves === 1) showToast('🔥', 'Streak maintained!', 'Keep going to hit your daily goal!');

    // Update quota
    const remaining = STATE.maxFreeSolves - STATE.dailySolves;
    const quotaEl = document.querySelector('.quota-val');
    if (quotaEl && !STATE.isPremium) {
      quotaEl.textContent = remaining + ' / ' + STATE.maxFreeSolves;
      quotaEl.className = 'quota-val ' + (remaining <= 0 ? 'low' : 'ok');
    }
  }, delay);
}

function renderSolution(container, sol, sub) {
  container.innerHTML = `
    <div class="solution-output">
      <div class="solution-top-bar">
        <div class="solution-subject-tag" style="color:${sub.color}">
          ${sub.emoji} ${sub.name}
          <span class="badge badge-purple" style="margin-left:4px;">AI Solved</span>
        </div>
        <div class="solution-actions-bar">
          <button class="btn-icon" title="Share" onclick="shareResult()"><i class="fas fa-share-alt"></i></button>
          <button class="btn-icon" title="Save"><i class="fas fa-bookmark"></i></button>
          <button class="btn-icon" title="Copy"><i class="fas fa-copy"></i></button>
        </div>
      </div>
      <div class="solution-body">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:14px;padding:10px;background:var(--dark3);border-radius:var(--radius-sm);font-style:italic;">"${sol.question}"</div>

        ${sol.steps.map((step, i) => `
          <div class="solution-step">
            <div class="step-num">${i+1}</div>
            <div class="step-title">${step.title}</div>
            <div class="step-content">${step.content}</div>
            <div class="step-math">${step.math}</div>
          </div>
        `).join('')}

        <div class="final-answer">
          <div class="final-answer-label">✅ Final Answer</div>
          <div class="final-answer-text">${sol.answer}</div>
        </div>

        ${STATE.solveAudio ? `
          <div style="background:var(--dark3);border-radius:var(--radius-sm);padding:12px;margin-top:12px;display:flex;align-items:center;gap:10px;">
            <i class="fas fa-volume-up" style="color:var(--primary);font-size:18px;"></i>
            <div style="flex:1;">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">Audio Explanation</div>
              <input type="range" min="0" max="100" value="30" style="width:100%;accent-color:var(--primary);" />
            </div>
            <button class="btn-icon"><i class="fas fa-play"></i></button>
          </div>
        ` : ''}

        ${STATE.isPremium && STATE.solveVideo ? `
          <div style="background:var(--dark3);border-radius:var(--radius-sm);padding:12px;margin-top:12px;">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;"><i class="fas fa-video" style="color:var(--primary);"></i> Video Explanation</div>
            <div style="background:var(--dark2);border-radius:8px;height:140px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);">
              <div style="text-align:center;">
                <div style="font-size:40px;margin-bottom:8px;">▶️</div>
                <div style="font-size:12px;color:var(--text-muted);">3-minute video walkthrough</div>
              </div>
            </div>
          </div>
        ` : (!STATE.isPremium ? `
          <div style="background:rgba(108,92,231,0.1);border:1px solid rgba(108,92,231,0.3);border-radius:var(--radius-sm);padding:12px;margin-top:12px;display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="openPaywall()">
            <span style="font-size:20px;">👑</span>
            <div>
              <div style="font-size:13px;font-weight:700;">Unlock Video Explanations</div>
              <div style="font-size:11px;color:var(--text-muted);">Get visual 3-min video walkthroughs with Premium</div>
            </div>
            <i class="fas fa-chevron-right" style="color:var(--text-muted);margin-left:auto;"></i>
          </div>
        ` : '')}

        <div class="xp-reward"><i class="fas fa-star"></i> +${sol.xp} XP earned from this solution!</div>
      </div>
    </div>

    ${!STATE.isPremium ? `
      <div style="background:linear-gradient(135deg,rgba(108,92,231,0.15),rgba(253,121,168,0.15));border:1px solid rgba(108,92,231,0.3);border-radius:var(--radius);padding:16px;margin-top:16px;text-align:center;cursor:pointer;" onclick="openPaywall()">
        <div style="font-size:24px;margin-bottom:8px;">👑</div>
        <div style="font-weight:700;margin-bottom:4px;">You have ${STATE.maxFreeSolves - STATE.dailySolves} free solve${(STATE.maxFreeSolves - STATE.dailySolves)!==1?'s':''} left today</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Go Premium for unlimited solutions, video explanations & more</div>
        <div style="display:inline-block;background:linear-gradient(135deg,var(--primary),var(--accent));padding:10px 24px;border-radius:999px;font-weight:700;font-size:14px;">Try 3 Days Free →</div>
      </div>
    ` : ''}
  `;
}

// ─── STUDY PLANS PAGE ──────────────────────────────────────────
function renderPlans(container) {
  const today = new Date().toLocaleDateString('en-US', { weekday:'long' });
  const todayPlan = WEEKLY_PLAN.find(d => d.day === today) || WEEKLY_PLAN[0];
  const allDone = todayPlan.tasks.every(t => t.done);

  container.innerHTML = `
    <div class="plans-page">
      <div class="plans-header">
        <h2>📅 Study Plans</h2>
        <p>Your personalized weekly schedule</p>
      </div>

      ${!STATE.isPremium ? `
        <div style="background:linear-gradient(135deg,rgba(108,92,231,0.15),rgba(253,121,168,0.1));border:1px solid rgba(108,92,231,0.3);border-radius:var(--radius);padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="openPaywall()">
          <span style="font-size:28px;">👑</span>
          <div>
            <div style="font-weight:700;font-size:14px;">Unlock Smart Study Plans</div>
            <div style="font-size:12px;color:var(--text-muted);">AI-personalized plans + reminders + exam packs</div>
          </div>
          <i class="fas fa-chevron-right" style="color:var(--text-muted);margin-left:auto;"></i>
        </div>
      ` : ''}

      <div class="exam-setup-card">
        <h3>⚙️ Configure Your Plan</h3>
        <div class="form-group">
          <label class="form-label">Upcoming Exam</label>
          <select class="form-input" id="plan-exam">
            <option>Baccalauréat (Bac)</option>
            <option>SAT / ACT</option>
            <option>University Entrance Exam</option>
            <option>GCSE / A-Levels</option>
            <option>IB Diploma</option>
            <option>Final Semester Exams</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Exam Date</label>
          <input type="date" class="form-input" id="plan-date" />
        </div>
        <div class="form-group">
          <label class="form-label">Daily Study Goal</label>
          <select class="form-input">
            <option>1 hour / day</option>
            <option selected>2 hours / day</option>
            <option>3 hours / day</option>
            <option>4+ hours / day</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subjects to Cover</label>
          <div class="subject-checkboxes">
            ${SUBJECTS.map(s => `
              <input type="checkbox" class="subj-check" id="scheck-${s.id}" value="${s.id}" checked />
              <label class="subj-check-label" for="scheck-${s.id}">${s.emoji} ${s.name}</label>
            `).join('')}
          </div>
        </div>
        <button class="btn-primary" id="btn-gen-plan" style="margin-top:8px;">
          <i class="fas fa-magic"></i> Generate My Plan
        </button>
      </div>

      <div class="section-header">
        <span class="section-title">📆 This Week</span>
        <span class="section-link" id="share-plan-btn">Share Plan</span>
      </div>

      <div class="week-plan" id="week-plan-container">
        ${WEEKLY_PLAN.map((day, idx) => {
          const doneCnt = day.tasks.filter(t=>t.done).length;
          const isToday = day.day === today;
          return `
            <div class="day-card ${isToday ? 'open' : ''}" data-day="${idx}">
              <div class="day-header" onclick="toggleDay(${idx})">
                <div class="day-title">
                  ${day.emoji} ${day.day}
                  ${isToday ? '<span class="badge badge-purple" style="margin-left:4px;">Today</span>' : ''}
                  ${doneCnt === day.tasks.length ? '<span class="day-done-badge">✅</span>' : ''}
                </div>
                <div class="day-progress-mini">${doneCnt}/${day.tasks.length} done</div>
              </div>
              <div class="day-tasks">
                ${day.tasks.map((task, ti) => `
                  <div class="day-task">
                    <div class="task-check ${task.done ? 'done' : ''}" data-day="${idx}" data-task="${ti}" onclick="toggleTask(${idx},${ti})"></div>
                    <div class="task-subject-dot" style="background:${task.color}"></div>
                    <div class="task-info">
                      <div class="task-name" style="${task.done?'text-decoration:line-through;opacity:0.5;':''}">${task.name}</div>
                      <div class="task-duration"><i class="fas fa-clock" style="font-size:10px;"></i> ${task.duration}</div>
                    </div>
                  </div>
                `).join('')}
                ${STATE.isPremium ? `
                  <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
                    <button class="btn-secondary" style="width:100%;font-size:12px;padding:8px;" onclick="openPaywall()">
                      <i class="fas fa-plus"></i> Add custom task
                    </button>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${STATE.isPremium ? `
        <div class="card" style="margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="font-size:20px;">🔔</span>
            <div>
              <div style="font-size:14px;font-weight:700;">Smart Reminders</div>
              <div style="font-size:12px;color:var(--text-muted);">Premium feature — Active</div>
            </div>
            <div style="margin-left:auto;width:44px;height:24px;background:var(--success);border-radius:999px;position:relative;cursor:pointer;">
              <div style="width:20px;height:20px;background:#fff;border-radius:50%;position:absolute;right:2px;top:2px;"></div>
            </div>
          </div>
          <div style="font-size:13px;color:var(--text-muted);">Reminders set for: 8:00 AM, 4:00 PM, 8:00 PM</div>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('btn-gen-plan').addEventListener('click', () => {
    if (!STATE.isPremium) { openPaywall(); return; }
    showToast('📅', 'Plan updated!', 'Your personalized study plan has been generated.');
  });
  document.getElementById('share-plan-btn').addEventListener('click', shareResult);
}

window.toggleDay = function(idx) {
  const cards = document.querySelectorAll('.day-card');
  cards[idx].classList.toggle('open');
};
window.toggleTask = function(dayIdx, taskIdx) {
  WEEKLY_PLAN[dayIdx].tasks[taskIdx].done = !WEEKLY_PLAN[dayIdx].tasks[taskIdx].done;
  const check = document.querySelector(`.task-check[data-day="${dayIdx}"][data-task="${taskIdx}"]`);
  const taskName = check.nextElementSibling.nextElementSibling.querySelector('.task-name');
  if (WEEKLY_PLAN[dayIdx].tasks[taskIdx].done) {
    check.classList.add('done');
    taskName.style.textDecoration = 'line-through';
    taskName.style.opacity = '0.5';
    STATE.xp += 10;
    updateNavBar();
    showToast('✅', '+10 XP', 'Task completed! Keep going!');
  } else {
    check.classList.remove('done');
    taskName.style.textDecoration = '';
    taskName.style.opacity = '';
  }
  // Update day header count
  const doneCnt = WEEKLY_PLAN[dayIdx].tasks.filter(t=>t.done).length;
  const total = WEEKLY_PLAN[dayIdx].tasks.length;
  const header = document.querySelectorAll('.day-card')[dayIdx].querySelector('.day-progress-mini');
  if (header) header.textContent = `${doneCnt}/${total} done`;
};

// ─── LEADERBOARD PAGE ──────────────────────────────────────────
function renderLeaderboard(container) {
  container.innerHTML = `
    <div class="leaderboard-page">
      <div class="lb-header">
        <h2>🏆 Leaderboard</h2>
        <p style="color:var(--text-muted);font-size:14px;">Compete globally, dominate locally</p>
      </div>

      <div class="lb-filters">
        <button class="lb-filter active" data-f="global">🌍 Global</button>
        <button class="lb-filter" data-f="school">🏫 School</button>
        <button class="lb-filter" data-f="city">📍 City</button>
        <button class="lb-filter" data-f="friends">👥 Friends</button>
        <button class="lb-filter" data-f="weekly">📅 This Week</button>
      </div>

      <!-- PODIUM -->
      <div class="top3-podium">
        <!-- 2nd -->
        <div class="podium-item podium-2">
          <div class="podium-avatar">${LEADERBOARD_DATA[1].initials}</div>
          <div class="podium-name">${LEADERBOARD_DATA[1].name.split(' ')[0]}</div>
          <div class="podium-xp">${LEADERBOARD_DATA[1].xp.toLocaleString()} XP</div>
          <div class="podium-block"></div>
        </div>
        <!-- 1st -->
        <div class="podium-item podium-1">
          <div class="podium-avatar" style="position:relative;">
            <span class="podium-crown">👑</span>
            ${LEADERBOARD_DATA[0].initials}
          </div>
          <div class="podium-name">${LEADERBOARD_DATA[0].name.split(' ')[0]}</div>
          <div class="podium-xp">${LEADERBOARD_DATA[0].xp.toLocaleString()} XP</div>
          <div class="podium-block"></div>
        </div>
        <!-- 3rd -->
        <div class="podium-item podium-3">
          <div class="podium-avatar">${LEADERBOARD_DATA[2].initials}</div>
          <div class="podium-name">${LEADERBOARD_DATA[2].name.split(' ')[0]}</div>
          <div class="podium-xp">${LEADERBOARD_DATA[2].xp.toLocaleString()} XP</div>
          <div class="podium-block"></div>
        </div>
      </div>

      <!-- REST OF LIST -->
      <div class="lb-list">
        ${LEADERBOARD_DATA.slice(3).map(u => `
          <div class="lb-row ${u.isMe ? 'mine' : ''}">
            <div class="lb-rank">${u.rank}</div>
            <div class="lb-avatar-sm" style="background:linear-gradient(135deg,${u.color},${u.color}88);">${u.initials}</div>
            <div class="lb-info">
              <div class="lb-name">${u.name} ${u.isMe ? '<span class="badge badge-purple" style="font-size:9px;">You</span>' : ''}</div>
              <div class="lb-level">${u.level}</div>
            </div>
            <div class="lb-score">${u.xp.toLocaleString()}</div>
            ${u.badge ? `<div class="lb-badge-icon">${u.badge}</div>` : ''}
          </div>
        `).join('')}
      </div>

      <!-- INVITE BANNER -->
      <div style="background:linear-gradient(135deg,rgba(108,92,231,0.2),rgba(253,121,168,0.2));border:1px solid rgba(108,92,231,0.3);border-radius:var(--radius);padding:16px;margin-top:20px;text-align:center;">
        <div style="font-size:24px;margin-bottom:8px;">👥</div>
        <div style="font-weight:700;margin-bottom:4px;">Invite Friends → Earn 50 XP Each</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Share your invite link and boost your rank together!</div>
        <button class="btn-secondary" style="width:100%;" onclick="shareResult()">
          <i class="fas fa-share-alt"></i> Share Invite Link
        </button>
      </div>

      ${!STATE.isPremium ? `
        <div style="margin-top:16px;background:rgba(249,202,36,0.1);border:1px solid rgba(249,202,36,0.3);border-radius:var(--radius);padding:16px;display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="openPaywall()">
          <span style="font-size:24px;">👑</span>
          <div>
            <div style="font-weight:700;font-size:13px;">Premium members rank 3× faster</div>
            <div style="font-size:12px;color:var(--text-muted);">Get VIP badge & XP boosts with Premium</div>
          </div>
          <i class="fas fa-chevron-right" style="color:var(--text-muted);margin-left:auto;"></i>
        </div>
      ` : ''}
    </div>
  `;

  document.querySelectorAll('.lb-filter').forEach(f => {
    f.addEventListener('click', () => {
      document.querySelectorAll('.lb-filter').forEach(b => b.classList.remove('active'));
      f.classList.add('active');
      showToast('🔄', 'Leaderboard updated', `Showing ${f.textContent} rankings`);
    });
  });
}

// ─── PROFILE PAGE ──────────────────────────────────────────────
function renderProfile(container) {
  const level = Math.floor(STATE.xp / 500) + 1;
  const xpToNext = ((level) * 500) - STATE.xp;
  const xpProgress = Math.min(((STATE.xp % 500) / 500) * 100, 100);

  container.innerHTML = `
    <div class="profile-page">
      <div class="profile-hero">
        <div class="profile-avatar-big">${STATE.user.name[0].toUpperCase()}</div>
        <div class="profile-name">${STATE.user.name}</div>
        <div class="profile-level">Level ${level} · High School · ${STATE.isPremium ? '👑 Premium' : 'Free Tier'}</div>
        <div class="profile-badges">
          ${BADGES.filter(b=>b.earned).map(b=>`<span class="profile-badge" title="${b.label}">${b.emoji}</span>`).join('')}
        </div>
        <div class="xp-progress-wrap">
          <div class="xp-bar-label">
            <span>⭐ ${STATE.xp.toLocaleString()} XP</span>
            <span>${xpToNext} to Level ${level+1}</span>
          </div>
          <div class="xp-bar">
            <div class="xp-bar-fill" id="xp-fill" style="width:0%"></div>
          </div>
        </div>
      </div>

      <div class="profile-stats-grid">
        <div class="profile-stat-card">
          <div class="pstat-icon">🔥</div>
          <div class="pstat-info"><div class="pstat-val">${STATE.streak}</div><div class="pstat-label">Day Streak</div></div>
        </div>
        <div class="profile-stat-card">
          <div class="pstat-icon">🧠</div>
          <div class="pstat-info"><div class="pstat-val">${STATE.solveHistory.length + 23}</div><div class="pstat-label">Problems Solved</div></div>
        </div>
        <div class="profile-stat-card">
          <div class="pstat-icon">📅</div>
          <div class="pstat-info"><div class="pstat-val">${WEEKLY_PLAN.flatMap(d=>d.tasks).filter(t=>t.done).length}</div><div class="pstat-label">Tasks Done</div></div>
        </div>
        <div class="profile-stat-card">
          <div class="pstat-icon">🏆</div>
          <div class="pstat-info"><div class="pstat-val">#6</div><div class="pstat-label">Global Rank</div></div>
        </div>
      </div>

      <!-- Subscription -->
      <div class="section-title" style="margin-bottom:10px;">💳 Subscription</div>
      <div class="section-list" style="margin-bottom:20px;">
        <div class="list-item" onclick="${STATE.isPremium?'':'openPaywall()'}">
          <div class="list-item-icon" style="background:rgba(249,202,36,0.2);">👑</div>
          <div class="list-item-label">${STATE.isPremium ? 'Premium Active' : 'Upgrade to Premium'}</div>
          <div class="list-item-value">${STATE.isPremium ? '$4.99/mo' : 'Free'}</div>
          <i class="fas fa-chevron-right list-item-arrow"></i>
        </div>
        <div class="list-item" onclick="openPaywall()">
          <div class="list-item-icon" style="background:rgba(0,184,148,0.2);">📦</div>
          <div class="list-item-label">Exam Packs</div>
          <div class="list-item-value">Browse</div>
          <i class="fas fa-chevron-right list-item-arrow"></i>
        </div>
        <div class="list-item" onclick="openPaywall()">
          <div class="list-item-icon" style="background:rgba(253,121,168,0.2);">🎁</div>
          <div class="list-item-label">In-App Purchases</div>
          <div class="list-item-value">XP Boosts, Avatars</div>
          <i class="fas fa-chevron-right list-item-arrow"></i>
        </div>
      </div>

      <!-- Settings -->
      <div class="section-title" style="margin-bottom:10px;">⚙️ Settings</div>
      <div class="section-list" style="margin-bottom:20px;">
        <div class="list-item">
          <div class="list-item-icon" style="background:rgba(108,92,231,0.2);">🔔</div>
          <div class="list-item-label">Notifications</div>
          <div class="list-item-value">On</div>
          <i class="fas fa-chevron-right list-item-arrow"></i>
        </div>
        <div class="list-item">
          <div class="list-item-icon" style="background:rgba(0,206,201,0.2);">🌍</div>
          <div class="list-item-label">Language</div>
          <div class="list-item-value">English</div>
          <i class="fas fa-chevron-right list-item-arrow"></i>
        </div>
        <div class="list-item">
          <div class="list-item-icon" style="background:rgba(253,203,110,0.2);">📊</div>
          <div class="list-item-label">Analytics Dashboard</div>
          <div class="list-item-value"></div>
          <i class="fas fa-chevron-right list-item-arrow" id="analytics-link"></i>
        </div>
        <div class="list-item" onclick="logout()">
          <div class="list-item-icon" style="background:rgba(225,112,85,0.2);">🚪</div>
          <div class="list-item-label" style="color:var(--danger);">Sign Out</div>
          <div class="list-item-value"></div>
          <i class="fas fa-chevron-right list-item-arrow"></i>
        </div>
      </div>

      ${!STATE.isPremium ? `
        <div style="background:linear-gradient(135deg,var(--primary-dark),var(--primary));border-radius:var(--radius);padding:20px;text-align:center;margin-bottom:20px;cursor:pointer;" onclick="openPaywall()">
          <div style="font-size:32px;margin-bottom:8px;">🚀</div>
          <div style="font-size:18px;font-weight:800;margin-bottom:6px;">Upgrade to Premium</div>
          <div style="font-size:13px;opacity:0.85;margin-bottom:14px;">Unlimited solves · Full plans · VIP badge · No ads</div>
          <div style="background:rgba(255,255,255,0.2);border-radius:999px;padding:10px 24px;display:inline-block;font-weight:700;border:1px solid rgba(255,255,255,0.3);">Start 3-Day Free Trial</div>
        </div>
      ` : ''}
    </div>
  `;

  setTimeout(() => {
    const fill = document.getElementById('xp-fill');
    if (fill) fill.style.width = xpProgress + '%';
  }, 100);

  document.getElementById('analytics-link')?.addEventListener('click', () => renderAnalyticsModal());
}

window.logout = function() {
  localStorage.removeItem('studyai_user');
  STATE.user = null;
  hide('app');
  showAuth();
};

// ─── ANALYTICS MODAL ───────────────────────────────────────────
function renderAnalyticsModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.alignItems = 'flex-start';
  overlay.innerHTML = `
    <div class="modal-card" style="border-radius:16px;margin:20px;max-height:85vh;background:var(--dark2);">
      <button class="modal-close" id="analytics-close"><i class="fas fa-times"></i></button>
      <h2 style="font-size:20px;font-weight:800;margin-bottom:4px;">📊 Analytics</h2>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:20px;">Your usage & progress overview</p>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Problems Solved</div>
          <div class="kpi-value" style="color:var(--primary-light);">${STATE.solveHistory.length + 23}</div>
          <div class="kpi-change kpi-up">↑ 18% this week</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Study Hours</div>
          <div class="kpi-value" style="color:var(--success);">14.5h</div>
          <div class="kpi-change kpi-up">↑ 7% this week</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">XP Earned</div>
          <div class="kpi-value" style="color:var(--gold);">${STATE.xp.toLocaleString()}</div>
          <div class="kpi-change kpi-up">↑ 25% this week</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Current Streak</div>
          <div class="kpi-value" style="color:var(--accent);">${STATE.streak}</div>
          <div class="kpi-change kpi-up">🔥 Personal best!</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-title">Daily Problems Solved (This Week)</div>
        <div class="bar-chart">
          ${[{d:'M',v:3},{d:'T',v:5},{d:'W',v:2},{d:'T',v:7},{d:'F',v:4},{d:'S',v:6},{d:'S',v:2}].map(b=>`
            <div class="bar-col">
              <div class="bar" style="height:${b.v*12}px;background:linear-gradient(180deg,var(--primary),var(--primary-dark));"></div>
              <div class="bar-label">${b.d}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-title">Subject Breakdown</div>
        ${[
          {s:'Math',pct:35,color:'#6C5CE7'},
          {s:'Physics',pct:25,color:'#00b894'},
          {s:'Chemistry',pct:20,color:'#fd79a8'},
          {s:'Biology',pct:12,color:'#00cec9'},
          {s:'Other',pct:8,color:'#fdcb6e'},
        ].map(r=>`
          <div class="revenue-row" style="margin-bottom:10px;">
            <div class="revenue-dot" style="background:${r.color}"></div>
            <div class="revenue-label">${r.s}</div>
            <div class="revenue-bar-wrap">
              <div class="revenue-bar" style="width:${r.pct}%;background:${r.color}"></div>
            </div>
            <div class="revenue-amount">${r.pct}%</div>
          </div>
        `).join('')}
      </div>

      ${STATE.isPremium ? `
        <div class="chart-card">
          <div class="chart-title">💰 Monetization Overview</div>
          <div class="revenue-breakdown">
            <div class="revenue-row">
              <div class="revenue-dot" style="background:var(--primary)"></div>
              <div class="revenue-label">Premium Subscriptions</div>
              <div class="revenue-bar-wrap"><div class="revenue-bar" style="width:65%;background:var(--primary)"></div></div>
              <div class="revenue-amount">65%</div>
            </div>
            <div class="revenue-row">
              <div class="revenue-dot" style="background:var(--gold)"></div>
              <div class="revenue-label">Exam Packs</div>
              <div class="revenue-bar-wrap"><div class="revenue-bar" style="width:20%;background:var(--gold)"></div></div>
              <div class="revenue-amount">20%</div>
            </div>
            <div class="revenue-row">
              <div class="revenue-dot" style="background:var(--success)"></div>
              <div class="revenue-label">In-App Purchases</div>
              <div class="revenue-bar-wrap"><div class="revenue-bar" style="width:10%;background:var(--success)"></div></div>
              <div class="revenue-amount">10%</div>
            </div>
            <div class="revenue-row">
              <div class="revenue-dot" style="background:var(--accent)"></div>
              <div class="revenue-label">Ad Revenue</div>
              <div class="revenue-bar-wrap"><div class="revenue-bar" style="width:5%;background:var(--accent)"></div></div>
              <div class="revenue-amount">5%</div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('analytics-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ─── PAYWALL ───────────────────────────────────────────────────
function setupPaywall() {
  document.getElementById('btn-premium-badge').addEventListener('click', openPaywall);
  document.getElementById('paywall-close').addEventListener('click', closePaywall);
  document.getElementById('paywall-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('paywall-modal')) closePaywall();
  });
  document.querySelectorAll('.plan-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      STATE.selectedPlan = opt.dataset.plan;
    });
  });
  document.getElementById('btn-subscribe').addEventListener('click', handleSubscribe);
}

function openPaywall() { document.getElementById('paywall-modal').classList.remove('hidden'); }
function closePaywall() { document.getElementById('paywall-modal').classList.add('hidden'); }

function handleSubscribe() {
  const btn = document.getElementById('btn-subscribe');
  btn.textContent = 'Processing…';
  setTimeout(() => {
    STATE.isPremium = true;
    STATE.user.premium = true;
    localStorage.setItem('studyai_user', JSON.stringify(STATE.user));
    closePaywall();
    updateNavBar();
    hideAdBanner();
    showToast('👑', 'Welcome to Premium!', 'Enjoy unlimited solves and all premium features!');
    BADGES.find(b => b.id === 'vip').earned = true;
    navigateTo(STATE.currentPage);
    btn.textContent = 'Start 3-Day Free Trial';
  }, 1500);
}

// ─── NOTIFICATIONS ─────────────────────────────────────────────
function setupNotifications() {
  document.getElementById('btn-notifications').addEventListener('click', () => {
    document.getElementById('notif-panel').classList.remove('hidden');
  });
  document.getElementById('notif-close').addEventListener('click', () => {
    document.getElementById('notif-panel').classList.add('hidden');
  });
  document.getElementById('notif-panel').addEventListener('click', e => {
    if (e.target === document.getElementById('notif-panel')) {
      document.getElementById('notif-panel').classList.add('hidden');
    }
  });
}

function buildNotifications() {
  const list = document.getElementById('notif-list');
  list.innerHTML = NOTIFICATIONS_DATA.map(n => `
    <div class="notif-item">
      <div class="notif-icon" style="background:${n.bg}">${n.icon}</div>
      <div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

// ─── AD BANNER ─────────────────────────────────────────────────
function showAdBanner() {
  if (!STATE.adShown && !STATE.isPremium) {
    STATE.adShown = true;
    document.getElementById('ad-banner').classList.remove('hidden');
    document.getElementById('ad-close-btn').addEventListener('click', hideAdBanner);
  }
}
function hideAdBanner() {
  document.getElementById('ad-banner').classList.add('hidden');
}

// ─── SHARE ─────────────────────────────────────────────────────
window.shareResult = function() {
  if (navigator.share) {
    navigator.share({ title: 'StudyAI', text: `I just solved a problem on StudyAI and earned ${STATE.xp} XP! Join me: https://studyai.app`, url: 'https://studyai.app' });
  } else {
    showToast('📤', 'Link copied!', 'Share it with your friends to earn 50 XP bonus!');
  }
};

// ─── TOAST SYSTEM ──────────────────────────────────────────────
function showToast(icon, title, subtitle) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-text"><strong>${title}</strong><span>${subtitle}</span></div>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─── HELPERS ──────────────────────────────────────────────────
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// ─── NOTIFICATION PANEL INNER HTML (fixed structure) ──────────
document.getElementById('notif-panel').innerHTML = `
  <div class="panel-box">
    <div class="panel-header">
      <h3>Notifications</h3>
      <button class="panel-close" id="notif-close"><i class="fas fa-times"></i></button>
    </div>
    <div class="notif-list" id="notif-list"></div>
  </div>
`;
// Re-setup close button after innerHTML replacement
document.getElementById('notif-panel').querySelector('.panel-close').addEventListener('click', () => {
  document.getElementById('notif-panel').classList.add('hidden');
});
