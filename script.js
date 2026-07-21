/* ======================================================================
   EDIT ME — all personalization lives in this CONFIG object.
   ====================================================================== */
const CONFIG = {
  recipientName: "Kajal",

  // How long you've known each other — each number counts up on the
  // welcome screen. The seconds are shown as plain text ("...and some
  // precious secs"), not an exact number.
  knownDuration: { years: 2, months: 5, days: 3, mins: 39 },

  welcomeMessage:
    "I just wanted to take a moment today to tell you how much you mean " +
    "to me. Here's a little journey I made just for you...",

  // One caption per memory. Photos are looked up as images/memory1.jpg,
  // images/memory2.jpg, etc. — just drop in files with those exact names
  // and they'll replace the placeholder automatically.
  memories: [
    "My lil adventure with my lil miss",
    "One more for the memory books 💫",
    "Just wow 🤍",
    "The trip we still talk about to this day ✈️",
    "The time you showed up for me when it mattered most",
  ],

  reasons: [
    { emoji: "😊", text: "Your expressions light up even a dimly lit room, iykyk" },
    { emoji: "🎯", text: "You always know exactly what to say and do to make me feel better 😉" },
    { emoji: "🤝", text: "Even your quietest little acts of kindness don't go unnoticed — they mean the most" },
    { emoji: "🚀", text: "You're my inspiration — just watching you makes me want to strive harder and become better" },
  ],

  candleCount: 5,

  signOff: "— From Me",

  // Optional background music. If a file exists at this path, it plays
  // instead of the built-in synthesized "Happy Birthday" melody that
  // plays by default.
  musicPath: "media/bg-music.mp3",
};

/* ====================================================================== */

/* ---------------------------------------------------------------------
   Sound effects — synthesized with the Web Audio API, so no sound
   files are needed at all. Toggle with the speaker button (top-right).
--------------------------------------------------------------------- */
let soundEnabled = true;
let sharedAudioCtx = null;

function getAudioCtx() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
  return sharedAudioCtx;
}

function playTone(freq, duration, { type = "sine", volume = 0.2, delay = 0 } = {}) {
  if (!soundEnabled) return;
  const audioCtx = getAudioCtx();
  const startAt = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

function playChime() {
  [523.25, 659.25, 783.99].forEach((freq, i) =>
    playTone(freq, 0.35, { type: "triangle", volume: 0.18, delay: i * 0.09 })
  );
}

function playClick() {
  playTone(880, 0.08, { type: "sine", volume: 0.12 });
}

function playFlip() {
  playTone(600, 0.1, { type: "triangle", volume: 0.14 });
}

function playSparkle() {
  for (let i = 0; i < 3; i++) {
    playTone(800 + Math.random() * 900, 0.2, {
      type: "triangle",
      volume: 0.12,
      delay: i * 0.06,
    });
  }
}

function playWhoosh() {
  if (!soundEnabled) return;
  const audioCtx = getAudioCtx();
  const bufferSize = Math.floor(audioCtx.sampleRate * 0.4);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.4);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

  noise.connect(filter).connect(gain).connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + 0.4);
}

function playBoom() {
  playTone(90, 0.35, { type: "sine", volume: 0.22 });
  playSparkle();
}

/* ---------------------------------------------------------------------
   Synthesized "Happy Birthday to You" background music.
   The melody itself is public domain (its copyright was struck down in
   2015/2016), so this generates a soft instrumental loop with oscillators
   instead of needing any actual audio file. Only used as a fallback —
   if you drop a real file at CONFIG.musicPath, that plays instead.
--------------------------------------------------------------------- */
const NOTE_FREQ = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
};

// [note, beats] — quarter note = 1 beat, eighth = 0.5, half = 2
const HBD_MELODY = [
  ["G4", 0.5], ["G4", 0.5], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.5], ["G4", 0.5], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.5], ["G4", 0.5], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["F5", 0.5], ["F5", 0.5], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2],
];

// Backing "chorus" voice: instead of static chords (which, heard on their
// own, don't trace the tune at all — hence unrecognizable), this harmonizes
// the SAME melody a diatonic third below, note-for-note. Solo it and you'd
// still hear the Happy Birthday contour, just in a lower harmony.
const THIRD_BELOW = {
  G4: "E4", A4: "F4", B4: "G4", C5: "A4",
  D5: "B4", E5: "C5", F5: "D5", G5: "E5",
};

const SECONDS_PER_BEAT = 0.4;
let bgmEnabled = true; // false once a real music file is found
let melodyLoopTimer = null;
let synthBgmActive = false; // guards against overlapping loops from repeat triggers

// Shared reverb-ish send bus: a short feedback delay + lowpass, mixed under
// the dry signal, so notes have a bit of space/warmth instead of sounding dry.
let musicBus = null;
function getMusicBus() {
  const audioCtx = getAudioCtx();
  if (musicBus && musicBus.ctx === audioCtx) return musicBus;

  const input = audioCtx.createGain();
  const dryGain = audioCtx.createGain();
  dryGain.gain.value = 0.95;
  const wetGain = audioCtx.createGain();
  wetGain.gain.value = 0.12;
  const delay = audioCtx.createDelay(1.0);
  // Short "room" delay rather than a discrete slap-back — long enough to add
  // warmth, short enough that it doesn't collide with the eighth notes and
  // read as a laggy, out-of-time echo.
  delay.delayTime.value = 0.09;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.12;
  // Damping filter sits OUTSIDE the feedback loop, applied once on the way
  // out. Putting it inside delay<->feedback (as before) re-filtered every
  // recirculation, so the tail got darker each pass and ended up muffled.
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 5000;

  input.connect(dryGain).connect(audioCtx.destination);
  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(filter);
  filter.connect(wetGain);
  wetGain.connect(audioCtx.destination);

  musicBus = { ctx: audioCtx, input };
  return musicBus;
}

// Melody voice: two slightly detuned oscillators (a soft chorus effect)
// instead of one flat triangle wave. Kept centered (no per-note panning) —
// swapping pan on every note made fast passages sound like they were
// jumping around instead of staying locked together.
function playMelodyNote(freq, duration, delay, idx = 0) {
  const audioCtx = getAudioCtx();
  const bus = getMusicBus();
  const startAt = audioCtx.currentTime + delay;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(0.055, startAt + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.95);
  gain.connect(bus.input);

  [
    { type: "triangle", detune: -4 },
    { type: "sine", detune: 5 },
  ].forEach(({ type, detune }) => {
    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(gain);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  });
}

// Harmony voice — same rhythm as the melody, pitched a third below, quieter
// and a plain sine so it sits underneath rather than competing with it.
function playHarmonyNote(freq, duration, delay) {
  const audioCtx = getAudioCtx();
  const bus = getMusicBus();
  const startAt = audioCtx.currentTime + delay;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(0.03, startAt + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.95);

  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(gain).connect(bus.input);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

function scheduleMelodyLoop() {
  let t = 0;

  HBD_MELODY.forEach(([note, beats], i) => {
    const duration = beats * SECONDS_PER_BEAT;
    playMelodyNote(NOTE_FREQ[note], duration, t, i);
    const harmonyNote = THIRD_BELOW[note];
    if (harmonyNote) playHarmonyNote(NOTE_FREQ[harmonyNote], duration, t);
    t += duration;
  });

  melodyLoopTimer = setTimeout(() => {
    if (soundEnabled && bgmEnabled) {
      scheduleMelodyLoop();
    } else {
      synthBgmActive = false;
    }
  }, (t + 1.4) * 1000);
}

// Guarded entry point — safe to call repeatedly (e.g. every landing click
// after a Replay) without stacking multiple overlapping melody loops.
function startSynthBgmLoop() {
  if (!soundEnabled || !bgmEnabled || synthBgmActive) return;
  synthBgmActive = true;
  scheduleMelodyLoop();
}

function stopSynthBgmLoop() {
  synthBgmActive = false;
  if (melodyLoopTimer) {
    clearTimeout(melodyLoopTimer);
    melodyLoopTimer = null;
  }
}

document.addEventListener("DOMContentLoaded", init);

function init() {
  document.getElementById("recipient-name").textContent = CONFIG.recipientName;
  document
    .querySelectorAll(".recipient-name-inline")
    .forEach((el) => (el.textContent = CONFIG.recipientName));
  document.getElementById("signoff-text").textContent = CONFIG.signOff;

  setupCanvas();
  setupBalloons();
  setupMusic();
  setupNextButtons();
  setupLoadingScreen();
  setupLanding();
  setupWelcome();
  setupMemories();
  setupReasons();
  setupCake();
  setupReplay();

  // Try to start music the instant the page opens, before any click.
  // Most browsers block audio without a user gesture, so this will often
  // be silently blocked — the capture-phase listener below is the fallback,
  // firing on the very first tap/click/key anywhere on the page (even on
  // the loading screen), so playback starts as early as the browser allows
  // rather than waiting specifically for the landing "click to begin".
  tryPlayMusic();
  ["click", "touchstart", "keydown", "pointerdown"].forEach((evt) => {
    window.addEventListener(evt, tryPlayMusic, { capture: true, once: true });
  });
}

/* ---------------------------------------------------------------------
   Ambient floating balloons (background decoration)
--------------------------------------------------------------------- */
function setupBalloons() {
  const wrap = document.getElementById("balloons-bg");
  const colors = ["#ff6b9d", "#ffd166", "#a78bfa", "#7fd8be", "#ff9ec7"];

  for (let i = 0; i < 8; i++) {
    const balloon = document.createElement("span");
    balloon.className = "balloon";
    balloon.style.left = `${Math.random() * 95}%`;
    balloon.style.background = colors[i % colors.length];
    balloon.style.animationDuration = `${16 + Math.random() * 10}s`;
    balloon.style.animationDelay = `${Math.random() * 14}s`;
    wrap.appendChild(balloon);
  }
}

/* ---------------------------------------------------------------------
   Scene navigation
--------------------------------------------------------------------- */
function goToScene(id) {
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.dispatchEvent(new CustomEvent("scene:show", { detail: { id } }));
}

function setupNextButtons() {
  document.querySelectorAll(".next-btn[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      playClick();
      goToScene(btn.dataset.next);
    });
  });
}

/* ---------------------------------------------------------------------
   Loading screen
--------------------------------------------------------------------- */
function setupLoadingScreen() {
  setTimeout(() => goToScene("scene-landing"), 1800);
}

/* ---------------------------------------------------------------------
   Landing (click anywhere to begin)
--------------------------------------------------------------------- */
function setupLanding() {
  const landing = document.getElementById("scene-landing");
  landing.addEventListener("click", () => {
    burstConfetti();
    playChime();
    tryPlayMusic();
    goToScene("scene-welcome");
  });
}

/* ---------------------------------------------------------------------
   Welcome — typewriter + years counter
--------------------------------------------------------------------- */
function setupWelcome() {
  window.addEventListener("scene:show", (e) => {
    if (e.detail.id !== "scene-welcome") return;
    typewriter(document.getElementById("welcome-message"), CONFIG.welcomeMessage, 28);
    const { years, months, days, mins } = CONFIG.knownDuration;
    animateCounter(document.getElementById("know-years"), years, 2600);
    animateCounter(document.getElementById("know-months"), months, 2600);
    animateCounter(document.getElementById("know-days"), days, 2600);
    animateCounter(document.getElementById("know-mins"), mins, 2600);
  });
}

function typewriter(el, text, speedMs) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speedMs);
}

function animateCounter(el, target, durationMs) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / durationMs, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------------------------------------------------------------------
   Memories carousel
--------------------------------------------------------------------- */
function setupMemories() {
  const memories = CONFIG.memories;
  let index = 0;

  const imgEl = document.getElementById("memory-img");
  const captionEl = document.getElementById("memory-caption");
  const dotsWrap = document.getElementById("mem-dots");

  memories.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsWrap.appendChild(dot);
  });

  function render() {
    loadMemoryImage(imgEl, index + 1, 0);
    captionEl.textContent = memories[index];
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle("active", i === index));
  }

  document.getElementById("mem-prev").addEventListener("click", () => {
    playClick();
    index = (index - 1 + memories.length) % memories.length;
    render();
  });
  document.getElementById("mem-next").addEventListener("click", () => {
    playClick();
    index = (index + 1) % memories.length;
    render();
  });

  window.addEventListener("scene:show", (e) => {
    if (e.detail.id !== "scene-memories") return;
    index = 0;
    render();
  });

  render();
}

// Tries images/memoryN.jpg, then .jpeg/.png/.webp, then falls back to
// the placeholder graphic — so any common photo format "just works"
// regardless of what extension you actually saved it with.
const MEMORY_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function loadMemoryImage(imgEl, num, extIndex) {
  if (extIndex >= MEMORY_IMAGE_EXTENSIONS.length) {
    imgEl.onerror = null;
    imgEl.src = "images/placeholder.svg";
    return;
  }
  imgEl.onerror = () => loadMemoryImage(imgEl, num, extIndex + 1);
  imgEl.src = `images/memory${num}.${MEMORY_IMAGE_EXTENSIONS[extIndex]}?_=${Date.now()}`;
}

/* ---------------------------------------------------------------------
   Reasons flip cards
--------------------------------------------------------------------- */
function setupReasons() {
  const grid = document.getElementById("reasons-grid");
  CONFIG.reasons.forEach((reason) => {
    const card = document.createElement("div");
    card.className = "flip-card";
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-front">${reason.emoji}</div>
        <div class="flip-back">${reason.text}</div>
      </div>`;
    card.addEventListener("click", () => {
      playFlip();
      card.classList.toggle("flipped");
    });
    grid.appendChild(card);
  });
}

function fileExists(path) {
  return fetch(path, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);
}

/* ---------------------------------------------------------------------
   Cake — click candles / blow button / microphone
--------------------------------------------------------------------- */
function setupCake() {
  const row = document.getElementById("candles-row");
  const statusEl = document.getElementById("mic-status");
  let candlesLit = CONFIG.candleCount;
  let finished = false;

  for (let i = 0; i < CONFIG.candleCount; i++) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.innerHTML = `<span class="flame">🔥</span>`;
    candle.addEventListener("click", () => extinguishOne(candle));
    row.appendChild(candle);
  }

  function resetCake() {
    candlesLit = CONFIG.candleCount;
    finished = false;
    [...row.children].forEach((c) => c.classList.remove("out"));
    statusEl.textContent = "";
  }

  function extinguishOne(candleEl) {
    if (finished || candleEl.classList.contains("out")) return;
    playWhoosh();
    candleEl.classList.add("out");
    candlesLit--;
    if (candlesLit <= 0) finishBlow();
  }

  function extinguishAll() {
    if (finished) return;
    playWhoosh();
    [...row.children].forEach((c) => c.classList.add("out"));
    candlesLit = 0;
    finishBlow();
  }

  function finishBlow() {
    if (finished) return;
    finished = true;
    burstFireworks();
    playBoom();
    setTimeout(() => goToScene("scene-final"), 1500);
  }

  document.getElementById("blow-btn").addEventListener("click", extinguishAll);

  // Re-arm the whole scene (candles + mic) every time it's shown, so
  // Replay doesn't leave candlesLit/finished stuck from the previous run.
  window.addEventListener("scene:show", (e) => {
    if (e.detail.id !== "scene-cake") return;
    resetCake();
    startMicListener(statusEl, extinguishAll);
  });
}

function startMicListener(statusEl, onBlow) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    statusEl.textContent = "🎤 Mic needs HTTPS — tap a candle or the button instead";
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      statusEl.textContent = "🎤 Mic ready — go ahead and blow!";
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const THRESHOLD = 55;
      const SUSTAIN_MS = 350;
      let loudSince = null;
      let stopped = false;

      function checkVolume() {
        if (stopped) return;
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;

        if (avg > THRESHOLD) {
          if (!loudSince) loudSince = performance.now();
          if (performance.now() - loudSince > SUSTAIN_MS) {
            stopped = true;
            stream.getTracks().forEach((t) => t.stop());
            ctx.close();
            onBlow();
            return;
          }
        } else {
          loudSince = null;
        }
        requestAnimationFrame(checkVolume);
      }
      checkVolume();
    })
    .catch(() => {
      statusEl.textContent = "🎤 Mic unavailable — tap a candle or the button instead";
    });
}

/* ---------------------------------------------------------------------
   Replay
--------------------------------------------------------------------- */
function setupReplay() {
  document.getElementById("replay-btn").addEventListener("click", () => {
    document.querySelectorAll(".flip-card").forEach((c) => c.classList.remove("flipped"));
    goToScene("scene-landing");
  });
}

/* ---------------------------------------------------------------------
   Background music (optional, only enabled if file exists)
--------------------------------------------------------------------- */
function setupMusic() {
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("mute-btn");
  btn.title = "Toggle sound";

  fileExists(CONFIG.musicPath).then((ok) => {
    if (ok) {
      audio.src = CONFIG.musicPath;
      bgmEnabled = false; // a real music file overrides the synthesized melody
    }
  });

  btn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btn.textContent = soundEnabled ? "🔊" : "🔈";
    if (!soundEnabled) {
      audio.pause();
      stopSynthBgmLoop();
    } else if (audio.src) {
      audio.play().catch(() => {});
    } else {
      startSynthBgmLoop();
    }
    if (soundEnabled) playClick();
  });
}

function tryPlayMusic() {
  if (!soundEnabled) return;
  const audio = document.getElementById("bg-music");
  if (audio.src) {
    audio.play().catch(() => {});
  } else {
    startSynthBgmLoop();
  }
}

/* ---------------------------------------------------------------------
   Confetti + fireworks (lightweight canvas particle systems)
--------------------------------------------------------------------- */
let ctx, canvasW, canvasH;
let particles = [];

function setupCanvas() {
  const canvas = document.getElementById("fx-canvas");
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);

  function resize() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
  }

  requestAnimationFrame(loop);
  function loop() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    particles.forEach((p) => p.update());
    particles = particles.filter((p) => p.alive);
    particles.forEach((p) => p.draw());
    requestAnimationFrame(loop);
  }
}

function burstConfetti() {
  const colors = ["#ff6b81", "#ffd166", "#7597de", "#a3f7bf", "#ff9a9e"];
  for (let i = 0; i < 140; i++) {
    particles.push(new ConfettiParticle(colors[i % colors.length]));
  }
}

class ConfettiParticle {
  constructor(color) {
    this.x = Math.random() * canvasW;
    this.y = -20 - Math.random() * 100;
    this.size = 5 + Math.random() * 5;
    this.color = color;
    this.speedY = 2 + Math.random() * 3;
    this.speedX = -1.5 + Math.random() * 3;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = -6 + Math.random() * 12;
    this.life = 0;
    this.alive = true;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.life++;
    if (this.y > canvasH + 30 || this.life > 500) this.alive = false;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    ctx.restore();
  }
}

function burstFireworks() {
  const count = 5;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = canvasW * (0.2 + Math.random() * 0.6);
      const y = canvasH * (0.2 + Math.random() * 0.4);
      spawnFireworkAt(x, y);
      if (i > 0) playSparkle();
    }, i * 350);
  }
}

function spawnFireworkAt(x, y) {
  const colors = ["#ff6b81", "#ffd166", "#7597de", "#a3f7bf", "#ff9a9e", "#ffffff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 60; i++) {
    particles.push(new FireworkParticle(x, y, color));
  }
}

class FireworkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 0;
    this.maxLife = 60 + Math.random() * 30;
    this.alive = true;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.03; // gravity
    this.life++;
    if (this.life > this.maxLife) this.alive = false;
  }
  draw() {
    const alpha = Math.max(0, 1 - this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
