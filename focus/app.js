// Focus Matrix — Ambient Pomodoro & Procedural Sound Synthesizer

// Timer Elements
const timerDisplay = document.getElementById('timer-display');
const timerLabel = document.getElementById('timer-label');
const timerProgressRing = document.getElementById('timer-progress-ring');
const btnStartPause = document.getElementById('btn-start-pause');
const startBtnLabel = document.getElementById('start-btn-label');
const playIcon = document.getElementById('play-icon');
const btnResetTimer = document.getElementById('btn-reset-timer');
const modeChips = document.querySelectorAll('.chip');
const btnZenMode = document.getElementById('btn-zen-mode');

// Timer State
let totalDuration = 1500; // default 25 min
let timeLeft = 1500;
let isRunning = false;
let timerInterval = null;
let currentMode = 'focus';

const circumference = 2 * Math.PI * 140; // r=140 => 879.6
timerProgressRing.style.strokeDasharray = `${circumference} ${circumference}`;
timerProgressRing.style.strokeDashoffset = '0';

// Mode Switching
modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
        modeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        currentMode = chip.dataset.mode;
        totalDuration = parseInt(chip.dataset.time, 10);
        resetTimer();

        if (currentMode === 'focus') {
            timerLabel.textContent = 'STAY IN THE ZONE';
            timerProgressRing.style.stroke = 'var(--cyan)';
        } else if (currentMode === 'short') {
            timerLabel.textContent = 'REST YOUR EYES (5 MIN)';
            timerProgressRing.style.stroke = 'var(--emerald)';
        } else if (currentMode === 'long') {
            timerLabel.textContent = 'RECHARGE & STRETCH (15 MIN)';
            timerProgressRing.style.stroke = 'var(--purple)';
        } else {
            timerLabel.textContent = 'DEEP FLOW STATE';
            timerProgressRing.style.stroke = 'var(--cyan)';
        }
    });
});

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerDisplay.textContent = timeStr;
    document.title = `${timeStr} — Focus Matrix | VN Labs`;

    // Progress Ring Offset
    const progress = (totalDuration - timeLeft) / totalDuration;
    const offset = circumference - (progress * circumference);
    timerProgressRing.style.strokeDashoffset = offset;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtnLabel.textContent = 'Pause';
    playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            startBtnLabel.textContent = 'Start Focus';
            playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
            playChime();
            alert("Session complete! Time to take a breather.");
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    startBtnLabel.textContent = 'Resume';
    playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
}

function resetTimer() {
    pauseTimer();
    timeLeft = totalDuration;
    startBtnLabel.textContent = 'Start Focus';
    updateDisplay();
}

btnStartPause.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

btnResetTimer.addEventListener('click', resetTimer);

// Zen Mode Toggle
btnZenMode.addEventListener('click', () => {
    document.body.classList.toggle('zen-active');
    if (document.body.classList.contains('zen-active')) {
        btnZenMode.querySelector('span').textContent = 'Exit Zen';
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    } else {
        btnZenMode.querySelector('span').textContent = 'Zen Mode';
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
    }
});

// ==========================================
// PROCEDURAL AMBIENT SOUND GENERATOR (Web Audio API)
// ==========================================
let audioCtx = null;
const activeNodes = {};

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Chime when timer ends
function playChime() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.8);
}

// 1. Rain Synthesizer (Filtered Pink Noise)
function createRain(ctx, gainValue) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const gain = ctx.createGain();
    gain.gain.value = gainValue;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    return { source: whiteNoise, gain: gain };
}

// 2. Binaural Beats Synthesizer (10Hz Alpha Waves)
function createBinaural(ctx, gainValue) {
    const merger = ctx.createChannelMerger(2);

    // Left Ear 200 Hz
    const oscL = ctx.createOscillator();
    oscL.frequency.value = 200;
    const gainL = ctx.createGain();
    gainL.gain.value = 0.5;
    oscL.connect(gainL);
    gainL.connect(merger, 0, 0);

    // Right Ear 210 Hz (Creates 10Hz beat frequency)
    const oscR = ctx.createOscillator();
    oscR.frequency.value = 210;
    const gainR = ctx.createGain();
    gainR.gain.value = 0.5;
    oscR.connect(gainR);
    gainR.connect(merger, 0, 1);

    const masterGain = ctx.createGain();
    masterGain.gain.value = gainValue;

    merger.connect(masterGain);
    masterGain.connect(ctx.destination);

    oscL.start();
    oscR.start();

    return {
        stop: () => { oscL.stop(); oscR.stop(); },
        gain: masterGain
    };
}

// 3. Cosmic Drone Synthesizer
function createDrone(ctx, gainValue) {
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = 55; // A1

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 57.5; // slight detune

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;

    const masterGain = ctx.createGain();
    masterGain.gain.value = gainValue;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    return {
        stop: () => { osc1.stop(); osc2.stop(); },
        gain: masterGain
    };
}

// 4. Campfire Synthesizer
function createFire(ctx, gainValue) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.value = gainValue;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    return { source: whiteNoise, gain: gain };
}

// Track Toggle Listeners
document.querySelectorAll('.track-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const soundType = btn.dataset.sound;
        const slider = document.querySelector(`.vol-slider[data-sound="${soundType}"]`);
        const vol = parseFloat(slider.value);
        const ctx = getAudioContext();

        if (activeNodes[soundType]) {
            // Stop sound
            if (activeNodes[soundType].stop) {
                activeNodes[soundType].stop();
            } else if (activeNodes[soundType].source) {
                activeNodes[soundType].source.stop();
            }
            delete activeNodes[soundType];
            btn.classList.remove('active');
        } else {
            // Start sound
            let node;
            if (soundType === 'rain') node = createRain(ctx, vol);
            else if (soundType === 'binaural') node = createBinaural(ctx, vol);
            else if (soundType === 'drone') node = createDrone(ctx, vol);
            else if (soundType === 'fire') node = createFire(ctx, vol);

            if (node) {
                activeNodes[soundType] = node;
                btn.classList.add('active');
            }
        }
    });
});

// Slider Volume Listeners
document.querySelectorAll('.vol-slider').forEach(slider => {
    slider.addEventListener('input', () => {
        const soundType = slider.dataset.sound;
        const vol = parseFloat(slider.value);
        if (activeNodes[soundType] && activeNodes[soundType].gain) {
            activeNodes[soundType].gain.gain.value = vol;
        }
    });
});

// ==========================================
// TASKS / GOALS
// ==========================================
const newTaskInput = document.getElementById('new-task-input');
const btnAddTask = document.getElementById('btn-add-task');
const tasksList = document.getElementById('tasks-list');

function getTasks() {
    try {
        return JSON.parse(localStorage.getItem('vn_focus_tasks')) || [];
    } catch {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem('vn_focus_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const tasks = getTasks();
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-tasks">No tasks added yet. Add 1-2 key priorities for this session.</div>';
        return;
    }

    tasks.forEach(t => {
        const item = document.createElement('div');
        item.className = `task-item ${t.done ? 'done' : ''}`;
        item.innerHTML = `
            <div style="display: flex; align-items: center;">
                <input type="checkbox" class="task-check" ${t.done ? 'checked' : ''}>
                <span>${escapeHtml(t.text)}</span>
            </div>
            <button class="btn-ghost" style="color: #ef4444; cursor: pointer;">✕</button>
        `;

        item.querySelector('.task-check').addEventListener('change', (e) => {
            t.done = e.target.checked;
            saveTasks(tasks);
        });

        item.querySelector('button').addEventListener('click', () => {
            const updated = getTasks().filter(x => x.id !== t.id);
            saveTasks(updated);
        });

        tasksList.appendChild(item);
    });
}

function addTask() {
    const text = newTaskInput.value.trim();
    if (!text) return;

    const tasks = getTasks();
    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });
    saveTasks(tasks);
    newTaskInput.value = '';
}

btnAddTask.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial Render
updateDisplay();
renderTasks();
