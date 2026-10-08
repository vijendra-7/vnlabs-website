// Formula Vault & Cheat Sheets Engine

const formulasGrid = document.getElementById('formulas-grid');
const searchInput = document.getElementById('formula-search-input');
const categoryPills = document.querySelectorAll('.cat-pill');
const btnPrintSheet = document.getElementById('btn-print-sheet');
const printDateSpan = document.getElementById('print-date');
const btnOpenAddModal = document.getElementById('btn-open-add-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const addModal = document.getElementById('add-modal');
const btnSaveCustom = document.getElementById('btn-save-custom');

let currentCategory = 'all';
let searchQuery = '';

// LocalStorage Custom Formulas & Starred IDs
function getCustomFormulas() {
    try {
        return JSON.parse(localStorage.getItem('vn_custom_formulas')) || [];
    } catch {
        return [];
    }
}

function getStarredIds() {
    try {
        return JSON.parse(localStorage.getItem('vn_starred_formulas')) || [];
    } catch {
        return [];
    }
}

function getAllFormulas() {
    const custom = getCustomFormulas();
    return [...custom, ...DEFAULT_FORMULAS];
}

// Render Engine
function renderFormulas() {
    const all = getAllFormulas();
    const starredIds = getStarredIds();

    const filtered = all.filter(item => {
        // Category Filter
        if (currentCategory === 'starred') {
            if (!starredIds.includes(item.id)) return false;
        } else if (currentCategory !== 'all' && item.subject !== currentCategory) {
            return false;
        }

        // Search Filter
        if (searchQuery.trim().length > 0) {
            const q = searchQuery.toLowerCase();
            const inTitle = item.title.toLowerCase().includes(q);
            const inNotes = item.notes.toLowerCase().includes(q);
            const inSubject = (item.subjectName || '').toLowerCase().includes(q);
            const inLatex = item.latex.toLowerCase().includes(q);
            return inTitle || inNotes || inSubject || inLatex;
        }

        return true;
    });

    formulasGrid.innerHTML = '';

    if (filtered.length === 0) {
        formulasGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <h3>No formulas found</h3>
                <p>Try searching for a different keyword or category.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const isStarred = starredIds.includes(item.id);
        const card = document.createElement('div');
        card.className = 'formula-card';

        const subjectClass = `subject-${item.subject}`;

        card.innerHTML = `
            <div>
                <div class="card-top">
                    <div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <span class="subject-badge ${subjectClass}">${escapeHtml(item.subjectName || item.subject)}</span>
                    </div>
                    <button class="card-btn star-btn ${isStarred ? 'starred' : ''}" data-id="${item.id}" title="Star for revision">
                        ${isStarred ? '★' : '☆'}
                    </button>
                </div>

                <div class="math-box" id="math-${item.id}">
                    <!-- KaTeX renders here -->
                </div>

                <p class="formula-notes">${escapeHtml(item.notes)}</p>
            </div>

            <div class="card-footer">
                <button class="card-btn copy-btn" data-latex="${escapeHtml(item.latex)}">
                    📋 Copy LaTeX
                </button>
            </div>
        `;

        formulasGrid.appendChild(card);

        // Render KaTeX
        const mathTarget = card.querySelector(`#math-${item.id}`);
        if (typeof katex !== 'undefined') {
            try {
                katex.render(item.latex, mathTarget, {
                    displayMode: true,
                    throwOnError: false
                });
            } catch (err) {
                mathTarget.textContent = item.latex;
            }
        } else {
            mathTarget.textContent = item.latex;
        }

        // Star toggle
        card.querySelector('.star-btn').addEventListener('click', (e) => {
            toggleStar(item.id);
        });

        // Copy LaTeX
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(item.latex);
            copyBtn.textContent = '✔ Copied!';
            setTimeout(() => { copyBtn.textContent = '📋 Copy LaTeX'; }, 1500);
        });
    });
}

function toggleStar(id) {
    let starred = getStarredIds();
    if (starred.includes(id)) {
        starred = starred.filter(x => x !== id);
    } else {
        starred.push(id);
    }
    localStorage.setItem('vn_starred_formulas', JSON.stringify(starred));
    renderFormulas();
}

// Category Tabs
categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.subject;
        renderFormulas();
    });
});

// Search Input Listener
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFormulas();
});

// Keyboard Shortcut: Ctrl + K
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
});

// Print Clean Cheat Sheet
btnPrintSheet.addEventListener('click', () => {
    if (printDateSpan) {
        printDateSpan.textContent = new Date().toLocaleDateString();
    }
    window.print();
});

// Modal Actions
btnOpenAddModal.addEventListener('click', () => {
    addModal.style.display = 'flex';
});

btnCloseModal.addEventListener('click', () => {
    addModal.style.display = 'none';
});

addModal.addEventListener('click', (e) => {
    if (e.target === addModal) addModal.style.display = 'none';
});

btnSaveCustom.addEventListener('click', () => {
    const title = document.getElementById('new-formula-title').value.trim();
    const subject = document.getElementById('new-formula-subject').value;
    const latex = document.getElementById('new-formula-latex').value.trim();
    const notes = document.getElementById('new-formula-notes').value.trim();

    if (!title || !latex) {
        alert("Please provide at least a title and formula.");
        return;
    }

    const custom = getCustomFormulas();
    custom.unshift({
        id: "c_" + Date.now(),
        title: title,
        subject: subject,
        subjectName: document.getElementById('new-formula-subject').selectedOptions[0].text,
        latex: latex,
        notes: notes || "Custom student note"
    });

    localStorage.setItem('vn_custom_formulas', JSON.stringify(custom));
    addModal.style.display = 'none';
    
    // Clear inputs
    document.getElementById('new-formula-title').value = '';
    document.getElementById('new-formula-latex').value = '';
    document.getElementById('new-formula-notes').value = '';

    renderFormulas();
});

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Wait for KaTeX or DOM ready
function start() {
    if (typeof katex !== 'undefined') {
        renderFormulas();
    } else {
        setTimeout(start, 50);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
