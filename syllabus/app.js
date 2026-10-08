// GATE CS Syllabus & Topic Tracker - Application Logic
import { 
    GATE_SUBJECTS, 
    GATE_CHAPTERS, 
    RECENT_WEIGHTAGES, 
    HISTORICAL_WEIGHTAGES, 
    ALL_TIME_WEIGHTAGES,
    ALL_TIME_YEARS
} from './syllabus-data.js';

// ─── State Management ────────────────────────────────────────────────────────

const STORAGE_KEY = 'vnlabs_syllabus_completed_ids';

let completedChapterIds = new Set();
let activeSubjectId = GATE_SUBJECTS[0].id;
let activeFilter = 'all'; // 'all', 'remaining', 'completed', 'important'
let activeWeightageTab = 'recent'; // 'recent', 'historical', 'alltime'

// Load saved completed chapters
function loadSavedState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                completedChapterIds = new Set(arr);
            }
        }
    } catch (e) {
        console.error('Failed to parse saved state:', e);
    }
}

function persistState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedChapterIds)));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// ─── Initialization ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Request OS to never evict this app's storage
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => {});
    }
    loadSavedState();
    initUI();
    setupEventListeners();
    setupSearch();
    renderAll();
});

function initUI() {
    renderSubjectsNav();
    renderChapters();
    updateOverallStats();
}

function renderAll() {
    renderSubjectsNav();
    renderChapters();
    updateOverallStats();
}

// ─── Overall Progress Stats ─────────────────────────────────────────────────

function updateOverallStats() {
    const allChapters = Object.values(GATE_CHAPTERS).flat();
    const totalChapters = allChapters.length; // 78
    const completedCount = allChapters.filter(c => completedChapterIds.has(c.id)).length;
    const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

    // High yield stats
    const impChapters = allChapters.filter(c => c.isImportant);
    const impCompletedCount = impChapters.filter(c => completedChapterIds.has(c.id)).length;

    // Completed subjects count
    let completedSubjectsCount = 0;
    GATE_SUBJECTS.forEach(sub => {
        const subChapters = GATE_CHAPTERS[sub.id] || [];
        if (subChapters.length > 0 && subChapters.every(c => completedChapterIds.has(c.id))) {
            completedSubjectsCount++;
        }
    });

    // Update Hero Card DOM
    const percentEl = document.getElementById('overall-percentage-text');
    const barEl = document.getElementById('overall-progress-bar');
    const fracEl = document.getElementById('overall-fraction-text');
    
    if (percentEl) percentEl.textContent = `${progressPercent}%`;
    if (barEl) barEl.style.width = `${progressPercent}%`;
    if (fracEl) fracEl.textContent = `${completedCount} of ${totalChapters} chapters completed`;

    const subDoneEl = document.getElementById('stat-completed-subjects');
    const impDoneEl = document.getElementById('stat-imp-completed');
    const remChEl = document.getElementById('stat-remaining-chapters');

    if (subDoneEl) subDoneEl.textContent = `${completedSubjectsCount} / ${GATE_SUBJECTS.length}`;
    if (impDoneEl) impDoneEl.textContent = `${impCompletedCount} / ${impChapters.length}`;
    if (remChEl) remChEl.textContent = `${totalChapters - completedCount}`;
}

// ─── Subjects Sidebar Navigation ────────────────────────────────────────────

function renderSubjectsNav() {
    const container = document.getElementById('subjects-nav-list');
    if (!container) return;

    container.innerHTML = '';

    GATE_SUBJECTS.forEach(subject => {
        const chapters = GATE_CHAPTERS[subject.id] || [];
        const completedInSub = chapters.filter(c => completedChapterIds.has(c.id)).length;
        const totalInSub = chapters.length;
        const percent = totalInSub > 0 ? Math.round((completedInSub / totalInSub) * 100) : 0;
        const isActive = subject.id === activeSubjectId;

        // SVG circumference for r=12: 2 * PI * 12 = 75.398
        const circumference = 75.4;
        const offset = circumference - (percent / 100) * circumference;

        const btn = document.createElement('button');
        btn.className = `subject-item-btn ${isActive ? 'active' : ''}`;
        btn.setAttribute('data-id', subject.id);

        btn.innerHTML = `
            <span class="subject-item-icon">${subject.icon || '📖'}</span>
            <div class="subject-item-info">
                <div class="subject-item-title">${subject.name}</div>
                <div class="subject-item-meta">${completedInSub}/${totalInSub} done · ~${subject.avgMarks}M</div>
            </div>
            <div class="progress-ring-wrap">
                <svg class="progress-ring" width="32" height="32">
                    <circle class="progress-ring-bg" stroke-width="2.5" fill="transparent" r="12" cx="16" cy="16"/>
                    <circle class="progress-ring-fill" stroke-width="2.5" 
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${offset}" 
                        stroke-linecap="round" fill="transparent" r="12" cx="16" cy="16"/>
                </svg>
                <span class="progress-ring-text">${percent}%</span>
            </div>
        `;

        btn.addEventListener('click', () => {
            activeSubjectId = subject.id;
            // Exit search view if open
            closeSearch();
            renderAll();
        });

        container.appendChild(btn);
    });
}

// ─── Chapters Panel Checklist ───────────────────────────────────────────────

function renderChapters() {
    const currentSubject = GATE_SUBJECTS.find(s => s.id === activeSubjectId) || GATE_SUBJECTS[0];
    const chapters = GATE_CHAPTERS[currentSubject.id] || [];

    // Header info
    const nameEl = document.getElementById('active-subject-name');
    const iconEl = document.getElementById('active-subject-icon');
    const subEl = document.getElementById('active-subject-sub');
    const toggleAllBtn = document.getElementById('btn-toggle-subject-all');

    const completedInSub = chapters.filter(c => completedChapterIds.has(c.id)).length;
    const allDone = chapters.length > 0 && completedInSub === chapters.length;

    if (nameEl) nameEl.textContent = currentSubject.name;
    if (iconEl) iconEl.textContent = currentSubject.icon || '📖';
    if (subEl) {
        subEl.textContent = `${completedInSub} of ${chapters.length} chapters completed · ~${currentSubject.avgMarks} Marks Avg`;
    }
    if (toggleAllBtn) {
        toggleAllBtn.textContent = allDone ? 'Reset Subject' : 'Mark All Done';
    }

    // Apply Filter
    let filteredChapters = chapters;
    if (activeFilter === 'remaining') {
        filteredChapters = chapters.filter(c => !completedChapterIds.has(c.id));
    } else if (activeFilter === 'completed') {
        filteredChapters = chapters.filter(c => completedChapterIds.has(c.id));
    } else if (activeFilter === 'important') {
        filteredChapters = chapters.filter(c => c.isImportant);
    }

    const container = document.getElementById('chapters-list-container');
    if (!container) return;

    container.innerHTML = '';

    if (filteredChapters.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <p>No chapters matching current filter (${activeFilter}).</p>
            </div>
        `;
        return;
    }

    filteredChapters.forEach(chapter => {
        const isDone = completedChapterIds.has(chapter.id);
        const tile = document.createElement('div');
        tile.className = `chapter-tile ${isDone ? 'completed' : ''}`;
        tile.setAttribute('data-id', chapter.id);

        tile.innerHTML = `
            <div class="chapter-checkbox-wrap">
                <div class="chapter-checkbox">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            </div>
            <div class="chapter-text-wrap">
                <h4 class="chapter-name">${chapter.name}</h4>
            </div>
            <div class="chapter-badges">
                ${chapter.isImportant ? '<span class="badge-important">⭐ High-Yield</span>' : ''}
                <span class="badge-done">DONE</span>
            </div>
        `;

        tile.addEventListener('click', () => {
            toggleChapter(chapter.id);
        });

        container.appendChild(tile);
    });
}

function toggleChapter(chapterId) {
    if (completedChapterIds.has(chapterId)) {
        completedChapterIds.delete(chapterId);
    } else {
        completedChapterIds.add(chapterId);
    }
    persistState();
    renderAll();
}

function toggleSubjectAll() {
    const currentSubject = GATE_SUBJECTS.find(s => s.id === activeSubjectId);
    if (!currentSubject) return;

    const chapters = GATE_CHAPTERS[currentSubject.id] || [];
    const allDone = chapters.every(c => completedChapterIds.has(c.id));

    if (allDone) {
        // Unmark all
        chapters.forEach(c => completedChapterIds.delete(c.id));
        showToast(`Reset progress for ${currentSubject.name}`);
    } else {
        // Mark all
        chapters.forEach(c => completedChapterIds.add(c.id));
        showToast(`Marked all ${currentSubject.name} chapters complete! 🚀`);
    }

    persistState();
    renderAll();
}

// ─── Search Implementation ──────────────────────────────────────────────────

function setupSearch() {
    const input = document.getElementById('topic-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    const resultsPanel = document.getElementById('search-results-panel');
    const workspaceLayout = document.getElementById('workspace-layout');
    const countEl = document.getElementById('search-count');
    const container = document.getElementById('search-chapters-container');
    const closeBtn = document.getElementById('btn-close-search');

    if (!input) return;

    // Keyboard shortcut (Ctrl + K or '/')
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            input.focus();
            input.select();
        } else if (e.key === '/' && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
        }
    });

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();

        if (query.length > 0) {
            clearBtn?.classList.remove('hidden');
            resultsPanel?.classList.remove('hidden');
            workspaceLayout?.classList.add('hidden');

            const allChapters = [];
            GATE_SUBJECTS.forEach(sub => {
                const subChapters = GATE_CHAPTERS[sub.id] || [];
                subChapters.forEach(ch => {
                    allChapters.push({ ...ch, subjectName: sub.name, subjectIcon: sub.icon });
                });
            });

            const matched = allChapters.filter(ch => 
                ch.name.toLowerCase().includes(query) || 
                ch.subjectName.toLowerCase().includes(query)
            );

            if (countEl) countEl.textContent = matched.length;
            if (container) {
                container.innerHTML = '';
                if (matched.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                            <p>No topics matching "<strong>${input.value}</strong>".</p>
                        </div>
                    `;
                } else {
                    matched.forEach(chapter => {
                        const isDone = completedChapterIds.has(chapter.id);
                        const tile = document.createElement('div');
                        tile.className = `chapter-tile ${isDone ? 'completed' : ''}`;
                        tile.innerHTML = `
                            <div class="chapter-checkbox-wrap">
                                <div class="chapter-checkbox">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="chapter-text-wrap">
                                <div class="search-subject-tag">${chapter.subjectIcon || '📖'} ${chapter.subjectName}</div>
                                <h4 class="chapter-name">${chapter.name}</h4>
                            </div>
                            <div class="chapter-badges">
                                ${chapter.isImportant ? '<span class="badge-important">⭐ High-Yield</span>' : ''}
                                <span class="badge-done">DONE</span>
                            </div>
                        `;
                        tile.addEventListener('click', () => {
                            toggleChapter(chapter.id);
                            // Refresh search view tile
                            tile.classList.toggle('completed');
                        });
                        container.appendChild(tile);
                    });
                }
            }
        } else {
            closeSearch();
        }
    });

    clearBtn?.addEventListener('click', () => {
        input.value = '';
        closeSearch();
        input.focus();
    });

    closeBtn?.addEventListener('click', closeSearch);
}

function closeSearch() {
    const input = document.getElementById('topic-search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    const resultsPanel = document.getElementById('search-results-panel');
    const workspaceLayout = document.getElementById('workspace-layout');

    if (input) input.value = '';
    clearBtn?.classList.add('hidden');
    resultsPanel?.classList.add('hidden');
    workspaceLayout?.classList.remove('hidden');
}

// ─── Weightage Analytics Modal ──────────────────────────────────────────────

// ─── Weightage Helpers & Graphs (Identical to Flutter App) ──────────────────

function getWeightageColor(avg) {
    if (avg >= 8.0) return '#34C759'; // High - Green
    if (avg >= 5.0) return '#F59E0B'; // Medium - Orange/Amber
    return '#EF4444'; // Low - Red
}

function getVolatilityValue(range) {
    const parts = range.split('-');
    if (parts.length === 2) {
        return ((parseFloat(parts[1]) - parseFloat(parts[0])) / 2.0).toFixed(1);
    }
    return '0.0';
}

function getVolatilityLabel(range) {
    const parts = range.split('-');
    if (parts.length === 2) {
        const v = (parseFloat(parts[1]) - parseFloat(parts[0])) / 2.0;
        if (v <= 1.0) return 'Stable';
        if (v <= 2.0) return 'Variable';
        return 'Unpredictable';
    }
    return 'Stable';
}

// Full Mark Trends Popup Modal (_WeightageGraphPopup from Flutter App)
function showGraphPopup(subject, marks, years, color) {
    const modal = document.getElementById('graph-popup-modal');
    const titleEl = document.getElementById('graph-popup-title');
    const container = document.getElementById('graph-bars-container');

    if (!modal || !titleEl || !container) return;

    titleEl.textContent = subject;
    container.innerHTML = '';
    const isDense = marks.length > 10;
    if (isDense) {
        container.classList.add('dense');
    } else {
        container.classList.remove('dense');
    }

    const maxMark = Math.max(...marks, 1);

    marks.forEach((mark, i) => {
        const hPercent = mark / maxMark;
        const col = document.createElement('div');
        col.className = 'popup-bar-item';
        col.innerHTML = `
            <span class="popup-bar-val" style="color: ${color};">${mark}</span>
            <div class="popup-bar-pillar ${isDense ? 'dense' : ''}" style="height: 0px; background-color: ${color};"></div>
            <span class="popup-bar-year">${years[i]}</span>
        `;
        container.appendChild(col);

        // Animate pillar height smoothly
        setTimeout(() => {
            const pillar = col.querySelector('.popup-bar-pillar');
            if (pillar) {
                pillar.style.height = `${Math.max(Math.round(180 * hPercent), 6)}px`;
            }
        }, 50 + i * 20);
    });

    modal.classList.remove('hidden');
}

// Render Subject Weightage Cards (_SubjectWeightageCard + _AnimatedTrendBars)
function renderWeightageModal() {
    const container = document.getElementById('weightage-cards-container');
    if (!container) return;

    container.innerHTML = '';

    let items = [];
    if (activeWeightageTab === 'recent') {
        items = [...RECENT_WEIGHTAGES].sort((a, b) => b.threeYearAvg - a.threeYearAvg);
    } else if (activeWeightageTab === 'historical') {
        items = [...HISTORICAL_WEIGHTAGES].sort((a, b) => b.fiveYearAvg - a.fiveYearAvg);
    } else {
        items = [...ALL_TIME_WEIGHTAGES].sort((a, b) => b.average - a.average);
    }

    items.forEach(item => {
        const isRecent = activeWeightageTab === 'recent';
        const isAllTime = activeWeightageTab === 'alltime';

        const subjectName = item.subject;
        const avg = isRecent ? item.threeYearAvg : (isAllTime ? item.average : item.fiveYearAvg);
        const color = getWeightageColor(avg);

        let marks = [];
        let years = [];

        if (isRecent) {
            marks = [item.marks2025Avg, item.marks2024, item.marks2023];
            years = ['25', '24', '23'];
        } else if (isAllTime) {
            const rawMarks = item.allMarks || [];
            const rawYears = ALL_TIME_YEARS.map(y => y.substring(2));
            for (let i = 0; i < rawMarks.length; i++) {
                if (rawMarks[i] > 0) {
                    marks.push(rawMarks[i]);
                    years.push(rawYears[i]);
                }
            }
            if (marks.length === 0) {
                marks = [0];
                years = ['-'];
            }
        } else {
            marks = [item.marks2023, item.marks2022, item.marks2021, item.marks2020, item.marks2019];
            years = ['23', '22', '21', '20', '19'];
        }

        const card = document.createElement('div');
        card.className = 'subject-weightage-card';

        // Build mini trend bars HTML (_AnimatedTrendBars)
        const maxMark = Math.max(...marks, 1);
        let barsHtml = '';
        marks.forEach((m, idx) => {
            const h = Math.round((m / maxMark) * 100);
            barsHtml += `
                <div class="trend-bar-col">
                    <span class="trend-bar-year">${years[idx]}</span>
                    <div class="trend-bar-track ${isAllTime ? 'skinny' : ''}">
                        <div class="trend-bar-fill" style="height: ${h}%; background-color: ${color};"></div>
                    </div>
                </div>
            `;
        });

        let volatilityHtml = '';
        if (isRecent) {
            const vLabel = getVolatilityLabel(item.volatility);
            const vVal = getVolatilityValue(item.volatility);
            volatilityHtml = `<span class="card-volatility">${vLabel} · ±${vVal}</span>`;
        }

        card.innerHTML = `
            <div class="card-subject-name" title="${subjectName}">${subjectName}</div>
            <div class="card-body-row ${isAllTime ? 'alltime-row' : ''}">
                <div class="card-stats-col">
                    <span class="card-avg-number" style="color: ${color};">${avg.toFixed(1)}</span>
                    <span class="card-avg-label">Avg Marks</span>
                    ${volatilityHtml}
                </div>
                ${isAllTime 
                    ? `<div class="alltime-scroll-wrapper"><div class="mini-trend-bars">${barsHtml}</div></div>` 
                    : `<div class="mini-trend-bars">${barsHtml}</div>`
                }
            </div>
        `;

        card.addEventListener('click', () => {
            showGraphPopup(subjectName, marks, years, color);
        });

        container.appendChild(card);
    });
}


// ─── Modal & Action Handlers ────────────────────────────────────────────────

function setupEventListeners() {
    // Subject Mark All Done
    document.getElementById('btn-toggle-subject-all')?.addEventListener('click', toggleSubjectAll);

    // Filter Chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-filter') || 'all';
            renderChapters();
        });
    });

    // Reset Progress
    document.getElementById('btn-reset-progress')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all syllabus completion progress?')) {
            completedChapterIds.clear();
            persistState();
            renderAll();
            showToast('Progress has been reset.');
        }
    });

    // Weightage Modal
    const weightageModal = document.getElementById('weightage-modal');
    document.getElementById('btn-open-weightage')?.addEventListener('click', () => {
        renderWeightageModal();
        weightageModal?.classList.remove('hidden');
    });
    document.getElementById('btn-close-weightage')?.addEventListener('click', () => {
        weightageModal?.classList.add('hidden');
    });

    // Weightage Mode Tabs (Recent, Historical, All-Time)
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeWeightageTab = tab.getAttribute('data-tab') || 'recent';
            renderWeightageModal();
        });
    });

    // Detailed Graph Popup Close
    const graphModal = document.getElementById('graph-popup-modal');
    document.getElementById('btn-close-graph-popup')?.addEventListener('click', () => {
        graphModal?.classList.add('hidden');
    });

    // Backup Modal
    const backupModal = document.getElementById('backup-modal');
    document.getElementById('btn-backup-data')?.addEventListener('click', () => {
        backupModal?.classList.remove('hidden');
    });
    document.getElementById('btn-close-backup')?.addEventListener('click', () => {
        backupModal?.classList.add('hidden');
    });

    // Close on overlay click
    [weightageModal, graphModal, backupModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });


    // Export JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
        const data = {
            exportDate: new Date().toISOString(),
            completedChapterIds: Array.from(completedChapterIds),
            totalCompleted: completedChapterIds.size
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gate_cs_syllabus_progress_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Progress exported successfully! 📁');
    });

    // Import JSON
    const fileInput = document.getElementById('import-json-file');
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed && Array.isArray(parsed.completedChapterIds)) {
                    completedChapterIds = new Set(parsed.completedChapterIds);
                    persistState();
                    renderAll();
                    backupModal?.classList.add('hidden');
                    showToast(`Restored ${completedChapterIds.size} completed chapters! 🎉`);
                } else {
                    alert('Invalid backup file format.');
                }
            } catch (err) {
                alert('Failed to parse backup file.');
            }
        };
        reader.readAsText(file);
    });
}

// ─── Toast Notification ─────────────────────────────────────────────────────

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}
