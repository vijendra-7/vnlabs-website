/**
 * AEROX MOBILITY // 800V E-POWERTRAIN & BATTERY SIMULATOR
 * High-performance 60 FPS HTML5 Canvas Engine
 * Simulates a high-voltage dual-motor axle with active cell balancing
 */

(function () {
  'use strict';

  const canvas = document.getElementById('powertrainCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // DOM HUD Readout elements
  const hudTorque = document.getElementById('hudTorque');
  const hudPower = document.getElementById('hudPower');
  const hudCellTemp = document.getElementById('hudCellTemp');
  const hudRegen = document.getElementById('hudRegen');
  const quickStatusChip = document.getElementById('quickStatusChip');
  const quickStatusText = document.getElementById('quickStatusText');

  // Control Buttons
  const btnCruise = document.getElementById('btnCruise');
  const btnLaunch = document.getElementById('btnLaunch');
  const btnDerate = document.getElementById('btnDerate');

  let simState = {
    mode: 'cruise', // 'cruise' | 'launch' | 'derate'
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    angle: 0,
    rpm: 14250,
    targetRpm: 14250,
    torque: 420,
    targetTorque: 420,
    power: 180,
    targetPower: 180,
    cellTemp: 32.4,
    targetCellTemp: 32.4,
    regenEff: 94.8,
    targetRegen: 94.8,
    tick: 0,
    derateTimer: null
  };

  // Flux particle vectors
  const fluxParticles = [];
  for (let i = 0; i < 50; i++) {
    fluxParticles.push({
      angle: Math.random() * Math.PI * 2,
      dist: 40 + Math.random() * 80,
      speed: 0.02 + Math.random() * 0.05,
      radius: 1 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.6
    });
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function setMode(mode) {
    simState.mode = mode;

    [btnCruise, btnLaunch, btnDerate].forEach(btn => btn?.classList.remove('active'));

    if (mode === 'cruise') {
      btnCruise?.classList.add('active');
      simState.targetRpm = 14250;
      simState.targetTorque = 420;
      simState.targetPower = 180;
      simState.targetCellTemp = 32.4;
      simState.targetRegen = 94.8;

      if (quickStatusChip) {
        quickStatusChip.className = 'twin-status-chip ok';
        quickStatusText.textContent = getLocalizedText('sim.nominal', 'NOMINALER FAHRMODUS (ECO-CRUISE)');
      }
    } else if (mode === 'launch') {
      btnLaunch?.classList.add('active');
      simState.targetRpm = 20800;
      simState.targetTorque = 950;
      simState.targetPower = 680;
      simState.targetCellTemp = 48.5;
      simState.targetRegen = 91.2;

      if (quickStatusChip) {
        quickStatusChip.className = 'twin-status-chip warn';
        quickStatusText.textContent = getLocalizedText('sim.launch', 'LAUNCH CONTROL AKTIV (PEAK 680 KW)');
      }
    } else if (mode === 'derate') {
      btnDerate?.classList.add('active');
      simState.targetRpm = 8200;
      simState.targetTorque = 210;
      simState.targetPower = 95;
      simState.targetCellTemp = 74.8;
      simState.targetRegen = 65.4;

      if (quickStatusChip) {
        quickStatusChip.className = 'twin-status-chip danger';
        quickStatusText.textContent = getLocalizedText('sim.derate', 'THERMISCHES DERATING (ASIL-D SCHUTZ)');
      }

      clearTimeout(simState.derateTimer);
      simState.derateTimer = setTimeout(() => {
        if (simState.mode === 'derate') {
          setMode('cruise');
        }
      }, 5000);
    }
  }

  function getLocalizedText(key, fallback) {
    if (window.i18n && window.i18n.t) {
      return window.i18n.t(key) || fallback;
    }
    return fallback;
  }

  btnCruise?.addEventListener('click', () => setMode('cruise'));
  btnLaunch?.addEventListener('click', () => setMode('launch'));
  btnDerate?.addEventListener('click', () => setMode('derate'));

  function render() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    simState.tick++;

    // Interpolate metrics
    simState.rpm += (simState.targetRpm - simState.rpm) * 0.05;
    simState.torque += (simState.targetTorque - simState.torque) * 0.05;
    simState.power += (simState.targetPower - simState.power) * 0.05;
    simState.cellTemp += (simState.targetCellTemp - simState.cellTemp) * 0.03;
    simState.regenEff += (simState.targetRegen - simState.regenEff) * 0.05;

    // Small telemetry fluctuations
    const jitter = (Math.random() - 0.5) * 5;
    const displayTorque = Math.round(simState.torque + jitter);
    const displayPower = Math.round(simState.power + (Math.random() - 0.5) * 3);
    const displayTemp = (simState.cellTemp + (Math.random() - 0.5) * 0.1).toFixed(1);

    if (hudTorque) hudTorque.textContent = `${displayTorque} Nm`;
    if (hudPower) hudPower.textContent = `${displayPower} kW`;
    if (hudCellTemp) hudCellTemp.textContent = `${displayTemp} °C`;
    if (hudRegen) {
      const reg = simState.regenEff.toFixed(1);
      hudRegen.textContent = `${reg}% (${simState.mode === 'derate' ? 'GEDROSSELT' : 'EFFIZIENT'})`;
    }

    const rotSpeed = (simState.rpm / 12000) * 0.05;
    simState.angle += rotSpeed;

    const centerX = width / 2;
    const centerY = height / 2 - 12;

    // 1. Aerodynamic Flux Grid
    drawAeroGrid(centerX, centerY, width, height);

    // 2. High-Voltage Dual E-Axle Assembly
    drawPowertrainAxle(centerX, centerY, simState.angle);

    // 3. Magnetic Flux Particles
    drawFluxParticles(centerX, centerY);

    // 4. 800V Battery Cell Voltage Balancer Bar Chart
    drawBatteryCellBalance(width, height);

    requestAnimationFrame(render);
  }

  function drawAeroGrid(cx, cy, w, h) {
    const isLight = simState.theme === 'light';
    ctx.save();
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    // Concentric velocity circles
    [50, 95, 140, 185].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Torque vectors
    ctx.strokeStyle = isLight ? 'rgba(0, 136, 204, 0.25)' : 'rgba(0, 240, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy);
    ctx.lineTo(cx + 200, cy);
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx, cy + 130);
    ctx.stroke();

    ctx.restore();
  }

  function drawPowertrainAxle(cx, cy, angle) {
    const isLight = simState.theme === 'light';
    ctx.save();
    ctx.translate(cx, cy);

    let mainColor = isLight ? '#0088CC' : '#00F0FF';
    let glowColor = isLight ? 'rgba(0, 136, 204, 0.25)' : 'rgba(0, 240, 255, 0.35)';

    if (simState.mode === 'launch') {
      mainColor = '#00E599';
      glowColor = 'rgba(0, 229, 153, 0.35)';
    } else if (simState.mode === 'derate') {
      mainColor = '#FF334B';
      glowColor = 'rgba(255, 51, 75, 0.4)';
    }

    // Outer Motor Stator (Octagonal High-Rigidity Casing)
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const x = Math.cos(a) * 115;
      const y = Math.sin(a) * 75;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Stator Windings (U, V, W phases - 12 copper pole segments)
    const poleCount = 12;
    for (let i = 0; i < poleCount; i++) {
      const a = (i * Math.PI * 2) / poleCount;
      const x1 = Math.cos(a) * 85;
      const y1 = Math.sin(a) * 55;
      const x2 = Math.cos(a) * 105;
      const y2 = Math.sin(a) * 68;

      ctx.strokeStyle = i % 3 === 0 ? mainColor : (isLight ? '#94A3B8' : '#334155');
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // High-Speed Rotor Core with Permanent Magnets
    ctx.shadowBlur = 12;
    ctx.shadowColor = glowColor;
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 65, 42, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Differential Sun Gear & Shaft
    const bladeCount = 8;
    for (let i = 0; i < bladeCount; i++) {
      const bAngle = angle + (i * Math.PI * 2) / bladeCount;
      const bx = Math.cos(bAngle) * 55;
      const by = Math.sin(bAngle) * 35;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }

    // Central Drive Pinion
    ctx.shadowBlur = 0;
    ctx.fillStyle = isLight ? '#E2E8F0' : '#0B0F19';
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawFluxParticles(cx, cy) {
    const isLight = simState.theme === 'light';
    ctx.save();
    ctx.translate(cx, cy);

    fluxParticles.forEach(p => {
      p.angle += p.speed * (simState.mode === 'launch' ? 2.5 : 1);
      const px = Math.cos(p.angle) * p.dist;
      const py = Math.sin(p.angle) * (p.dist * 0.65);

      ctx.fillStyle = simState.mode === 'derate'
        ? `rgba(255, 51, 75, ${p.alpha})`
        : (isLight ? `rgba(0, 136, 204, ${p.alpha * 0.8})` : `rgba(0, 240, 255, ${p.alpha})`);

      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawBatteryCellBalance(w, h) {
    const isLight = simState.theme === 'light';
    ctx.save();
    const bottomY = h - 22;
    const startX = 20;
    const endX = w - 20;
    const spanW = endX - startX;
    const cellCount = 36;
    const step = spanW / cellCount;

    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, bottomY);
    ctx.lineTo(endX, bottomY);
    ctx.stroke();

    for (let i = 0; i < cellCount; i++) {
      let cellHeight = 12 + Math.sin(i * 0.4 + simState.tick * 0.05) * 3;
      if (simState.mode === 'derate') {
        if (i > 18 && i < 24) cellHeight += 12; // Overheating cell group
      }

      const barX = startX + i * step;
      ctx.fillStyle = (simState.mode === 'derate' && i > 18 && i < 24)
        ? '#FF334B'
        : (isLight ? '#0088CC' : '#00F0FF');
      ctx.fillRect(barX, bottomY - cellHeight, step - 2, cellHeight);
    }

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('800V BMS // CELL BALANCING SPREAD: < 4.2 mV (ASIL-D NOMINAL)', startX, bottomY - 34);

    ctx.restore();
  }

  function setTheme(theme) {
    simState.theme = theme;
  }

  requestAnimationFrame(render);

  window.aeroxSim = {
    setMode: setMode,
    setTheme: setTheme,
    getState: () => ({ ...simState })
  };
})();
