/* ============================ APEX PROTOCOL ============================
   Calisthenics + bookbag-loaded training tracker.
   All data is stored locally on this device (localStorage). Nothing is
   sent anywhere.
========================================================================= */

/* ---------------------------- DATA: SCHEDULE ---------------------------- */
const SCHEDULE = [
  { id: "wake", time: "7:00 AM", label: "Wake + hydrate", desc: "16-24 oz water, outdoor light, quick readiness check." },
  { id: "warm", time: "7:10 AM", label: "Warm-up walk", desc: "10-min easy walk + 5-min spine/shoulder/hip mobility." },
  { id: "train", time: "8:00 AM", label: "Main training", desc: "Today's session below. 45-75 min including warm-up sets.", dynamic: true },
  { id: "cool", time: "9:15 AM", label: "Cooldown + shower", desc: "5-min cooldown, shower, grooming." },
  { id: "run", time: "9:30 AM", label: "Run", desc: "20-30 min easy pace, conversational. You're already warm — best slot of the day for it." },
  { id: "meal1", time: "10:00 AM", label: "Meal 1 (large)", desc: "~1,640 kcal — protein + carb + fat dense. This is one of your two feeding windows, make it count." },
  { id: "deploy1", time: "10:30 AM", label: "Deploy", desc: "Head out / position for lunch delivery demand." },
  { id: "shift1", time: "11:00 AM", label: "Uber — Lunch shift", desc: "Earning block. Riding counts toward daily activity." },
  { id: "work", time: "2:00 PM", label: "Deep work / clients", desc: "Coding clients, job search, admin. Feet up briefly if needed. Optional 20-min nap before 3:30." },
  { id: "hydrate2", time: "4:30 PM", label: "Hydration", desc: "24 oz water. Add electrolytes if it's hot and you're sweating heavily." },
  { id: "shift2", time: "5:00 PM", label: "Uber — Dinner shift", desc: "Earning block. Sip from a 24 oz bottle during the shift." },
  { id: "meal2", time: "9:15 PM", label: "Meal 2 (large)", desc: "~1,640 kcal — the rest of today's protein + carbs + fat." },
  { id: "hygiene", time: "9:45 PM", label: "Hygiene / prep tomorrow", desc: "Shower if sweaty, skin, teeth, lay out gear." },
  { id: "read", time: "10:15 PM", label: "Reading", desc: "20-30 min. Phone away from bed after." },
  { id: "sleep", time: "11:15 PM", label: "Sleep target", desc: "7.5-9 hours. Recovery is part of the program." },
];

/* ---------------------------- DATA: PROGRAM ----------------------------
   No pull-up/dip bar right now -> every vertical-pull and dip movement is
   substituted with a bookbag(loaded)+chair variant. Swap back to the real
   version instantly once you get access to a bar; the program is written
   so that's a drop-in upgrade, not a rebuild.
--------------------------------------------------------------------------*/
const PROGRAM = {
  1: {
    name: "Chest + Back", load: "Hard",
    exercises: [
      { name: "Feet-elevated push-up", muscle: "Upper chest", target: "3 x 8-15", cue: "3-sec descent, ribs stacked, equal palm pressure. Final set: 6-8 bottom-half partials." },
      { name: "Archer push-up / sliding towel fly", muscle: "Chest / adduction", target: "3 x 6-12", cue: "Controlled shoulder, stop on front-shoulder pain. Final set: 4-6 stretched partials." },
      { name: "Loaded chair dip", muscle: "Chest / triceps", target: "3-4 x 6-12", cue: "Hands on chair seat behind you, shoulders down, no twisting.", note: "Bar sub: bookbag on back or between knees. This is now your primary chest/triceps overload — add weight before adding reps." },
      { name: "Bookbag towel row", muscle: "Mid-back", target: "3 x 8-15", cue: "Pull sternum toward the strap, pause, pelvis square.", note: "Bar sub: sit braced, towel/strap looped through bag handles, lean back and row to chest." },
      { name: "Chair-braced archer row", muscle: "Lats", target: "3 x 5-10/side", cue: "Initiate from the scapula, long neck, no yanking.", note: "Bar sub for pull-ups. Real vertical-pull loading needs a bar — a park pull-up bar once a week matters more than any chair variation." },
      { name: "Prone T / reverse snow angel", muscle: "Rear delt / upper back", target: "2 x 10-15", cue: "Elbows out, squeeze upper back without lumbar arch. Final set: 6-10 controlled partials." },
    ],
  },
  2: {
    name: "Shoulders + Core", load: "Hard",
    exercises: [
      { name: "Pike push-up", muscle: "Front/side delts", target: "4 x 6-12", cue: "Head travels forward/down, push floor away hard. Final 2 sets: 4-6 deep partials.", note: "Load with bookbag on back once you're consistently hitting the top of the range." },
      { name: "Wall lateral-raise isometric press", muscle: "Side delt", target: "3 x 20-40 sec/side", cue: "Press arm laterally into wall, torso stays vertical.", note: "Hold the bag by one strap in your working hand for added load." },
      { name: "Prone T / reverse snow angel", muscle: "Rear delt", target: "3 x 12-20", cue: "Long neck, shoulder blades glide, no shrugging. 8-10 pulses on the final set." },
      { name: "Feet-elevated pike push-up", muscle: "Overhead strength", target: "3 x 6-10", cue: "Progress toward wall handstand push-up only when fully controlled. 3-5 deep partials on the final set." },
      { name: "Pike scapular shrug", muscle: "Traps / serratus", target: "3 x 12-20", cue: "Arms straight, move the shoulder blades not the elbows. 8 pulses on the final set." },
      { name: "Lying leg raise", muscle: "Abs / hip flexors", target: "3 x 10-20", cue: "Posterior pelvic tilt, no swinging.", note: "Hold the bag between your feet for load once bodyweight reps get easy." },
      { name: "Hollow-body hold", muscle: "Deep core", target: "3 x 30-45 sec", cue: "Exhale, reduce the lever before your low back loses control." },
    ],
  },
  3: {
    name: "Legs + Core", load: "Hard",
    exercises: [
      { name: "Sliding hamstring curl", muscle: "Hamstrings", target: "3 x 8-15", cue: "Hips high, control the extension. 5 lengthened partials on the final set." },
      { name: "Bulgarian split squat", muscle: "Quads / glutes", target: "4 x 10-15/leg", cue: "Tripod foot, pelvis square, knee tracks toes.", note: "Bag on back, rear foot up on a chair. Your best available loaded-leg movement — push weight here." },
      { name: "Single-leg hip hinge", muscle: "Posterior chain", target: "3 x 10-15/leg", cue: "Reach hips back, spine long, do not rotate open.", note: "Hold the bag in front with both hands for load." },
      { name: "Reverse Nordic", muscle: "Quads", target: "3 x 8-15", cue: "Knees padded, body stays straight from knee to head. 4-6 lengthened partials on the final set." },
      { name: "Single-leg calf raise off step", muscle: "Calves", target: "4 x 15-30/leg", cue: "Full heel drop, full rise, wall only for balance.", note: "Bag on back to overload once bodyweight reps are easy." },
      { name: "Front plank", muscle: "Core", target: "3 x 45-75 sec", cue: "Ribs over pelvis, squeeze glutes, breathe behind the brace.", note: "Rest the bag on your lower back/glutes for added tension." },
      { name: "Bird dog", muscle: "Core / anti-rotation", target: "3 x 8/side, 3-sec hold", cue: "Pelvis stays level and motionless." },
    ],
  },
  4: {
    name: "Recovery + Posture", load: "Easy",
    exercises: [
      { name: "Dead bug", muscle: "Trunk control", target: "3 x 8/side", cue: "Slow exhale, no rotation." },
      { name: "Bird dog", muscle: "Trunk control", target: "3 x 8/side", cue: "Reach long instead of lifting high." },
      { name: "Glute bridge", muscle: "Glutes", target: "3 x 15", cue: "Even foot pressure, level pelvis.", note: "Bag across the hips for light load if it feels easy." },
      { name: "Prone Y-T-W", muscle: "Upper back", target: "2 x 8 each", cue: "Low effort, clean scapular motion." },
      { name: "Side plank", muscle: "Lateral core", target: "2 x 20-40 sec/side", cue: "Train both sides equally." },
      { name: "Easy walk / easy run", muscle: "Recovery", target: "20-40 min", cue: "Conversational pace, finish fresher than you started." },
    ],
  },
  5: {
    name: "Push", load: "Hard",
    exercises: [
      { name: "Pike push-up", muscle: "Shoulders", target: "3 x 6-10", cue: "Explode upward, controlled 3-sec lower. 5 deep partials on the final set.", note: "Bag on back once bodyweight is no longer the limiter." },
      { name: "Feet-elevated push-up", muscle: "Upper chest", target: "3 x 8-15", cue: "Chest toward floor, rigid trunk. 6-8 bottom-half on the final set.", note: "Bag on back for load." },
      { name: "Deficit / standard push-up", muscle: "Chest", target: "2 x 10-20", cue: "Books/handles only if stable, shoulders stay controlled. 8 bottom-half on the final set.", note: "Bag on back for load." },
      { name: "Wall lateral isometric + pike shrug", muscle: "Side delts / traps", target: "3 x 30 sec + 12", cue: "Do not side-bend to create force.", note: "Hold the bag for added resistance on the lateral hold." },
      { name: "Loaded chair triceps extension", muscle: "Triceps", target: "3 x 8-15", cue: "Elbows point forward, move through the elbows only.", note: "Bag on back or held behind head. 5-8 stretched partials on the final set." },
      { name: "Diamond push-up", muscle: "Triceps / chest", target: "2 x 8-15", cue: "Stop when the torso begins twisting. 5-8 bottom-half on the final set.", note: "Bag on back for load." },
    ],
  },
  6: {
    name: "Pull", load: "Hard*",
    exercises: [
      { name: "Bookbag towel row (heavy lean)", muscle: "Lats / biceps", target: "4 x 8-15", cue: "Dead-hang lean angle, initiate with the scapula, no yanking.", note: "Primary pull-up substitute — increase lean angle / bag weight as reps get easy. Extra-lengthened partials on the final set." },
      { name: "Single-leg hip hinge + hamstring walkout", muscle: "Posterior chain", target: "3 x 10/leg + 8", cue: "Hips square, long spine.", note: "Hold the bag for load." },
      { name: "Chair-braced bag row", muscle: "Mid-back", target: "3 x 8-15", cue: "Body rigid, row to chest. 5-8 lengthened partials on the final set." },
      { name: "Wide-grip bag row", muscle: "Lats", target: "3 x 4-8", cue: "Elbows out wide, no kipping, shoulders symmetrical.", note: "Wide-grip pull-up substitute. 3-5 stretched partials on the final set." },
      { name: "Underhand bag row", muscle: "Biceps", target: "3 x 5-10", cue: "Drive elbows down, do not crane the neck.", note: "Chin-up substitute — supinated (palms-up) grip on the strap. 3-5 bottom/stretch partials on the final set." },
      { name: "Neutral-grip towel row", muscle: "Brachialis / grip", target: "2 x 8-15", cue: "Wrist neutral, grip hard, shoulders level. 5 partials on the final set." },
      { name: "Bag farmer carry + scapular shrug", muscle: "Scapular control / grip", target: "2 x 30-45 sec + 8", cue: "Relax grip between sets, no painful traction.", note: "If you find any bar/beam/doorframe you can hang from, even briefly, use it here — nothing replaces real hanging for shoulder health." },
    ],
  },
  7: {
    name: "Recovery", load: "Easy",
    exercises: [
      { name: "Easy walk", muscle: "Recovery", target: "30-60 min", cue: "Nasal breathing, conversational pace." },
      { name: "Dead bug", muscle: "Core", target: "2 x 8/side", cue: "Quiet, controlled breathing." },
      { name: "Reverse snow angel", muscle: "Upper back", target: "2 x 12", cue: "Move slowly, no lumbar arch." },
      { name: "Hip-flexor + calf stretch", muscle: "Mobility", target: "2 x 30-45 sec/side", cue: "Mild stretch only, no forcing." },
    ],
  },
};

const DAY_KEYS = [1, 2, 3, 4, 5, 6, 7];

/* ---------------------------- DATA: NUTRITION ---------------------------- */
// Calculated from: 5'11" (180cm), 159lb (72.1kg), 23yo male, moderately active
// (delivery + daily running + 5x/week training), targeting +1 lb/week.
const NUTRITION = {
  bmr: 1738,
  tdee: 2780,
  calories: 3280,
  protein: 175,   // g
  fat: 95,        // g
  carbs: 430,     // g
  meals: 2,
};

/* ============================ STATE / STORAGE ============================ */
const DB_KEY = "apex_v1";

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    settings: { cycleStart: todayISO(), cycleStartDay: 1 },
    schedule: {},   // { "2026-08-20": { wake: true, ... } }
    workouts: {},   // { "2026-08-20": { dayNum: 1, exercises: { "Feet-elevated push-up": [{reps,weight,partial}] } } }
    body: [],       // [{date, weight}]
    waist: [],      // [{date, value}]
    pushups: [],    // [{date, reps}]
    runs: [],       // [{date, minutes}]
    water: {},      // { "2026-08-20": count }
    meals: {},      // { "2026-08-20": { meal1: true, meal2: true, calories: 0, protein: 0 } }
    streakSeen: {},
  };
}
let DB = loadDB();
function save() { localStorage.setItem(DB_KEY, JSON.stringify(DB)); }

function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function isoFromDate(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function fmtDateShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function cycleDayFor(iso) {
  const start = new Date(DB.settings.cycleStart + "T00:00:00");
  const cur = new Date(iso + "T00:00:00");
  const diff = Math.round((cur - start) / 86400000);
  let n = ((DB.settings.cycleStartDay - 1 + diff) % 7 + 7) % 7 + 1;
  return n;
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ============================ STREAK ============================ */
function computeStreak() {
  let streak = 0;
  let d = new Date();
  for (let i = 0; i < 400; i++) {
    const iso = isoFromDate(d);
    const sched = DB.schedule[iso];
    const hitTrain = sched && sched.train;
    if (hitTrain) { streak++; d.setDate(d.getDate() - 1); }
    else if (iso === todayISO()) { d.setDate(d.getDate() - 1); continue; } // don't break streak on today if not done yet
    else break;
  }
  return streak;
}

/* ============================ RENDER: TODAY ============================ */
function renderToday() {
  const iso = todayISO();
  const dayNum = cycleDayFor(iso);
  const day = PROGRAM[dayNum];
  if (!DB.schedule[iso]) DB.schedule[iso] = {};
  const sched = DB.schedule[iso];

  const doneCount = SCHEDULE.filter(s => sched[s.id]).length;
  const pct = Math.round((doneCount / SCHEDULE.length) * 100);

  let html = `
    <div class="day-stamp">
      <div class="eyebrow">${new Date().toLocaleDateString(undefined,{weekday:"long", month:"long", day:"numeric"})}</div>
      <h2>Day ${dayNum} — ${day.name}</h2>
      <span class="load-tag ${day.load.startsWith("Hard") ? "load-hard" : "load-easy"}">${day.load} session</span>
    </div>

    <div class="card">
      <div class="card-title">Today's checklist — ${pct}%</div>
      ${SCHEDULE.map(item => `
        <div class="sched-item ${sched[item.id] ? "done" : ""}" data-sched="${item.id}">
          <div class="check ${sched[item.id] ? "done" : ""}"></div>
          <div class="sched-body">
            <div class="sched-time">${item.time}</div>
            <div class="sched-label">${item.label}</div>
            <div class="sched-desc">${item.dynamic ? `${day.name} — see Train tab` : item.desc}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.getElementById("app").innerHTML = html;

  document.querySelectorAll("[data-sched]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.sched;
      sched[id] = !sched[id];
      save();
      renderToday();
      updateStreakBadge();
    });
  });
}

/* ============================ RENDER: TRAIN ============================ */
let trainViewDay = null;
function renderTrain() {
  const iso = todayISO();
  if (trainViewDay === null) trainViewDay = cycleDayFor(iso);
  const day = PROGRAM[trainViewDay];
  if (!DB.workouts[iso]) DB.workouts[iso] = { dayNum: trainViewDay, exercises: {} };
  const workoutLog = DB.workouts[iso];

  let html = `
    <div class="seg" id="daySeg">
      ${DAY_KEYS.map(n => `<button class="${n === trainViewDay ? "active" : ""}" data-day="${n}">D${n}</button>`).join("")}
    </div>
    <div class="card" style="margin-bottom:16px;">
      <h3 style="font-size:20px;">${day.name}</h3>
      <div class="ex-muscle" style="margin-top:4px;">${day.load} session • ${day.exercises.length} movements</div>
    </div>
  `;

  day.exercises.forEach((ex, idx) => {
    const logKey = ex.name;
    const sets = workoutLog.exercises[logKey] || [];
    html += `
      <div class="ex-card">
        <div class="ex-head">
          <div>
            <div class="ex-name">${ex.name}</div>
            <div class="ex-muscle">${ex.muscle}</div>
          </div>
          <div class="ex-target">${ex.target}</div>
        </div>
        <div class="ex-cue">${ex.cue}</div>
        ${ex.note ? `<div class="ex-note"><b>Bag/chair sub:</b> ${ex.note}</div>` : ""}
        <div id="sets-${idx}">
          ${sets.map((s, si) => `
            <div class="hist-row" style="font-size:12.5px;">
              <span>Set ${si + 1}</span>
              <span class="hist-val">${s.reps} reps${s.weight ? ` @ +${s.weight}lb` : ""}${s.partial ? " · partial" : ""}</span>
            </div>
          `).join("")}
        </div>
        <div class="set-row">
          <div class="set-col"><span>Reps</span><input type="number" inputmode="numeric" id="reps-${idx}" placeholder="12" /></div>
          <div class="set-col"><span>Bag lb</span><input type="number" inputmode="numeric" id="wt-${idx}" placeholder="0" /></div>
          <button class="btn btn-sm" style="flex-shrink:0; margin-top:16px;" data-log="${idx}">+ Set</button>
        </div>
      </div>
    `;
  });

  html += `<button class="btn btn-ghost" id="finishTrain" style="margin-top:6px;">Mark training done for today</button>`;

  document.getElementById("app").innerHTML = html;

  document.querySelectorAll("[data-day]").forEach(btn => {
    btn.addEventListener("click", () => {
      trainViewDay = parseInt(btn.dataset.day);
      renderTrain();
    });
  });

  day.exercises.forEach((ex, idx) => {
    const btn = document.querySelector(`[data-log="${idx}"]`);
    btn.addEventListener("click", () => {
      const reps = document.getElementById(`reps-${idx}`).value;
      const wt = document.getElementById(`wt-${idx}`).value;
      if (!reps) { toast("Enter reps first"); return; }
      if (!workoutLog.exercises[ex.name]) workoutLog.exercises[ex.name] = [];
      workoutLog.exercises[ex.name].push({ reps: parseInt(reps), weight: wt ? parseInt(wt) : 0 });
      workoutLog.dayNum = trainViewDay;
      save();
      renderTrain();
      toast("Set logged");
    });
  });

  document.getElementById("finishTrain").addEventListener("click", () => {
    if (!DB.schedule[iso]) DB.schedule[iso] = {};
    DB.schedule[iso].train = true;
    save();
    updateStreakBadge();
    toast("Nice work. Training locked in for today 🔥");
  });
}

/* ============================ RENDER: LOG ============================ */
function renderLog() {
  const iso = todayISO();
  if (!DB.meals[iso]) DB.meals[iso] = { meal1: false, meal2: false };
  if (DB.water[iso] === undefined) DB.water[iso] = 0;
  const meals = DB.meals[iso];
  const water = DB.water[iso];

  const eatenCals = (meals.meal1 ? NUTRITION.calories * 0.45 : 0) + (meals.meal2 ? NUTRITION.calories * 0.55 : 0);
  const eatenProt = (meals.meal1 ? NUTRITION.protein * 0.45 : 0) + (meals.meal2 ? NUTRITION.protein * 0.55 : 0);
  const eatenCarb = (meals.meal1 ? NUTRITION.carbs * 0.45 : 0) + (meals.meal2 ? NUTRITION.carbs * 0.55 : 0);
  const eatenFat = (meals.meal1 ? NUTRITION.fat * 0.45 : 0) + (meals.meal2 ? NUTRITION.fat * 0.55 : 0);

  const html = `
    <div class="card">
      <div class="card-title">Today's meals (2/day target)</div>
      <div class="opt-row">
        <div>
          <div class="lbl">Meal 1 — ~${Math.round(NUTRITION.calories*0.45)} kcal</div>
          <div class="sub">Post-workout, ~10:00 AM</div>
        </div>
        <div class="check ${meals.meal1 ? "done" : ""}" data-meal="meal1"></div>
      </div>
      <div class="opt-row">
        <div>
          <div class="lbl">Meal 2 — ~${Math.round(NUTRITION.calories*0.55)} kcal</div>
          <div class="sub">Post-shift, ~9:15 PM</div>
        </div>
        <div class="check ${meals.meal2 ? "done" : ""}" data-meal="meal2"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Today's totals</div>
      <div class="macro-row">
        <div class="macro-top"><span class="name">Calories</span><span class="val">${Math.round(eatenCals)} / ${NUTRITION.calories}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, eatenCals/NUTRITION.calories*100)}%"></div></div>
      </div>
      <div class="macro-row">
        <div class="macro-top"><span class="name">Protein</span><span class="val">${Math.round(eatenProt)}g / ${NUTRITION.protein}g</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, eatenProt/NUTRITION.protein*100)}%"></div></div>
      </div>
      <div class="macro-row">
        <div class="macro-top"><span class="name">Carbs</span><span class="val">${Math.round(eatenCarb)}g / ${NUTRITION.carbs}g</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, eatenCarb/NUTRITION.carbs*100)}%"></div></div>
      </div>
      <div class="macro-row">
        <div class="macro-top"><span class="name">Fat</span><span class="val">${Math.round(eatenFat)}g / ${NUTRITION.fat}g</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, eatenFat/NUTRITION.fat*100)}%"></div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Water — ${water} / 5 servings (~120 oz)</div>
      <div class="btn-row">
        <button class="btn btn-ghost btn-sm" id="waterMinus">−</button>
        <div style="display:flex; align-items:center; justify-content:center; flex:2; font-family:var(--mono); font-size:20px;">${water * 24} oz</div>
        <button class="btn btn-sm" id="waterPlus">+ 24oz</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Quick log</div>
      <div class="field-row">
        <div class="field">
          <label>Run (min)</label>
          <input type="number" id="runMin" placeholder="25" />
        </div>
        <div class="field">
          <label>Push-up test</label>
          <input type="number" id="pushupMax" placeholder="reps" />
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="logRun">Log run</button>
        <button class="btn btn-ghost" id="logPushup">Log push-ups</button>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML = html;

  document.querySelectorAll("[data-meal]").forEach(el => {
    el.addEventListener("click", () => {
      meals[el.dataset.meal] = !meals[el.dataset.meal];
      save();
      renderLog();
    });
  });
  document.getElementById("waterPlus").addEventListener("click", () => { DB.water[iso]++; save(); renderLog(); });
  document.getElementById("waterMinus").addEventListener("click", () => { DB.water[iso] = Math.max(0, DB.water[iso]-1); save(); renderLog(); });

  document.getElementById("logRun").addEventListener("click", () => {
    const min = document.getElementById("runMin").value;
    if (!min) { toast("Enter minutes"); return; }
    DB.runs.push({ date: iso, minutes: parseInt(min) });
    save(); toast("Run logged"); renderLog();
  });
  document.getElementById("logPushup").addEventListener("click", () => {
    const reps = document.getElementById("pushupMax").value;
    if (!reps) { toast("Enter reps"); return; }
    DB.pushups.push({ date: iso, reps: parseInt(reps) });
    save(); toast("Push-up test logged"); renderLog();
  });
}

/* ============================ RENDER: PROGRESS ============================ */
function renderProgress() {
  const iso = todayISO();

  const sparkline = (arr, key) => {
    const last = arr.slice(-10);
    if (last.length === 0) return `<div class="empty">No entries yet</div>`;
    const max = Math.max(...last.map(x => x[key]));
    return `<div class="spark">${last.map(x => {
      const h = max ? Math.max(6, (x[key] / max) * 60) : 6;
      return `<div class="bar ${x.date === iso ? "today" : ""}" style="height:${h}px" title="${x[key]}"></div>`;
    }).join("")}</div>`;
  };

  const latestBW = DB.body.length ? DB.body[DB.body.length - 1].weight : "—";
  const latestPU = DB.pushups.length ? DB.pushups[DB.pushups.length - 1].reps : "—";
  const totalRunMin = DB.runs.reduce((a, r) => a + r.minutes, 0);

  const html = `
    <div class="stat-grid" style="margin-bottom:14px;">
      <div class="stat-box"><div class="stat-num">${latestBW}</div><div class="stat-lbl">lb bodyweight</div></div>
      <div class="stat-box"><div class="stat-num">${latestPU}</div><div class="stat-lbl">push-up max</div></div>
      <div class="stat-box"><div class="stat-num">${totalRunMin}</div><div class="stat-lbl">total run min</div></div>
    </div>

    <div class="card">
      <div class="card-title">Log bodyweight</div>
      <div class="field-row">
        <div class="field" style="margin-bottom:0;"><input type="number" step="0.1" id="bwInput" placeholder="159.0 lb" /></div>
        <button class="btn btn-sm" id="bwLog" style="width:auto; flex-shrink:0;">Log</button>
      </div>
      ${sparkline(DB.body, "weight")}
    </div>

    <div class="card">
      <div class="card-title">Log waist (in)</div>
      <div class="field-row">
        <div class="field" style="margin-bottom:0;"><input type="number" step="0.1" id="waistInput" placeholder="32.0 in" /></div>
        <button class="btn btn-sm" id="waistLog" style="width:auto; flex-shrink:0;">Log</button>
      </div>
      ${sparkline(DB.waist, "value")}
    </div>

    <div class="card">
      <div class="card-title">Push-up test history</div>
      ${sparkline(DB.pushups, "reps")}
      ${DB.pushups.slice(-6).reverse().map(p => `<div class="hist-row"><span class="hist-date">${fmtDateShort(p.date)}</span><span class="hist-val">${p.reps} reps</span></div>`).join("")}
    </div>

    <div class="card">
      <div class="card-title">Recent training</div>
      ${Object.keys(DB.workouts).sort().reverse().slice(0, 7).map(d => {
        const w = DB.workouts[d];
        const setCount = Object.values(w.exercises).reduce((a, s) => a + s.length, 0);
        return `<div class="hist-row"><span class="hist-date">${fmtDateShort(d)} — Day ${w.dayNum}</span><span class="hist-val">${setCount} sets</span></div>`;
      }).join("") || `<div class="empty">No sessions logged yet</div>`}
    </div>
  `;

  document.getElementById("app").innerHTML = html;

  document.getElementById("bwLog").addEventListener("click", () => {
    const v = document.getElementById("bwInput").value;
    if (!v) return;
    DB.body = DB.body.filter(b => b.date !== iso);
    DB.body.push({ date: iso, weight: parseFloat(v) });
    DB.body.sort((a,b) => a.date.localeCompare(b.date));
    save(); toast("Bodyweight logged"); renderProgress();
  });
  document.getElementById("waistLog").addEventListener("click", () => {
    const v = document.getElementById("waistInput").value;
    if (!v) return;
    DB.waist = DB.waist.filter(b => b.date !== iso);
    DB.waist.push({ date: iso, value: parseFloat(v) });
    DB.waist.sort((a,b) => a.date.localeCompare(b.date));
    save(); toast("Waist logged"); renderProgress();
  });
}

/* ============================ RENDER: MORE ============================ */
function renderMore() {
  const installed = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  const html = `
    ${!installed ? `
    <div class="install-banner">
      <b>Install this on your home screen:</b> tap the Share icon in Safari, then "Add to Home Screen." It'll open full-screen like a native app and work offline.
    </div>` : ""}

    <div class="card">
      <div class="card-title">Daily nutrition targets</div>
      <div class="opt-row"><div class="lbl">Calories</div><div class="hist-val">${NUTRITION.calories} kcal</div></div>
      <div class="opt-row"><div class="lbl">Protein</div><div class="hist-val">${NUTRITION.protein} g</div></div>
      <div class="opt-row"><div class="lbl">Carbs</div><div class="hist-val">${NUTRITION.carbs} g</div></div>
      <div class="opt-row"><div class="lbl">Fat</div><div class="hist-val">${NUTRITION.fat} g</div></div>
      <div class="opt-row"><div class="lbl">TDEE (maintenance)</div><div class="hist-val">${NUTRITION.tdee} kcal</div></div>
      <div class="opt-row"><div class="lbl">Target</div><div class="hist-val">+1 lb/week</div></div>
    </div>

    <div class="card">
      <div class="card-title">Cycle settings</div>
      <div class="field">
        <label>Which day is today in the split?</label>
        <select id="setToday">
          ${DAY_KEYS.map(n => `<option value="${n}">Day ${n} — ${PROGRAM[n].name}</option>`).join("")}
        </select>
      </div>
      <button class="btn" id="setTodayBtn">Set today's split day</button>
    </div>

    <div class="card">
      <div class="card-title">Data</div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="exportBtn">Export backup</button>
        <button class="btn btn-ghost" id="resetBtn">Reset all data</button>
      </div>
    </div>

    <div class="card">
      <div class="card-title">About this program</div>
      <div class="ex-cue">6-week bodyweight + bookbag-loaded hypertrophy protocol built around your delivery shift schedule. Vertical-pull and dip movements are substituted with loaded bookbag/chair variants until a pull-up bar is available — swap them back in the moment you get access to one.</div>
    </div>
  `;

  document.getElementById("app").innerHTML = html;

  document.getElementById("setToday").value = cycleDayFor(todayISO());
  document.getElementById("setTodayBtn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("setToday").value);
    DB.settings.cycleStart = todayISO();
    DB.settings.cycleStartDay = n;
    save();
    trainViewDay = n;
    toast("Cycle updated");
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(DB, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `apex-backup-${todayISO()}.json`;
    a.click();
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("This deletes all logged data on this device. Continue?")) {
      localStorage.removeItem(DB_KEY);
      DB = loadDB();
      toast("Data reset");
      renderMore();
    }
  });
}

/* ============================ TAB SWITCHING ============================ */
const RENDERERS = { today: renderToday, train: renderTrain, log: renderLog, progress: renderProgress, more: renderMore };

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  RENDERERS[tab]();
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function updateStreakBadge() {
  document.getElementById("streakBadge").textContent = `🔥 ${computeStreak()}`;
}

/* ============================ INIT ============================ */
renderToday();
updateStreakBadge();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
