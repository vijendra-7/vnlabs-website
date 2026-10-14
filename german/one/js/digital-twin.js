/**
 * KRAFTWERK DYNAMICS // DIGITAL TWIN SIMULATOR ENGINE
 * High-performance 60 FPS HTML5 Canvas Cyber-Physical Visualizer
 * Simulates a high-precision 5-Axis Spindle & Bearing Assembly with Real-Time Telemetry
 */

(function () {
  'use strict';

  const canvas = document.getElementById('digitalTwinCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // DOM HUD Readout elements
  const hudRpm = document.getElementById('hudRpm');
  const hudVibe = document.getElementById('hudVibe');
  const hudTemp = document.getElementById('hudTemp');
  const hudScore = document.getElementById('hudScore');
  const quickStatusChip = document.getElementById('quickStatusChip');
  const quickStatusText = document.getElementById('quickStatusText');

  // Interactive Control Buttons
  const btnNominal = document.getElementById('btnNominal');
  const btnHarmonic = document.getElementById('btnHarmonic');
  const btnAnomaly = document.getElementById('btnAnomaly');

  // Operational State
  let simState = {
    mode: 'nominal', // 'nominal' | 'harmonic' | 'anomaly'
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    angle: 0,
    rpm: 12480,
    targetRpm: 12480,
    vibrationRms: 0.42,
    targetVibe: 0.42,
    temperature: 48.6,
    targetTemp: 48.6,
    anomalyScore: 0.03,
    targetScore: 0.03,
    fftWave: new Array(64).fill(0),
    anomalyTimer: null,
    tick: 0
  };

  // Particles representing high-speed aero/coolant vectors
  const particles = [];
  const PARTICLE_COUNT = 45;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 160,
      z: Math.random() * 200,
      speed: 1.5 + Math.random() * 2.5,
      radius: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.6
    });
  }

  // Handle HiDPI / Retina Displays for razor-sharp rendering
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Mode Transition Handler
  function setMode(mode) {
    simState.mode = mode;

    [btnNominal, btnHarmonic, btnAnomaly].forEach(btn => btn?.classList.remove('active'));

    if (mode === 'nominal') {
      btnNominal?.classList.add('active');
      simState.targetRpm = 12480 + (Math.random() * 40 - 20);
      simState.targetVibe = 0.42;
      simState.targetTemp = 48.6;
      simState.targetScore = 0.03;

      if (quickStatusChip) {
        quickStatusChip.className = 'twin-status-chip ok';
        quickStatusText.textContent = getLocalizedText('twin.nominal', 'NOMINALER ZUSTAND');
      }
      if (hudScore) {
        hudScore.className = 'hud-val mono-code text-safe';
      }
    } else if (mode === 'harmonic') {
      btnHarmonic?.classList.add('active');
      simState.targetRpm = 15820;
      simState.targetVibe = 1.84;
      simState.targetTemp = 68.4;
      simState.targetScore = 0.41;

      if (quickStatusChip) {
        quickStatusChip.className = 'twin-status-chip warn';
        quickStatusText.textContent = getLocalizedText('twin.harmonic', 'LASTWECHSEL / STRESS');
      }
      if (hudScore) {
        hudScore.className = 'hud-val mono-code text-amber';
      }
    } else if (mode === 'anomaly') {
      btnAnomaly?.classList.add('active');
      simState.targetRpm = 11150;
      simState.targetVibe = 4.88;
      simState.targetTemp = 84.2;
      simState.targetScore = 0.89;

      if (quickStatusChip) {
        quickStatusChip.className = 'twin-status-chip danger';
        quickStatusText.textContent = getLocalizedText('twin.anomaly', 'LAGER-SCHADEN SIMULIERT (NOTFALL)');
      }
      if (hudScore) {
        hudScore.className = 'hud-val mono-code text-amber';
      }

      // Automatically trigger German Autonomous Edge-Stabilization after 5 seconds!
      clearTimeout(simState.anomalyTimer);
      simState.anomalyTimer = setTimeout(() => {
        if (simState.mode === 'anomaly') {
          setMode('nominal');
          if (quickStatusText) {
            quickStatusText.textContent = getLocalizedText('twin.stabilized', 'KI-INTERVENTION ERFOLGREICH (STABILISIERT)');
          }
        }
      }, 5500);
    }
  }

  function getLocalizedText(key, fallback) {
    if (window.i18n && window.i18n.t) {
      return window.i18n.t(key) || fallback;
    }
    return fallback;
  }

  // Bind Buttons
  btnNominal?.addEventListener('click', () => setMode('nominal'));
  btnHarmonic?.addEventListener('click', () => setMode('harmonic'));
  btnAnomaly?.addEventListener('click', () => setMode('anomaly'));

  // Main Render Loop
  function render() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    simState.tick++;

    // Interpolate Telemetry Metrics
    simState.rpm += (simState.targetRpm - simState.rpm) * 0.05;
    simState.vibrationRms += (simState.targetVibe - simState.vibrationRms) * 0.05;
    simState.temperature += (simState.targetTemp - simState.temperature) * 0.03;
    simState.anomalyScore += (simState.targetScore - simState.anomalyScore) * 0.05;

    // Small jitter to simulate real industrial sensor noise
    const jitter = (Math.random() - 0.5) * (simState.mode === 'anomaly' ? 80 : 8);
    const displayRpm = Math.round(simState.rpm + jitter);
    const displayVibe = (simState.vibrationRms + (Math.random() - 0.5) * (simState.mode === 'anomaly' ? 0.3 : 0.02)).toFixed(2);
    const displayTemp = (simState.temperature + (Math.random() - 0.5) * 0.1).toFixed(1);

    if (hudRpm) hudRpm.textContent = `${displayRpm.toLocaleString('de-DE')} min⁻¹`;
    if (hudVibe) hudVibe.textContent = `${displayVibe} mm/s`;
    if (hudTemp) hudTemp.textContent = `${displayTemp} °C`;
    if (hudScore) {
      const scoreVal = simState.anomalyScore.toFixed(2);
      let desc = scoreVal < 0.2 ? 'OPTIMAL' : scoreVal < 0.6 ? 'WARNUNG' : 'KRITISCH';
      hudScore.textContent = `${scoreVal} (${desc})`;
    }

    // Rotational Speed
    const rotSpeed = (simState.rpm / 12000) * 0.045;
    simState.angle += rotSpeed;

    const centerX = width / 2;
    const centerY = height / 2 - 10;

    // 1. Draw Sub-grid & Coordinate Crosshairs
    drawBlueprintGrid(centerX, centerY, width, height);

    // 2. Draw 3D Isometric Spindle & Bearing Rotor
    drawCyberPhysicalRotor(centerX, centerY, simState.angle);

    // 3. Draw Coolant / Torque Flow Particles
    drawParticles(centerX, centerY);

    // 4. Draw Real-time FFT Waveform Spectrum
    drawFftSpectrum(width, height);

    // 5. Sensor Overlay Nodes with status halos
    drawSensorNodes(centerX, centerY);

    requestAnimationFrame(render);
  }

  // Technical Coordinate Grid
  function drawBlueprintGrid(cx, cy, w, h) {
    const isLight = simState.theme === 'light';
    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    // Circular concentric range rings
    [60, 110, 160].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = isLight ? 'rgba(0, 102, 255, 0.3)' : 'rgba(0, 102, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(cx - 180, cy);
    ctx.lineTo(cx + 180, cy);
    ctx.moveTo(cx, cy - 140);
    ctx.lineTo(cx, cy + 140);
    ctx.stroke();

    ctx.restore();
  }

  // 3D Isometric Rotor Assembly
  function drawCyberPhysicalRotor(cx, cy, angle) {
    const isLight = simState.theme === 'light';
    ctx.save();
    ctx.translate(cx, cy);

    // Dynamic Color Accent based on status
    let strokeCol = isLight ? 'rgba(0, 180, 115, 0.95)' : 'rgba(0, 229, 153, 0.85)';
    let glowCol = isLight ? 'rgba(0, 180, 115, 0.25)' : 'rgba(0, 229, 153, 0.3)';

    if (simState.mode === 'harmonic') {
      strokeCol = isLight ? 'rgba(230, 130, 0, 0.95)' : 'rgba(255, 153, 0, 0.85)';
      glowCol = isLight ? 'rgba(230, 130, 0, 0.3)' : 'rgba(255, 153, 0, 0.35)';
    } else if (simState.mode === 'anomaly') {
      strokeCol = isLight ? 'rgba(220, 38, 38, 0.95)' : 'rgba(255, 51, 68, 0.9)';
      glowCol = isLight ? 'rgba(220, 38, 38, 0.35)' : 'rgba(255, 51, 68, 0.4)';
    }

    // Outer Stator Housing (Hexagonal precision casing)
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = Math.cos(a) * 125;
      const y = Math.sin(a) * 75; // Isometric compression
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Bearing Race Ring
    ctx.strokeStyle = 'rgba(0, 102, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 95, 55, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Turbine Blades / Rotor Impeller (12 blades)
    const bladeCount = 12;
    ctx.shadowBlur = 10;
    ctx.shadowColor = glowCol;

    for (let i = 0; i < bladeCount; i++) {
      const bladeAngle = angle + (i * (Math.PI * 2)) / bladeCount;
      const innerX = Math.cos(bladeAngle) * 30;
      const innerY = Math.sin(bladeAngle) * 18;
      const outerX = Math.cos(bladeAngle) * 85;
      const outerY = Math.sin(bladeAngle) * 50;

      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      ctx.stroke();

      // Blade Tip Highlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(outerX, outerY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center Spindle Hub
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0E1424';
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner Core Axle
    ctx.fillStyle = strokeCol;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Particles (Torque & Aero Dynamics)
  function drawParticles(cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    particles.forEach(p => {
      p.x += Math.cos(simState.angle * 2) * p.speed;
      p.y += Math.sin(simState.angle * 2) * (p.speed * 0.6);

      // Boundary loop
      if (Math.hypot(p.x, p.y) > 170) {
        p.x = (Math.random() - 0.5) * 40;
        p.y = (Math.random() - 0.5) * 20;
      }

      ctx.fillStyle = simState.mode === 'anomaly' 
        ? `rgba(255, 51, 68, ${p.alpha * 0.7})` 
        : `rgba(0, 229, 153, ${p.alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Real-Time FFT Waveform Oscilloscope along the bottom
  function drawFftSpectrum(w, h) {
    const isLight = simState.theme === 'light';
    ctx.save();
    const bottomY = h - 25;
    const startX = 20;
    const endX = w - 20;
    const spectrumW = endX - startX;
    const barCount = 48;
    const barStep = spectrumW / barCount;

    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, bottomY);
    ctx.lineTo(endX, bottomY);
    ctx.stroke();

    for (let i = 0; i < barCount; i++) {
      let freqHeight = Math.sin(i * 0.35 + simState.tick * 0.08) * 12 + 14;

      if (simState.mode === 'harmonic') {
        freqHeight += Math.cos(i * 0.7 + simState.tick * 0.15) * 16;
      } else if (simState.mode === 'anomaly') {
        if (i % 4 === 0) freqHeight += Math.random() * 26 + 10; // Jitter spikes
      }

      const barX = startX + i * barStep;
      const barH = Math.max(2, freqHeight);

      ctx.fillStyle = simState.mode === 'anomaly' 
        ? 'rgba(255, 51, 68, 0.7)' 
        : (isLight ? 'rgba(0, 102, 255, 0.75)' : 'rgba(0, 102, 255, 0.6)');
      ctx.fillRect(barX, bottomY - barH, barStep - 2, barH);
    }

    // FFT Label
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('FFT SPECTRUM // 0 - 5.000 Hz', startX, bottomY - 36);

    ctx.restore();
  }

  // Sensor Overlay Nodes
  function drawSensorNodes(cx, cy) {
    const isLight = simState.theme === 'light';
    const nodes = [
      { x: cx - 110, y: cy - 40, label: 'SN-01: AXIAL LAGER' },
      { x: cx + 115, y: cy + 45, label: 'SN-02: STATOR THERMAL' },
      { x: cx, y: cy - 90, label: 'SN-03: SPINDEL-SCHW.' }
    ];

    ctx.save();
    nodes.forEach(node => {
      const pulse = Math.sin(simState.tick * 0.1) * 3;
      let col = simState.mode === 'anomaly' ? '#FF3344' : (isLight ? '#009966' : '#00E599');

      // Ring
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Dot
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Node Tag
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(node.label, node.x + 12, node.y + 3);
    });
    ctx.restore();
  }

  function setTheme(theme) {
    simState.theme = theme;
  }

  // Start Simulation
  requestAnimationFrame(render);

  // Expose setMode and setTheme to window
  window.kraftwerkSim = {
    setMode: setMode,
    setTheme: setTheme,
    getState: () => ({ ...simState })
  };
})();
