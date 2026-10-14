/**
 * AEROX MOBILITY // AUTOMOTIVE CLIENT APPLICATION ENGINE
 * Features:
 * - DE/EN Automotive Bilingual Dictionary
 * - Real-Time WLTP Range & Aerodynamic Drag Calculator
 * - SOME/IP & CAN-FD Bus Protocol Telemetry Viewer
 * - Dark / Light Mode Toggle (Icon Only)
 * - Automotive RFP Evaluator
 */

(function () {
  'use strict';

  // 1. Automotive Bilingual Dictionary
  const translations = {
    de: {
      'nav.powertrain': 'Antriebssimulation',
      'nav.calculator': 'Reichweitenrechner',
      'nav.autosar': 'CAN-FD & AUTOSAR',
      'nav.cases': 'OEM-Referenzen',
      'nav.cta': 'Engineering Evaluation',

      'hero.title': 'Hochvolt-Effizienz & Software-Defined Powertrain <span class="gradient-text">für Premium-Fahrzeuge.</span>',
      'hero.lead': 'AEROX MOBILITY liefert hochintegrierte 800-Volt Siliziumkarbid (SiC) Inverter-Elektronik und AUTOSAR-Adaptive Steuerungsarchitektur für deutsche Premium-Automobilhersteller und Tier-1 Systemlieferanten. ASIL-D zertifiziert und UN ECE R155 konform.',
      'hero.stat1': 'Inverter-Wirkungsgrad',
      'hero.stat2': 'HPC Ladezeit (10-80%)',
      'hero.stat3': 'Torque-Vectoring Latenz',
      'hero.ctaSecondary': 'Antriebs-Simulator starten',
      'hero.ctaCalc': 'WLTP-Reichweite berechnen',

      'sim.nominal': 'NOMINALER FAHRMODUS (ECO-CRUISE)',
      'sim.launch': 'LAUNCH CONTROL AKTIV (PEAK 680 KW)',
      'sim.derate': 'THERMISCHES DERATING (ASIL-D SCHUTZ)',
      'sim.ctrlTitle': 'FAHRDYNA-MODUS WÄHLEN:',
      'sim.modeCruise': '● Autobahn Cruise (130 km/h)',
      'sim.modeLaunch': '▲ Launch Control (Peak 680 kW)',
      'sim.modeDerate': '⚡ Thermisches Derating',

      'standards.label': 'ARCHITECTED FOR GERMAN AUTOMOTIVE STANDARDS:',
      'standards.b1': 'Funktionale Sicherheit',
      'standards.b2': 'Software-Architektur',
      'standards.b3': 'Cybersecurity & OTA',
      'standards.b4': 'Ultra-Fast HPC',
      'standards.b5': 'On-Vehicle Sovereignty',

      'pwt.tag': '// MODUL 01: E-POWERTRAIN & SILICON CARBIDE ARCHITECTURE',
      'pwt.title': 'Maximale Leistungsdichte. <br>Minimaler Schaltverlust durch 800V SiC.',
      'pwt.subtitle': 'Unsere Traktionswechselrichter nutzen modernste Siliziumkarbid-MOSFETs mit Schaltfrequenzen bis zu 40 kHz. Dies reduziert die magnetischen Verluste im Elektromotor um über 45% bei doppelter Leistungsdichte.',
      'pwt.f1Title': '800V SiC Inverter-Topologie',
      'pwt.f1Desc': 'Direktkühlung mit Pin-Fin Bodenplatte aus Kupfer. Bis zu 35 kW/Liter Leistungsdichte bei einem Spitzenwirkungsgrad von 99,1% im WLTP-Zyklus.',
      'pwt.f2Title': 'Sub-Millisekunden Torque Vectoring',
      'pwt.f2Desc': 'Einzelrad-Ansteuerung an der Hinterachse. Erkennt Schlupf und Gierwinkel-Abweichungen innerhalb von 250 Mikrosekunden und stabilisiert ohne mechanischen Bremseingriff.',
      'pwt.f3Title': 'Adaptives Zell-Balancing & Thermal Runaway Guard',
      'pwt.f3Desc': 'Echtzeit-Impedanzspektroskopie überwacht jede einzelne Pouch- und Rundzelle im Batteriepack zur frühzeitigen Verhinderung von Lithium-Plating bei Minustemperaturen.',

      'calc.tag': '// MODUL 02: WLTP-REICHWEITE & ENERGIEEFFIZIENZ',
      'calc.title': 'Fahrwiderstands- & Verbrauchsrechner.',
      'calc.subtitle': 'Simulieren Sie den Einfluss von Batteriekapazität, cw-Wert und Reisegeschwindigkeit auf die reale Autobahn- und WLTP-Reichweite.',
      'calc.labelBattery': 'Batterie-Nettokapazität (NMC / LFP):',
      'calc.labelDrag': 'Aerodynamischer Luftwiderstandsbeiwert (cw-Wert):',
      'calc.labelSpeed': 'Reisegeschwindigkeit (Autobahn-Profil):',
      'calc.footnote': '*Physikalische Modellierung: Stirnfläche A=2,25 m², Rollwiderstandsbeiwert cr=0,008, 800V SiC-Wirkungsgradkennfeld.',
      'calc.resBadge': 'SIMULIERTE FAHRLEISTUNG',
      'calc.mainRange': 'Reale Autobahn-Reichweite:',
      'calc.rangeSub': 'Bei konstanter Reisegeschwindigkeit und Klimatisierung',
      'calc.kpiCons': 'Durchschnittsverbrauch',
      'calc.kpiHpc': '10-80% Ladezeit (HPC 350kW)',
      'calc.kpiWltp': 'Normreichweite (WLTP kombiniert)',
      'calc.kpiRecup': 'Rekuperationsrückgewinnung',
      'calc.cta': 'Automotive Powertrain Spezifikation anfordern',

      'bus.tag': '// MODUL 03: FAHRZEUG-BUS & AUTOSAR ADAPTIVE',
      'bus.title': 'Echtzeit-Bussysteme nach VDA-Standard.',
      'bus.subtitle': 'Volle Integration in moderne E/E-Architekturen. Direkte Schnittstellen für CAN-FD, Automotive Ethernet (1000BASE-T1) und SOME/IP Service-Oriented Middleware.',
      'bus.copy': 'TELEMETRIE KOPIEREN',

      'cases.tag': '// MODUL 04: AUTOMOTIVE PROJEKT-BENCHMARKS',
      'cases.title': 'Validiert auf Nürburgring & Prüfständen.',
      'cases.subtitle': 'Entwickelt in enger Kooperation mit süddeutschen Sportwagen- und Oberklasse-Herstellern.',
      'cases.c1Title': 'Hochdrehzahl-Hinterachs-Inverter (20.000 U/min)',
      'cases.c1Desc': 'Thermische Absicherung für 10 aufeinanderfolgende Beschleunigungsvorgänge von 0 auf 200 km/h ohne thermisches Derating dank fortschrittlicher SiC-Pin-Fin Kühlung.',
      'cases.c1m1': '0-100 km/h Beschleunigung',
      'cases.c1m2': 'Leistungs-Derating',
      'cases.c2Title': 'Flottenweites BMS-Zell-Monitoring über SOME/IP',
      'cases.c2Desc': 'Echtzeit-Erkennung von dendritischem Wachstum in Lithium-Zellen. 100% datenschutzkonforme On-Vehicle Analyse ohne unverschlüsselte Cloud-Übertragung.',
      'cases.c2m1': 'Zell-Lebensdauer (Zyklen)',
      'cases.c2m2': 'DSGVO Fahrzeug-Konformität',
      'cases.c3Title': 'All-In-One E-Achse mit integriertem SiC-Modul',
      'cases.c3Desc': 'Kompakte Koaxial-Integration von Planetengetriebe, E-Maschine und Inverter. Reduktion des Bauraums um 32% gegenüber bisherigen 400V-Serienlösungen.',
      'cases.c3m1': 'Gesamtgewicht E-Achse',
      'cases.c3m2': 'Dauer-Spitzenleistung',

      'rfp.tag': '// MODUL 05: TECHNISCHE EVALUATION & AUSSCHREIBUNG',
      'rfp.title': 'Starten Sie ein Automotive Co-Engineering Projekt.',
      'rfp.subtitle': 'Wir stellen Ihnen ein hardware-in-the-loop (HIL) Testkit für Ihre Prüfstände zur Verfügung. Volle NDA-Absicherung nach VDA-Richtlinien.',
      'rfp.fieldVehicle': 'Fahrzeugsegment / Plattform *',
      'rfp.selectVehicle': 'Bitte Fahrzeugklasse wählen...',
      'rfp.fieldVoltage': 'Spannungsebene & Halbleiter *',
      'rfp.selectVoltage': 'Spannungsarchitektur...',
      'rfp.fieldCompany': 'OEM / Zulieferunternehmen *',
      'rfp.fieldName': 'Lead Powertrain Engineer / Titel *',
      'rfp.fieldEmail': 'Geschäftliche E-Mail-Adresse *',
      'rfp.fieldPhone': 'Telefonnummer (Direktdurchwahl) *',
      'rfp.ndaText': '<strong>VDA-Geheimhaltungsvereinbarung (NDA):</strong> Bitte übermitteln Sie vor dem ersten Datenaustausch den standardisierten bilateralen Geheimhaltungsvertrag.',
      'rfp.dsgvoText': 'Ich willige in die zweckgebundene Verarbeitung meiner Kontaktdaten zur Beantwortung der technischen Anfrage gemäß Art. 6 Abs. 1 lit. a DSGVO ein.',
      'rfp.submitBtn': 'HIL-Prüfstandsevaluation anfragen',
      'rfp.guarantee': 'ANTWORT DURCH AUTOMOTIVE CHIEF ARCHITECT INNERHALB VON 4 WERKSTUNDEN',
      'rfp.successTitle': 'Evaluations-Anfrage erfolgreich erfasst.',
      'rfp.successDesc': 'Vielen Dank. Ihre Vorgangsnummer lautet <strong class="mono-code">AEROX-AUTO-2026-4491</strong>. Unser Principal Automotive Systems Architect wird sich innerhalb von 4 Arbeitsstunden mit den HIL-Spezifikationen und dem VDA-NDA-Entwurf bei Ihnen melden.',

      'footer.desc': 'Interaktives Automotive UI/UX Showcase & Frontend-Architektur — Entwickelt von VN Labs für deutsche Automobilhersteller, E-Mobility Pioniere und Tier-1 Zulieferer.',
      'footer.col1Title': 'Technologie',
      'footer.col2Title': 'VN Labs',
      'footer.col3Title': 'Projekt & Info',
      'footer.impressum': 'Projekt-Info & Impressum',
      'footer.datenschutz': 'Datenschutzerklärung (DSGVO)'
    },
    en: {
      'nav.powertrain': 'Powertrain Sim',
      'nav.calculator': 'Range Calculator',
      'nav.autosar': 'CAN-FD & AUTOSAR',
      'nav.cases': 'OEM Benchmarks',
      'nav.cta': 'Engineering Evaluation',

      'hero.title': 'High-Voltage Efficiency & Software-Defined Powertrain <span class="gradient-text">for Premium Vehicles.</span>',
      'hero.lead': 'AEROX MOBILITY engineers highly integrated 800V Silicon Carbide (SiC) inverters and AUTOSAR Adaptive control architecture for German luxury automotive OEMs and Tier-1 system suppliers. ISO 26262 ASIL-D certified and UN ECE R155 compliant.',
      'hero.stat1': 'Inverter Efficiency',
      'hero.stat2': 'HPC Charge Time (10-80%)',
      'hero.stat3': 'Torque Vectoring Latency',
      'hero.ctaSecondary': 'Launch Powertrain Simulator',
      'hero.ctaCalc': 'Calculate WLTP Range',

      'sim.nominal': 'NOMINAL DRIVING MODE (ECO-CRUISE)',
      'sim.launch': 'LAUNCH CONTROL ENGAGED (PEAK 680 KW)',
      'sim.derate': 'THERMAL DERATING (ASIL-D PROTECTION)',
      'sim.ctrlTitle': 'SELECT DYNAMICS MODE:',
      'sim.modeCruise': '● Autobahn Cruise (130 km/h)',
      'sim.modeLaunch': '▲ Launch Control (Peak 680 kW)',
      'sim.modeDerate': '⚡ Thermal Derating',

      'standards.label': 'ARCHITECTED FOR GERMAN AUTOMOTIVE STANDARDS:',
      'standards.b1': 'Functional Safety',
      'standards.b2': 'Software Architecture',
      'standards.b3': 'Cybersecurity & OTA',
      'standards.b4': 'Ultra-Fast HPC',
      'standards.b5': 'On-Vehicle Sovereignty',

      'pwt.tag': '// MODULE 01: E-POWERTRAIN & SILICON CARBIDE ARCHITECTURE',
      'pwt.title': 'Maximum Power Density. <br>Minimal Switching Losses via 800V SiC.',
      'pwt.subtitle': 'Our traction inverters employ cutting-edge Silicon Carbide MOSFETs operating at switching frequencies up to 40 kHz, reducing motor core iron losses by 45% while doubling volumetric power density.',
      'pwt.f1Title': '800V SiC Inverter Topology',
      'pwt.f1Desc': 'Direct copper pin-fin fluid cooling delivering up to 35 kW/Liter power density and peak efficiency of 99.1% across the WLTP drive cycle.',
      'pwt.f2Title': 'Sub-Millisecond Torque Vectoring',
      'pwt.f2Desc': 'Individual rear-wheel traction control detecting slip and yaw discrepancies within 250 microseconds, stabilizing dynamic behavior without abrasive mechanical braking.',
      'pwt.f3Title': 'Adaptive Cell Balancing & Thermal Guard',
      'pwt.f3Desc': 'Real-time electrochemical impedance spectroscopy inspects each cell in the pack to preemptively prevent lithium plating during freezing fast-charge sessions.',

      'calc.tag': '// MODULE 02: WLTP RANGE & ENERGY CONSUMPTION',
      'calc.title': 'Aerodynamic Drag & Range Simulator.',
      'calc.subtitle': 'Model the precise impact of battery pack capacity, drag coefficient (Cd), and cruising speed on real-world Autobahn and WLTP driving range.',
      'calc.labelBattery': 'Net Battery Capacity (NMC / LFP):',
      'calc.labelDrag': 'Aerodynamic Drag Coefficient (Cd):',
      'calc.labelSpeed': 'Cruising Speed (Autobahn Profile):',
      'calc.footnote': '*Physical parameters: Frontal area A=2.25 m², rolling resistance cr=0.008, 800V SiC thermal efficiency map.',
      'calc.resBadge': 'SIMULATED VEHICLE DYNAMICS',
      'calc.mainRange': 'Real Autobahn Range:',
      'calc.rangeSub': 'At steady cruising speed with climate control active',
      'calc.kpiCons': 'Energy Consumption',
      'calc.kpiHpc': '10-80% HPC Charge Time',
      'calc.kpiWltp': 'Combined WLTP Range',
      'calc.kpiRecup': 'Regenerative Braking Share',
      'calc.cta': 'Request Powertrain Architecture Specs',

      'bus.tag': '// MODULE 03: IN-VEHICLE BUS & AUTOSAR ADAPTIVE',
      'bus.title': 'Real-Time Bus Architecture to VDA Standards.',
      'bus.subtitle': 'Full integration into modern zonal E/E platforms. Native endpoints for CAN-FD, Automotive Ethernet (1000BASE-T1), and SOME/IP service-oriented middleware.',
      'bus.copy': 'COPY TELEMETRY PAYLOAD',

      'cases.tag': '// MODULE 04: AUTOMOTIVE BENCHMARKS',
      'cases.title': 'Validated on Nürburgring & Dynamometers.',
      'cases.subtitle': 'Co-engineered alongside leading southern German sports car and luxury OEM engineering teams.',
      'cases.c1Title': 'High-RPM Rear Axle Inverter (20,000 RPM)',
      'cases.c1Desc': 'Validated for 10 consecutive full-throttle 0-200 km/h launches with zero thermal power derating via direct-cooled SiC pin-fin substrates.',
      'cases.c1m1': '0-100 km/h Acceleration',
      'cases.c1m2': 'Power Derating',
      'cases.c2Title': 'Fleetwide BMS Cell Telemetry over SOME/IP',
      'cases.c2Desc': 'Real-time early detection of microscopic lithium dendrites. 100% GDPR-compliant on-vehicle analytics with zero unencrypted offboard telemetry.',
      'cases.c2m1': 'Cell Cycle Longevity',
      'cases.c2m2': 'In-Vehicle GDPR Parity',
      'cases.c3Title': 'Integrated Coaxial E-Axle with SiC Module',
      'cases.c3Desc': 'Ultra-compact coaxial packaging uniting planetary reduction gear, motor, and inverter with a 32% volume reduction over 400V legacy units.',
      'cases.c3m1': 'Total E-Axle Weight',
      'cases.c3m2': 'Continuous Peak Output',

      'rfp.tag': '// MODULE 05: TECHNICAL EVALUATION & RFP',
      'rfp.title': 'Initiate an Automotive Co-Engineering Program.',
      'rfp.subtitle': 'We provide hardware-in-the-loop (HIL) test appliances and calibration software for your facility. Full bilateral VDA-standard NDA protection.',
      'rfp.fieldVehicle': 'Vehicle Segment / Platform *',
      'rfp.selectVehicle': 'Select vehicle class...',
      'rfp.fieldVoltage': 'Voltage Architecture & Silicon *',
      'rfp.selectVoltage': 'Voltage platform...',
      'rfp.fieldCompany': 'OEM / Supplier Name *',
      'rfp.fieldName': 'Lead Powertrain Engineer / Title *',
      'rfp.fieldEmail': 'Corporate Business Email *',
      'rfp.fieldPhone': 'Direct Phone Line *',
      'rfp.ndaText': '<strong>VDA Confidentiality Agreement (NDA):</strong> Please send the standardized bilateral Non-Disclosure Agreement prior to technical scoping.',
      'rfp.dsgvoText': 'I consent to the processing of my contact information to answer this technical evaluation inquiry in compliance with Art. 6 (1)(a) GDPR.',
      'rfp.submitBtn': 'Request HIL Test Bench Evaluation',
      'rfp.guarantee': 'GUARANTEED RESPONSE BY AN AUTOMOTIVE CHIEF ARCHITECT WITHIN 4 BUSINESS HOURS',
      'rfp.successTitle': 'Evaluation Request Successfully Registered.',
      'rfp.successDesc': 'Thank you. Your reference ID is <strong class="mono-code">AEROX-AUTO-2026-4491</strong>. Our Principal Automotive Systems Architect will contact you within 4 business hours with HIL specs and the mutual VDA-NDA draft.',

      'footer.desc': 'Interactive Automotive UI/UX Showcase & Frontend Architecture — Engineered by VN Labs for German automotive OEMs, E-Mobility pioneers, and Tier-1 suppliers.',
      'footer.col1Title': 'Technology',
      'footer.col2Title': 'VN Labs',
      'footer.col3Title': 'Project & Info',
      'footer.impressum': 'Project Info & Legal Notice',
      'footer.datenschutz': 'Data Privacy Policy (GDPR)'
    }
  };

  let currentLang = localStorage.getItem('aerox_lang') || 'de';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('aerox_lang', lang);

    const langDeBtn = document.getElementById('langDe');
    const langEnBtn = document.getElementById('langEn');

    if (langDeBtn && langEnBtn) {
      langDeBtn.classList.toggle('active', lang === 'de');
      langDeBtn.setAttribute('aria-pressed', lang === 'de');
      langEnBtn.classList.toggle('active', lang === 'en');
      langEnBtn.setAttribute('aria-pressed', lang === 'en');
    }

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    updateCalculator();
  }

  window.i18n = {
    t: (key) => translations[currentLang]?.[key] || key,
    getLang: () => currentLang
  };

  document.getElementById('langDe')?.addEventListener('click', () => applyLanguage('de'));
  document.getElementById('langEn')?.addEventListener('click', () => applyLanguage('en'));

  // 2. Dark / Light Theme Toggle (Icon Only)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  let currentTheme = localStorage.getItem('aerox_theme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('aerox_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (window.aeroxSim && window.aeroxSim.setTheme) {
      window.aeroxSim.setTheme(theme);
    }
  }

  themeToggleBtn?.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // 3. WLTP Range & Aerodynamic Drag Calculator Engine
  const rangeBattery = document.getElementById('rangeBattery');
  const rangeDrag = document.getElementById('rangeDrag');
  const rangeSpeed = document.getElementById('rangeSpeed');

  const displayBattery = document.getElementById('displayBattery');
  const displayDrag = document.getElementById('displayDrag');
  const displaySpeed = document.getElementById('displaySpeed');

  const resRangeKm = document.getElementById('resRangeKm');
  const resConsumption = document.getElementById('resConsumption');
  const resChargeTime = document.getElementById('resChargeTime');
  const resWltpRange = document.getElementById('resWltpRange');
  const resRecupShare = document.getElementById('resRecupShare');

  function updateCalculator() {
    if (!rangeBattery || !rangeDrag || !rangeSpeed) return;

    const batteryKwh = parseInt(rangeBattery.value, 10);
    const dragCoeff = (parseInt(rangeDrag.value, 10) / 100);
    const speedKmH = parseInt(rangeSpeed.value, 10);

    if (displayBattery) displayBattery.textContent = `${batteryKwh} kWh`;
    if (displayDrag) displayDrag.textContent = `cw ${dragCoeff.toFixed(2).replace('.', ',')}`;
    if (displaySpeed) displaySpeed.textContent = `${speedKmH} km/h`;

    // Physics Engine:
    // P_aero = 0.5 * rho * Cd * A * v^3
    // P_roll = cr * m * g * v
    // Base auxiliary consumption = 1.6 kW (HVAC, computing)
    const vMps = speedKmH / 3.6;
    const aeroPowerKw = (0.5 * 1.225 * dragCoeff * 2.25 * Math.pow(vMps, 3)) / 1000;
    const rollPowerKw = (0.008 * 2150 * 9.81 * vMps) / 1000;
    const totalPowerKw = (aeroPowerKw + rollPowerKw + 1.8) / 0.93; // 93% powertrain efficiency

    const consumptionPer100Km = (totalPowerKw / speedKmH) * 100;
    const autobahnRange = (batteryKwh / consumptionPer100Km) * 100;

    // WLTP is standardized combined cycle (~100 km/h average with urban deceleration)
    const wltpConsumption = (13.2 + (dragCoeff - 0.20) * 12.0);
    const wltpRange = (batteryKwh / wltpConsumption) * 100;

    // 800V HPC Charge time 10-80% = (0.7 * batteryKwh) / 280kW avg
    const chargeTimeMin = ((batteryKwh * 0.70) / 265) * 60;

    if (resRangeKm) resRangeKm.textContent = `${Math.round(autobahnRange)} km`;
    if (resConsumption) resConsumption.textContent = `${consumptionPer100Km.toFixed(1).replace('.', ',')} kWh/100km`;
    if (resChargeTime) resChargeTime.textContent = `${chargeTimeMin.toFixed(1).replace('.', ',')} Minuten`;
    if (resWltpRange) resWltpRange.textContent = `${Math.round(wltpRange)} km`;
    if (resRecupShare) {
      const recupPct = Math.max(22.0, (38.0 - (speedKmH * 0.08))).toFixed(1);
      resRecupShare.textContent = `${recupPct.replace('.', ',')} %`;
    }
  }

  [rangeBattery, rangeDrag, rangeSpeed].forEach(el => el?.addEventListener('input', updateCalculator));

  // 4. In-Vehicle Protocol Inspector
  const protoData = {
    someip: {
      path: '/etc/autosar/services/traction_inverter_rear.arxml [SECURITY: SecOC / MAC_AES128]',
      code: `{
  "protocol": "SOME_IP_AUTOMOTIVE_ETHERNET",
  "interface_id": "0x4021",
  "service_instance": "0x0001",
  "method_id": "0x8004_NotifyPowertrainTelemetry",
  "sec_oc_authentication": {
    "freshness_value": 4920412,
    "mac_truncated_64bit": "0xA8F2BC49E10432DA"
  },
  "payload": {
    "timestamp_monotonic_us": 1792019482100,
    "inverter_dc_voltage_volts": 798.4,
    "inverter_dc_current_amps": 225.8,
    "motor_rotor_speed_rpm": 14250,
    "actual_torque_nm": 420.5,
    "stator_winding_temp_celsius": 68.2,
    "sic_junction_temp_celsius": 74.1,
    "torque_vectoring_status": "CLOSED_LOOP_ACTIVE",
    "asil_d_safety_crc": "0x9F42"
  }
}`
    },
    canfd: {
      path: 'CANFD_CH1_PT_FAST [ISO 11898-1:2015 / 8 Mbps / DLC=64]',
      code: `// CAN-FD HIGH-SPEED POWERTRAIN FRAME (ID: 0x140)
Frame: ID=0x140 (Standard 11-bit) DLC=64 Bitrate=8.000.000 bps
Payload Bytes:
[00..07] 04 20 A1 0F 42 18 00 00  // Actual Torque (420.5 Nm) & RPM (14250)
[08..15] 1F 30 08 2A 4A 00 00 00  // DC Voltage 798.4V / Current 225.8A
[16..23] 44 20 00 01 FF 00 12 8A  // Inverter Temp & Gate Driver OK
[24..31] E1 04 9A FC 00 00 00 00  // SecOC MAC (AES-CMAC-64)
Safety Counter: 142 | Checksum: 0x8F (ASIL-D Valid)`
    },
    autosar: {
      path: 'TractionControllerAdaptive.cpp [ara::com / Service-Oriented]',
      code: `#include "ara/com/powertrain_skeleton.h"

void PowertrainController::UpdateTorqueVectoring() {
  auto& telemetry = m_inverterSkeleton.GetTelemetryField();
  
  // Real-time closed-loop torque vectoring (<250μs latency)
  float lateralAccel = m_imuSensor.GetLateralAcceleration();
  float yawRate = m_imuSensor.GetYawRate();
  
  float torqueLeftRear = CalculateOptimumTorque(lateralAccel, yawRate, +1);
  float torqueRightRear = CalculateOptimumTorque(lateralAccel, yawRate, -1);
  
  m_inverterSkeleton.SendTorqueCommands(torqueLeftRear, torqueRightRear);
}`
    },
    uds: {
      path: 'ISO_14229_UDS_Diagnostic_Session [ECU: Inverter_Rear_0x1E]',
      code: `TX -> 0x7E0: 02 10 03 (DiagnosticSessionControl: ExtendedSession)
RX <- 0x7E8: 06 50 03 00 32 01 F4 (PositiveResponse: P2=50ms, P2*=500ms)
TX -> 0x7E0: 03 22 01 4F (ReadDataByIdentifier: SiC_Junction_Thermal_Map)
RX <- 0x7E8: 10 0C 62 01 4F 00 4A 00 4B 00 48 (T1=74°C, T2=75°C, T3=72°C)
Status: ASIL-D Diagnostic Routine Nominal.`
    }
  };

  const protoTabs = document.querySelectorAll('.proto-tab');
  const protoPath = document.getElementById('protoPath');
  const codeViewer = document.getElementById('codeViewer');
  const btnCopyBus = document.getElementById('btnCopyBus');

  protoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      protoTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const k = tab.getAttribute('data-tab');
      if (protoData[k]) {
        if (protoPath) protoPath.textContent = protoData[k].path;
        if (codeViewer) codeViewer.textContent = protoData[k].code;
      }
    });
  });

  btnCopyBus?.addEventListener('click', () => {
    if (codeViewer) {
      navigator.clipboard.writeText(codeViewer.textContent).then(() => {
        const prev = btnCopyBus.textContent;
        btnCopyBus.textContent = currentLang === 'de' ? 'KOPIERT! ✓' : 'COPIED! ✓';
        btnCopyBus.style.color = '#00F0FF';
        setTimeout(() => {
          btnCopyBus.textContent = prev;
          btnCopyBus.style.color = '';
        }, 2000);
      });
    }
  });

  // 5. RFP Form
  const rfpForm = document.getElementById('rfpForm');
  const rfpSuccessBanner = document.getElementById('rfpSuccessBanner');

  rfpForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const company = document.getElementById('rfpCompany')?.value.trim();
    const name = document.getElementById('rfpName')?.value.trim();
    const email = document.getElementById('rfpEmail')?.value.trim();

    if (!company || !name || !email) {
      alert(currentLang === 'de' 
        ? 'Bitte füllen Sie alle mit * gekennzeichneten Pflichtfelder aus.' 
        : 'Please complete all required fields marked with *.');
      return;
    }

    const caseNum = Math.floor(1000 + Math.random() * 9000);
    const refCaseId = document.getElementById('refCaseId');
    if (refCaseId) refCaseId.textContent = `AEROX-AUTO-2026-${caseNum}`;

    rfpForm.style.display = 'none';
    if (rfpSuccessBanner) {
      rfpSuccessBanner.style.display = 'flex';
      rfpSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // 6. Modals
  const impressumModal = document.getElementById('impressumModal');
  const datenschutzModal = document.getElementById('datenschutzModal');

  const btnOpenImpressum = document.getElementById('btnOpenImpressum');
  const btnCloseImpressum = document.getElementById('btnCloseImpressum');
  const btnDismissImpressum = document.getElementById('btnDismissImpressum');

  const btnOpenDatenschutz = document.getElementById('btnOpenDatenschutz');
  const btnCloseDatenschutz = document.getElementById('btnCloseDatenschutz');
  const btnDismissDatenschutz = document.getElementById('btnDismissDatenschutz');

  function openModal(m) {
    if (m) {
      m.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(m) {
    if (m) {
      m.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  btnOpenImpressum?.addEventListener('click', () => openModal(impressumModal));
  btnCloseImpressum?.addEventListener('click', () => closeModal(impressumModal));
  btnDismissImpressum?.addEventListener('click', () => closeModal(impressumModal));

  btnOpenDatenschutz?.addEventListener('click', () => openModal(datenschutzModal));
  btnCloseDatenschutz?.addEventListener('click', () => closeModal(datenschutzModal));
  btnDismissDatenschutz?.addEventListener('click', () => closeModal(datenschutzModal));

  [impressumModal, datenschutzModal].forEach(m => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(impressumModal);
      closeModal(datenschutzModal);
    }
  });

  // 7. Initialization
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  updateCalculator();

})();
