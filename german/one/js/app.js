/**
 * KRAFTWERK DYNAMICS // ENTERPRISE APPLICATION LOGIC
 * Features:
 * - Full DE/EN Bilingual Localization Dictionary
 * - Interactive OEE & Amortisationsrechner (ROI Engine)
 * - Industrial Protocol Code Inspector & Clipboard Exporter
 * - Enterprise RFP Configurator with Validation & Case Reference
 * - German Legal Compliance Modals (Impressum § 5 TMG & DSGVO)
 * - Cookie Consent Manager (TTDSG compliant)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Bilingual Localization Dictionary (Deutsch & English)
  // ==========================================================================
  const translations = {
    de: {
      'status.telemetry': 'SYSTEM-STATUS: NORMALBETRIEB (99.985% VERFÜGBARKEIT)',
      'status.location': 'SERVERSTANDORT: FRANKFURT AM MAIN (SOVEREIGN EU REGION)',
      'nav.twin': 'Digitaler Zwilling',
      'nav.architecture': 'Technologie',
      'nav.calculator': 'OEE-Kalkulator',
      'nav.interop': 'Schnittstellen',
      'nav.cases': 'Referenzen',
      'nav.cta': 'Pilotprojekt anfragen',

      'hero.title': 'Autonome Industrie-KI für maximale <span class="gradient-text">Gesamtanlageneffektivität.</span>',
      'hero.lead': 'KRAFTWERK DYNAMICS vernetzt Maschinenparks mit Millisekunden-Edge-Intelligenz. Entwickelt für die hohen Anforderungen des deutschen Maschinenbaus, Automotive Tier-1 und DAX-40 Konzerne. 100% DSGVO-konform, On-Premises & BSI-zertifiziert.',
      'hero.stat1': 'Ø OEE-Steigerung',
      'hero.stat2': 'Ungeplante Stillstände',
      'hero.stat3': 'Echtzeit-Edge Latenz',
      'hero.ctaSecondary': 'Digitalen Zwilling testen',
      'hero.ctaCalc': 'Wirtschaftlichkeit berechnen',

      'twin.nominal': 'NOMINALER ZUSTAND',
      'twin.harmonic': 'LASTWECHSEL / STRESS',
      'twin.anomaly': 'LAGER-SCHADEN SIMULIERT (NOTFALL)',
      'twin.stabilized': 'KI-INTERVENTION ERFOLGREICH (STABILISIERT)',
      'twin.ctrlTitle': 'ECHTZEIT-SIMULATOR STEUERUNG:',
      'twin.modeNominal': '● Normalbetrieb',
      'twin.modeHarmonic': '▲ Lastwechsel (Stress)',
      'twin.modeAnomaly': '⚡ Anomalie injizieren',

      'trust.label': 'ARCHITEKTUR FÜR DEUTSCHE INDUSTRIE-STANDARDS:',
      'trust.b1': 'Qualitätsprinzipien',
      'trust.b2': 'Sicherheitsarchitektur',
      'trust.b3': 'Automotive Standard',
      'trust.b4': 'Datensouveränität',
      'trust.b5': 'Bauhaus & Rams Rigor',

      'twin.sectionTag': '// MODUL 01: DIGITAL TWIN TELEMETRY',
      'twin.sectionTitle': 'Sub-Millisekunden Vorhersage. <br>Null Toleranz für ungeplante Stillstände.',
      'twin.sectionSubtitle': 'Unsere cyber-physikalischen Modelle synchronisieren reale Spindel-, Hydraulik- und Antriebsdaten im Takt von 1.000 Hz. Physikalisch basierte KI erkennt Ermüdungsrisiken 72 Stunden vor dem Bauteilversagen.',
      'twin.f1Title': 'FFT-Schwingungsanalyse',
      'twin.f1Desc': 'Spektrale Fourier-Transformation extrahiert mikrofeine Harmonische aus Wälzlagern und Getriebestufen – unempfindlich gegenüber Umgebungsrauschen.',
      'twin.f2Title': 'Autonome Regelkreis-Korrektur',
      'twin.f2Desc': 'Echtzeit-Rückkopplung an die CNC-Steuerung (Siemens Sinumerik / Heidenhain). Vorschubgeschwindigkeiten werden dynamisch angepasst, um Werkzeugbrüche zu verhindern.',
      'twin.f3Title': 'Lokale Air-Gapped Ausführung',
      'twin.f3Desc': 'Kein Datenabfluss an externe Cloud-Anbieter. Das Inferenz-Modell läuft autark auf industriellen Edge-Servern (DIN-Rail Industrie-PC im Schaltschrank).',

      'calc.tag': '// MODUL 02: WIRTSCHAFTLICHKEIT & OEE-KALKULATOR',
      'calc.title': 'Präzise Zahlen für Ihren Business Case.',
      'calc.subtitle': 'Deutsche Finanzvorstände und Werksleiter verlangen belastbare Amortisationszeiträume. Berechnen Sie das Einsparpotenzial für Ihren konkreten Maschinenpark in Echtzeit.',
      'calc.labelMachines': 'Anzahl vernetzter Produktionsanlagen:',
      'calc.labelCost': 'Stillstandskosten pro Stunde (inkl. Rüst- & Personalausfall):',
      'calc.labelOee': 'Aktuelle Gesamtanlageneffektivität (OEE):',
      'calc.footnote': '*Berechnungsgrundlage: 220 Produktionstage/Jahr, 3-Schicht-Betrieb, empirischer VDMA-Referenzwert für vorausschauende Wartung.',
      'calc.resBadge': 'PROGNOSTIZIERTE WIRTSCHAFTLICHKEIT',
      'calc.annualSavings': 'Jährliches Einsparpotenzial:',
      'calc.savingSub': 'Netto-Gewinnsteigerung pro Kalenderjahr',
      'calc.kpiHours': 'Verhinderte Stillstandszeit',
      'calc.kpiPayback': 'Amortisationszeit (ROI)',
      'calc.kpiNewOee': 'Prognostizierter OEE-Zielwert',
      'calc.kpiCo2': 'CO₂-Äquivalent Reduktion',
      'calc.cta': 'Vollständigen Business Case anfordern',

      'interop.tag': '// MODUL 03: INDUSTRIE-STANDARDS & SCHNITTSTELLEN',
      'interop.title': 'Nahtlose Integration in deutsche Bestandsanlagen.',
      'interop.subtitle': 'Kein Vendor-Lock-in. Volle Kompatibilität mit etablierten speicherprogrammierbaren Steuerungen (SPS) und ERP-Systemen nach VDMA-Spezifikation.',
      'interop.copy': 'DATENSATZ KOPIEREN',

      'cases.tag': '// MODUL 04: DEUTSCHE INDUSTRIE-REFERENZEN',
      'cases.title': 'Eingesetzt in kritischen Fertigungslinien.',
      'cases.subtitle': 'Vom baden-württembergischen Sondermaschinenbau bis zum bayerischen Automotive-OEM – fundierte Projekterfolge mit messbaren Ergebnissen.',
      'cases.c1Title': 'Hochpräzisions-Getriebefertigung für E-Mobilität',
      'cases.c1Desc': 'Einsatz auf 34 kontinuierlichen Schleif- und Verzahnungszentren. Beseitigung von Resonanzschwingungen im Mikrometerbereich bei 18.000 U/min.',
      'cases.c1m1': 'Ausschussfreie Charge',
      'cases.c1m2': 'Werkzeugkosteneinsparung / Jahr',
      'cases.c2Title': 'Autonome Zustandsüberwachung für 5-Achs-Portalfräsen',
      'cases.c2Desc': 'Vollständige Integration in bestehende Siemens 840D Solution Line Steuerungen ohne SPS-Code-Modifikation über passive High-Speed-Stromwandler.',
      'cases.c2m1': 'Frühere Defekterkennung',
      'cases.c2m2': 'Vollständiger ROI',
      'cases.c3Title': 'ATEX-Zertifizierte Pumpen- und Verdichter-Diagnostik',
      'cases.c3Desc': '100% On-Premises Air-Gapped Lösung in explosionsgefährdeten Zonen 1 & 2. Vollständige Einhaltung aller Vorgaben des Bundesamts für Sicherheit in der Informationstechnik (BSI).',
      'cases.c3m1': 'Sicherheitsrelevante Vorfälle',
      'cases.c3m2': 'Datensouveränität (On-Prem)',

      'rfp.tag': '// MODUL 05: PILOTPROJEKT & AUSSCHREIBUNG',
      'rfp.title': 'Starten Sie ein risikofreies 60-Tage Pilotprojekt.',
      'rfp.subtitle': 'Wir installieren das Edge-System an bis zu 3 Produktionsanlagen in Ihrem Werk. Volle NDA-Absicherung (Geheimhaltungsvereinbarung) vor jedem Datenaustausch.',
      'rfp.fieldSector': 'Branche / Industriesektor *',
      'rfp.selectPlaceholder': 'Bitte Branche auswählen...',
      'rfp.fieldPlant': 'Maschinenpark-Größe *',
      'rfp.selectPlantPlaceholder': 'Anzahl der Anlagen...',
      'rfp.fieldCompany': 'Unternehmen / Konzern *',
      'rfp.fieldName': 'Ansprechpartner / Position *',
      'rfp.fieldEmail': 'Geschäftliche E-Mail-Adresse *',
      'rfp.fieldPhone': 'Telefonnummer (Direktwahl) *',
      'rfp.ndaText': '<strong>NDA / Geheimhaltungsvereinbarung:</strong> Ich wünsche vorab die automatische Zusendung einer bilateralen Geheimhaltungsvereinbarung nach deutschem Recht.',
      'rfp.dsgvoText': 'Ich habe die <strong>Datenschutzerklärung</strong> zur Kenntnis genommen und willige in die zweckgebundene Verarbeitung meiner Kontaktdaten gemäß Art. 6 Abs. 1 lit. a DSGVO ein.',
      'rfp.submitBtn': 'Technisches Pilotprojekt anfragen',
      'rfp.guarantee': 'ANTWORT DURCH SENIOR INDUSTRIAL ARCHITECT INNERHALB VON 4 WERKSTUNDEN',
      'rfp.successTitle': 'Pilotprojekt-Anfrage erfolgreich erfasst.',
      'rfp.successDesc': 'Vielen Dank. Ihre Vorgangsnummer lautet <strong class="mono-code">KW-2026-DE-8921</strong>. Ihr zuständiger Principal Solutions Engineer wird sich innerhalb von 4 Arbeitsstunden mit dem abgestimmten NDA-Entwurf und dem Termin für die technische Machbarkeitsprüfung bei Ihnen melden.',

      'footer.desc': 'Interaktives Industrie-UI/UX Showcase & High-Performance Frontend — Entwickelt von VN Labs für deutsche Maschinenbau- und Industrieunternehmen.',
      'footer.col1Title': 'Technologie',
      'footer.col2Title': 'VN Labs',
      'footer.col3Title': 'Projekt & Info',
      'footer.impressum': 'Projekt-Info & Impressum',
      'footer.datenschutz': 'Datenschutzerklärung (DSGVO)',
      'footer.cookies': 'Privatsphäre-Einstellungen',

      'cookie.title': 'Datenschutz & Essenzielle Cookies nach TTDSG / DSGVO:',
      'cookie.desc': 'Wir setzen ausschließlich technisch notwendige Session-Cookies zur Bereitstellung der interaktiven Telemetrie-Simulation und Sprachauswahl ein. Es erfolgt kein Tracking und kein Profiling.',
      'cookie.essential': 'Nur Essenzielle',
      'cookie.accept': 'Alle Bestätigen'
    },
    en: {
      'status.telemetry': 'SYSTEM STATUS: NOMINAL OPERATION (99.985% AVAILABILITY)',
      'status.location': 'SERVER LOCATION: FRANKFURT AM MAIN (SOVEREIGN EU REGION)',
      'nav.twin': 'Digital Twin',
      'nav.architecture': 'Technology',
      'nav.calculator': 'OEE Calculator',
      'nav.interop': 'Interfaces',
      'nav.cases': 'Case Studies',
      'nav.cta': 'Request Pilot Project',

      'hero.title': 'Autonomous Industrial AI for Maximum <span class="gradient-text">Overall Equipment Effectiveness.</span>',
      'hero.lead': 'KRAFTWERK DYNAMICS connects machine fleets with millisecond edge intelligence. Built for the rigorous demands of German mechanical engineering, Automotive Tier-1 suppliers, and DAX-40 titans. 100% GDPR compliant, On-Premises & BSI certified.',
      'hero.stat1': 'Avg. OEE Increase',
      'hero.stat2': 'Unplanned Downtime',
      'hero.stat3': 'Real-Time Edge Latency',
      'hero.ctaSecondary': 'Test Digital Twin',
      'hero.ctaCalc': 'Calculate Business Case',

      'twin.nominal': 'NOMINAL CONDITION',
      'twin.harmonic': 'DYNAMIC LOAD SHIFT / STRESS',
      'twin.anomaly': 'BEARING FAULT SIMULATION (CRITICAL)',
      'twin.stabilized': 'AI INTERVENTION SUCCESSFUL (STABILIZED)',
      'twin.ctrlTitle': 'REAL-TIME SIMULATION CONTROLS:',
      'twin.modeNominal': '● Nominal Operation',
      'twin.modeHarmonic': '▲ Load Shift (Stress)',
      'twin.modeAnomaly': '⚡ Inject Anomaly',

      'trust.label': 'ARCHITECTED FOR GERMAN INDUSTRIAL STANDARDS:',
      'trust.b1': 'Quality Principles',
      'trust.b2': 'Security Architecture',
      'trust.b3': 'Automotive Standard',
      'trust.b4': 'Sovereign EU Data Privacy',
      'trust.b5': 'Bauhaus & Rams Rigor',

      'twin.sectionTag': '// MODULE 01: DIGITAL TWIN TELEMETRY',
      'twin.sectionTitle': 'Sub-Millisecond Prediction. <br>Zero Tolerance for Unplanned Downtime.',
      'twin.sectionSubtitle': 'Our cyber-physical models synchronize physical spindle, hydraulic, and drive telemetry at 1,000 Hz. Physics-informed AI detects fatigue risks 72 hours before component failure.',
      'twin.f1Title': 'FFT Vibration Harmonics',
      'twin.f1Desc': 'Fourier spectral decomposition isolates micro-harmonics in rolling bearings and planetary gearboxes – immune to ambient plant floor noise.',
      'twin.f2Title': 'Autonomous Closed-Loop Control',
      'twin.f2Desc': 'Real-time feedback loop to CNC controllers (Siemens Sinumerik / Heidenhain). Feed rates adapt autonomously to avert tool fracture.',
      'twin.f3Title': 'Air-Gapped Edge Execution',
      'twin.f3Desc': 'Zero telemetry leakage to foreign cloud vendors. Models execute autonomously on industrial DIN-rail IPCs inside your electrical cabinet.',

      'calc.tag': '// MODULE 02: BUSINESS CASE & OEE CALCULATOR',
      'calc.title': 'Definitive Metrics for Your Executive Board.',
      'calc.subtitle': 'German CFOs and plant directors demand resilient payback timelines. Calculate the verified savings potential for your specific machine fleet in real time.',
      'calc.labelMachines': 'Number of Connected Production Lines:',
      'calc.labelCost': 'Downtime Cost per Hour (incl. setup & idle labor):',
      'calc.labelOee': 'Current Overall Equipment Effectiveness (OEE):',
      'calc.footnote': '*Calculation baseline: 220 production days/year, 3-shift operation, empirical VDMA predictive maintenance benchmark.',
      'calc.resBadge': 'PROJECTED FINANCIAL EFFICIENCY',
      'calc.annualSavings': 'Annual Cost Savings Potential:',
      'calc.savingSub': 'Net bottom-line increase per calendar year',
      'calc.kpiHours': 'Averted Downtime Hours',
      'calc.kpiPayback': 'Payback Period (ROI)',
      'calc.kpiNewOee': 'Projected Target OEE',
      'calc.kpiCo2': 'CO₂-Equivalent Reduction',
      'calc.cta': 'Request Complete Business Case',

      'interop.tag': '// MODULE 03: INDUSTRIAL STANDARDS & INTEROPERABILITY',
      'interop.title': 'Seamless Integration into Existing German Plant Infrastructure.',
      'interop.subtitle': 'Zero vendor lock-in. Full protocol parity with established PLCs and ERP backends conforming to VDMA and DIN specifications.',
      'interop.copy': 'COPY TELEMETRY PAYLOAD',

      'cases.tag': '// MODULE 04: GERMAN INDUSTRIAL BENCHMARKS',
      'cases.title': 'Proven in Mission-Critical Production Lines.',
      'cases.subtitle': 'From Baden-Württemberg precision machine builders to Bavarian automotive OEMs – verifiable project outcomes backed by hard metrics.',
      'cases.c1Title': 'High-Precision Gear Production for E-Mobility',
      'cases.c1Desc': 'Deployed across 34 continuous gear-hobbing and grinding cells. Eliminates micrometer-level resonance vibrations at 18,000 RPM.',
      'cases.c1m1': 'Scrap-Free Production Batch',
      'cases.c1m2': 'Tooling Cost Savings / Year',
      'cases.c2Title': 'Autonomous Condition Monitoring for 5-Axis Portal Mills',
      'cases.c2Desc': 'Non-invasive retrofit onto existing Siemens 840D Solution Line controllers with zero PLC code alteration via passive inductive sensors.',
      'cases.c2m1': 'Earlier Defect Identification',
      'cases.c2m2': 'Full Capital ROI',
      'cases.c3Title': 'ATEX-Certified Compressor & Pump Diagnostics',
      'cases.c3Desc': '100% On-Premises Air-Gapped deployment in explosion-hazard Zones 1 & 2. Full adherence to Federal Office for Information Security (BSI) directives.',
      'cases.c3m1': 'Safety-Critical Incidents',
      'cases.c3m2': 'Data Sovereignty (On-Prem)',

      'rfp.tag': '// MODULE 05: PILOT PROJECT & RFP CONFIGURATOR',
      'rfp.title': 'Launch a Risk-Free 60-Day Pilot Project.',
      'rfp.subtitle': 'We deploy our edge appliance on up to 3 machines in your facility. Full bilateral NDA coverage under German jurisdiction prior to any data transfer.',
      'rfp.fieldSector': 'Industry Sector *',
      'rfp.selectPlaceholder': 'Select your industry...',
      'rfp.fieldPlant': 'Machine Fleet Scale *',
      'rfp.selectPlantPlaceholder': 'Number of lines...',
      'rfp.fieldCompany': 'Company / Corporate Group *',
      'rfp.fieldName': 'Contact Executive / Title *',
      'rfp.fieldEmail': 'Corporate Business Email *',
      'rfp.fieldPhone': 'Direct Phone Line *',
      'rfp.ndaText': '<strong>NDA / Confidentiality Agreement:</strong> Please send a mutual bilateral Non-Disclosure Agreement under German law prior to technical onboarding.',
      'rfp.dsgvoText': 'I have reviewed the <strong>Privacy Policy</strong> and consent to the purpose-bound processing of my business data in accordance with Art. 6 (1)(a) GDPR.',
      'rfp.submitBtn': 'Request Technical Pilot Project',
      'rfp.guarantee': 'RESPONSE GUARANTEED BY A SENIOR INDUSTRIAL ARCHITECT WITHIN 4 BUSINESS HOURS',
      'rfp.successTitle': 'Pilot Project Request Successfully Registered.',
      'rfp.successDesc': 'Thank you. Your reference ID is <strong class="mono-code">KW-2026-DE-8921</strong>. Your assigned Principal Solutions Engineer will contact you within 4 business hours with the bilateral NDA draft and technical scoping scheduling.',

      'footer.desc': 'Interactive Industrial UI/UX Showcase & High-Performance Frontend — Engineered by VN Labs for German engineering and tech leaders.',
      'footer.col1Title': 'Technology',
      'footer.col2Title': 'VN Labs',
      'footer.col3Title': 'Project & Info',
      'footer.impressum': 'Project Info & Legal Notice',
      'footer.datenschutz': 'Data Privacy Policy (GDPR)',
      'footer.cookies': 'Privacy Preferences',

      'cookie.title': 'Data Privacy & Essential Cookies (TTDSG / GDPR):',
      'cookie.desc': 'We only employ strictly necessary session cookies to operate the interactive telemetry simulation and remember language preferences. Zero third-party trackers or profiling.',
      'cookie.essential': 'Essential Only',
      'cookie.accept': 'Accept All'
    }
  };

  let currentLang = localStorage.getItem('kraftwerk_lang') || 'de';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('kraftwerk_lang', lang);

    const langDeBtn = document.getElementById('langDe');
    const langEnBtn = document.getElementById('langEn');

    if (langDeBtn && langEnBtn) {
      langDeBtn.classList.toggle('active', lang === 'de');
      langDeBtn.setAttribute('aria-pressed', lang === 'de');
      langEnBtn.classList.toggle('active', lang === 'en');
      langEnBtn.setAttribute('aria-pressed', lang === 'en');
    }

    document.documentElement.lang = lang;

    // Translate all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Update calculator metrics formatting
    updateCalculator();
  }

  // Public i18n access
  window.i18n = {
    t: (key) => translations[currentLang]?.[key] || key,
    getLang: () => currentLang
  };

  // Bind Language Buttons
  document.getElementById('langDe')?.addEventListener('click', () => applyLanguage('de'));
  document.getElementById('langEn')?.addEventListener('click', () => applyLanguage('en'));

  // ==========================================================================
  // 2. Interactive OEE & Amortisations-Rechner (ROI Math Engine)
  // ==========================================================================
  const rangeMachines = document.getElementById('rangeMachines');
  const rangeCost = document.getElementById('rangeCost');
  const rangeOee = document.getElementById('rangeOee');

  const displayMachines = document.getElementById('displayMachines');
  const displayCost = document.getElementById('displayCost');
  const displayOee = document.getElementById('displayOee');

  const resAnnualSavings = document.getElementById('resAnnualSavings');
  const resPreventedHours = document.getElementById('resPreventedHours');
  const resPaybackMonths = document.getElementById('resPaybackMonths');
  const resProjectedOee = document.getElementById('resProjectedOee');
  const resCo2Saving = document.getElementById('resCo2Saving');

  function updateCalculator() {
    if (!rangeMachines || !rangeCost || !rangeOee) return;

    const machines = parseInt(rangeMachines.value, 10);
    const costPerHour = parseInt(rangeCost.value, 10);
    const currentOee = parseInt(rangeOee.value, 10);

    // Update Slider Readout Labels
    if (displayMachines) {
      displayMachines.textContent = currentLang === 'de' 
        ? `${machines} ${machines === 1 ? 'Anlage' : 'Anlagen'}` 
        : `${machines} ${machines === 1 ? 'Line' : 'Lines'}`;
    }

    if (displayCost) {
      displayCost.textContent = currentLang === 'de'
        ? `${costPerHour.toLocaleString('de-DE')} € / Std.`
        : `€${costPerHour.toLocaleString('en-US')} / hr`;
    }

    if (displayOee) {
      displayOee.textContent = `${currentOee} %`;
    }

    // Mathematical Model:
    // Production hours per year = 220 days * 24 hours = 5,280 hours
    // Unplanned downtime rate inversely related to OEE:
    // At 68% OEE, downtime is approx 7.5% of total time = ~396 hrs / machine / yr
    const downtimeFraction = (100 - currentOee) * 0.0035;
    const totalDowntimeHours = 5280 * downtimeFraction;
    
    // KRAFTWERK Predictive Edge-AI prevents 42.8% of these micro-stoppages and tool crashes
    const preventedHoursPerMachine = totalDowntimeHours * 0.428;
    const totalPreventedHours = preventedHoursPerMachine * machines;

    // Annual Gross Savings in Euros
    const grossSavings = totalPreventedHours * costPerHour;

    // Projected OEE Improvement (typical empirical curve: +7% to +13%)
    const oeeDelta = ((95 - currentOee) * 0.35);
    const projectedOeeVal = Math.min(94.5, currentOee + oeeDelta);

    // Amortization (ROI) in Months:
    // Estimated implementation + appliance cost per machine = €14,000 + €25,000 base integration
    const systemCost = 25000 + (machines * 7800);
    const paybackMonths = Math.max(1.8, Math.min(18.0, (systemCost / (grossSavings / 12))));

    // CO2 Reduction (0.38 tons of CO2 per prevented industrial downtime hour)
    const co2Tons = totalPreventedHours * 0.38;

    // Render formatted results
    if (resAnnualSavings) {
      resAnnualSavings.textContent = currentLang === 'de'
        ? `${Math.round(grossSavings).toLocaleString('de-DE')} €`
        : `€${Math.round(grossSavings).toLocaleString('en-US')}`;
    }

    if (resPreventedHours) {
      resPreventedHours.textContent = currentLang === 'de'
        ? `${totalPreventedHours.toFixed(1).replace('.', ',')} Std./Jahr`
        : `${totalPreventedHours.toFixed(1)} hrs/yr`;
    }

    if (resPaybackMonths) {
      resPaybackMonths.textContent = currentLang === 'de'
        ? `${paybackMonths.toFixed(1).replace('.', ',')} Monate`
        : `${paybackMonths.toFixed(1)} Months`;
    }

    if (resProjectedOee) {
      const deltaFormatted = oeeDelta.toFixed(1).replace('.', ',');
      resProjectedOee.textContent = `${projectedOeeVal.toFixed(1).replace('.', ',')} % (+${deltaFormatted}%)`;
    }

    if (resCo2Saving) {
      resCo2Saving.textContent = currentLang === 'de'
        ? `${co2Tons.toFixed(1).replace('.', ',')} Tonnen`
        : `${co2Tons.toFixed(1)} Metric Tons`;
    }
  }

  // Bind Calculator Listeners
  [rangeMachines, rangeCost, rangeOee].forEach(input => {
    input?.addEventListener('input', updateCalculator);
  });

  // ==========================================================================
  // 3. Protocol & Telemetry Code Inspector
  // ==========================================================================
  const protocolData = {
    opcua: {
      path: '/etc/kraftwerk/adapters/opc_ua_server.conf [SECURITY: Basic256Sha256 / SignAndEncrypt]',
      code: `{
  "protocol": "OPC_UA_IEC_62541",
  "endpoint": "opc.tcp://edge-gw-01.de.kraftwerk.local:4840",
  "security_policy": "http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256",
  "message_security_mode": "SignAndEncrypt",
  "server_certificate": "SHA256:7B:A2:99:E1:9F:B4:German_Trust_Anchor",
  "telemetry_stream": {
    "timestamp_iso8601": "2026-10-14T19:42:01.482+02:00",
    "spindle_node_ns": "ns=2;s=Spindle.Drive.ActualSpeed",
    "spindle_speed_rpm": 12480.4,
    "bearing_vibration_rms_mms": 0.421,
    "thermal_sensor_celsius": 48.6,
    "health_index": 0.9984,
    "bsi_audit_signature": "SIG_ED25519_OK"
  }
}`
    },
    siemens: {
      path: 'DB100_KW_TELEMETRY.scl [TIA Portal V19 / S7-1500 PN/IE Direct]',
      code: `// SIEMENS S7-1500 / SINUMERIK ONE DIRECT MEMORY BLOCK
DATA_BLOCK "DB_Kraftwerk_Telemetry"
{ S7_Optimized_Access := 'TRUE' }
VERSION : 0.1
NON_RETAIN
  VAR
    Header_CycleTimestamp : LDT;          // Synchronized via Profinet IRT
    Spindle_Actual_Speed  : Real;         // Address DB100.DBD0 (12480.0 RPM)
    Vibration_RMS_Axial   : Real;         // Address DB100.DBD4 (0.42 mm/s)
    Motor_Current_PhaseU  : Real;         // 48.2 Ampere
    AI_Intervention_Lock  : Bool;         // Edge Feedback Override
    DSGVO_Compliance_Hash : DWord;        // 16#A4F190BC
  END_VAR
BEGIN
  Spindle_Actual_Speed  := 12480.4;
  Vibration_RMS_Axial   := 0.421;
  AI_Intervention_Lock  := FALSE;
END_DATA_BLOCK`
    },
    beckhoff: {
      path: 'Tc3_Kraftwerk_Adapter.plcproj [TwinCAT 3 ADS / EtherCAT 100μs]',
      code: `PROGRAM MAIN_Kraftwerk_ADS
VAR
  fbAdsRead : ADSREAD;
  stDriveTelemetry : ST_SpindleTelemetry;
  bExecute : BOOL := TRUE;
  nErrId : UDINT;
END_VAR

// Cycled at 1 kHz task time for sub-millisecond edge AI inference
stDriveTelemetry.fTorqueActual := 34.8; (* Nm *)
stDriveTelemetry.fVibePeakPeak := 1.12; (* μm *)
stDriveTelemetry.bThermalAlarm := FALSE;

IF stDriveTelemetry.fVibePeakPeak > 4.5 THEN
  // Autonomous Feed Rate Damping Triggered
  GVL_CNC.fFeedOverridePct := 85.0;
END_IF;`
    },
    mqtt: {
      path: 'spBv1.0/DE_FACTORY_01/DDATA/CNC_CELL_04 [Sparkplug B Payload]',
      code: `{
  "timestamp": 1791988921000,
  "metrics": [
    { "name": "Spindle/RPM", "type": "Float", "value": 12480.4 },
    { "name": "Vibration/RMS", "type": "Float", "value": 0.421 },
    { "name": "Bearings/MTBF_Hours", "type": "UInt32", "value": 8420 },
    { "name": "Security/TISAX_Token", "type": "String", "value": "T3_AUTH_VALID" },
    { "name": "Edge/AutonomousActive", "type": "Boolean", "value": true }
  ],
  "seq": 14920
}`
    }
  };

  const protoTabs = document.querySelectorAll('.proto-tab');
  const protoPath = document.getElementById('protoPath');
  const codeViewer = document.getElementById('codeViewer');
  const btnCopyTelemetry = document.getElementById('btnCopyTelemetry');

  protoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      protoTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const tabKey = tab.getAttribute('data-tab');
      if (protocolData[tabKey]) {
        if (protoPath) protoPath.textContent = protocolData[tabKey].path;
        if (codeViewer) codeViewer.textContent = protocolData[tabKey].code;
      }
    });
  });

  // Copy to Clipboard
  btnCopyTelemetry?.addEventListener('click', () => {
    if (codeViewer) {
      navigator.clipboard.writeText(codeViewer.textContent).then(() => {
        const originalText = btnCopyTelemetry.textContent;
        btnCopyTelemetry.textContent = currentLang === 'de' ? 'KOPIERT! ✓' : 'COPIED! ✓';
        btnCopyTelemetry.style.color = '#00E599';
        setTimeout(() => {
          btnCopyTelemetry.textContent = originalText;
          btnCopyTelemetry.style.color = '';
        }, 2200);
      });
    }
  });

  // ==========================================================================
  // 4. Enterprise RFP / Pilotprojekt Form Controller
  // ==========================================================================
  const rfpForm = document.getElementById('rfpForm');
  const rfpSuccessBanner = document.getElementById('rfpSuccessBanner');

  rfpForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const company = document.getElementById('rfpCompany')?.value.trim();
    const name = document.getElementById('rfpName')?.value.trim();
    const email = document.getElementById('rfpEmail')?.value.trim();
    const sector = document.getElementById('rfpSector')?.value;

    if (!company || !name || !email || !sector) {
      alert(currentLang === 'de' 
        ? 'Bitte füllen Sie alle mit * gekennzeichneten Pflichtfelder aus.' 
        : 'Please fill in all mandatory fields marked with *.');
      return;
    }

    // Generate German Business Case Reference
    const randomCaseNum = Math.floor(1000 + Math.random() * 9000);
    const caseRef = `KW-2026-DE-${randomCaseNum}`;
    const refCaseId = document.getElementById('refCaseId');
    if (refCaseId) refCaseId.textContent = caseRef;

    // Show Success Banner & Disable Form
    rfpForm.style.display = 'none';
    if (rfpSuccessBanner) {
      rfpSuccessBanner.style.display = 'flex';
      rfpSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // ==========================================================================
  // 5. German Legal Modals (Impressum & DSGVO)
  // ==========================================================================
  const impressumModal = document.getElementById('impressumModal');
  const datenschutzModal = document.getElementById('datenschutzModal');

  const btnOpenImpressum = document.getElementById('btnOpenImpressum');
  const btnCloseImpressum = document.getElementById('btnCloseImpressum');
  const btnDismissImpressum = document.getElementById('btnDismissImpressum');

  const btnOpenDatenschutz = document.getElementById('btnOpenDatenschutz');
  const btnCloseDatenschutz = document.getElementById('btnCloseDatenschutz');
  const btnDismissDatenschutz = document.getElementById('btnDismissDatenschutz');

  function openModal(modal) {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  btnOpenImpressum?.addEventListener('click', () => openModal(impressumModal));
  btnCloseImpressum?.addEventListener('click', () => closeModal(impressumModal));
  btnDismissImpressum?.addEventListener('click', () => closeModal(impressumModal));

  btnOpenDatenschutz?.addEventListener('click', () => openModal(datenschutzModal));
  btnCloseDatenschutz?.addEventListener('click', () => closeModal(datenschutzModal));
  btnDismissDatenschutz?.addEventListener('click', () => closeModal(datenschutzModal));

  // Close modals on background click or Esc key
  [impressumModal, datenschutzModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(impressumModal);
      closeModal(datenschutzModal);
    }
  });

  // ==========================================================================
  // 6. Cookie Consent Banner (TTDSG & DSGVO Compliant)
  // ==========================================================================
  const cookieBanner = document.getElementById('cookieBanner');
  const btnCookieEssential = document.getElementById('btnCookieEssential');
  const btnCookieAccept = document.getElementById('btnCookieAccept');
  const btnOpenCookies = document.getElementById('btnOpenCookies');

  const cookieConsent = localStorage.getItem('kraftwerk_cookie_consent');
  if (cookieConsent && cookieBanner) {
    cookieBanner.style.display = 'none';
  }

  function handleCookieConsent(level) {
    localStorage.setItem('kraftwerk_cookie_consent', level);
    if (cookieBanner) {
      cookieBanner.style.display = 'none';
    }
  }

  btnCookieEssential?.addEventListener('click', () => handleCookieConsent('essential'));
  btnCookieAccept?.addEventListener('click', () => handleCookieConsent('all'));

  btnOpenCookies?.addEventListener('click', () => {
    if (cookieBanner) {
      cookieBanner.style.display = 'block';
    }
  });

  // ==========================================================================
  // 7. Dark / Light Mode Theme Controller (Icon Only)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  let currentTheme = localStorage.getItem('kraftwerk_theme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('kraftwerk_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (window.kraftwerkSim && window.kraftwerkSim.setTheme) {
      window.kraftwerkSim.setTheme(theme);
    }
  }

  themeToggleBtn?.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  // ==========================================================================
  // 8. Initialize Application
  // ==========================================================================
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  updateCalculator();

})();

