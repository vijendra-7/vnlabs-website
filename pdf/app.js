// PDF Swiss Knife — 100% Client-Side Private PDF Tools

// Tab Switcher
const tabs = document.querySelectorAll('.tab-btn');
const views = document.querySelectorAll('.tool-view');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));

        tab.classList.add('active');
        const targetView = document.getElementById('view-' + tab.dataset.tab);
        if (targetView) targetView.classList.add('active');
    });
});

// Toast Helper
function showToast(msg) {
    const toast = document.getElementById('status-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Download Helper
function downloadBlob(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// ==========================================
// 1. MERGE PDFS
// ==========================================
const mergeFileInput = document.getElementById('merge-file-input');
const mergeDropzone = document.getElementById('merge-dropzone');
const mergeQueue = document.getElementById('merge-queue');
const mergeList = document.getElementById('merge-list');
const btnRunMerge = document.getElementById('btn-run-merge');
const btnClearMerge = document.getElementById('btn-clear-merge');

let mergeFiles = [];

mergeFileInput.addEventListener('change', () => {
    handleMergeFiles(Array.from(mergeFileInput.files));
});

setupDropzone(mergeDropzone, (files) => {
    const pdfs = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdfs.length > 0) handleMergeFiles(pdfs);
});

function handleMergeFiles(files) {
    mergeFiles = mergeFiles.concat(files);
    renderMergeList();
}

function renderMergeList() {
    if (mergeFiles.length === 0) {
        mergeQueue.style.display = 'none';
        return;
    }
    mergeQueue.style.display = 'block';
    mergeList.innerHTML = '';
    mergeFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.innerHTML = `
            <div>
                <span class="name">${escapeHtml(file.name)}</span>
                <span class="size">(${(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
            <button class="btn-ghost" data-index="${index}">✕</button>
        `;
        item.querySelector('button').addEventListener('click', () => {
            mergeFiles.splice(index, 1);
            renderMergeList();
        });
        mergeList.appendChild(item);
    });
}

btnClearMerge.addEventListener('click', () => {
    mergeFiles = [];
    renderMergeList();
});

btnRunMerge.addEventListener('click', async () => {
    if (mergeFiles.length < 2) {
        alert("Please select at least 2 PDF files to merge.");
        return;
    }
    if (typeof PDFLib === 'undefined') {
        alert("PDF library is still loading, please wait a moment.");
        return;
    }

    btnRunMerge.textContent = "Merging PDFs...";
    btnRunMerge.disabled = true;

    try {
        const mergedDoc = await PDFLib.PDFDocument.create();

        for (const file of mergeFiles) {
            const bytes = await file.arrayBuffer();
            const doc = await PDFLib.PDFDocument.load(bytes);
            const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
            copiedPages.forEach(page => mergedDoc.addPage(page));
        }

        const mergedBytes = await mergedDoc.save();
        downloadBlob(mergedBytes, 'merged_document.pdf');
        showToast("PDFs merged successfully!");
    } catch (e) {
        console.error(e);
        alert("Failed to merge PDFs: " + e.message);
    } finally {
        btnRunMerge.textContent = "Merge & Download PDF";
        btnRunMerge.disabled = false;
    }
});

// ==========================================
// 2. SPLIT / EXTRACT PDF
// ==========================================
const splitFileInput = document.getElementById('split-file-input');
const splitDropzone = document.getElementById('split-dropzone');
const splitOptions = document.getElementById('split-options');
const splitFilename = document.getElementById('split-filename');
const splitPageCount = document.getElementById('split-page-count');
const splitRangeInput = document.getElementById('split-range-input');
const btnRunSplit = document.getElementById('btn-run-split');

let splitFile = null;
let splitDocTotalPages = 0;

splitFileInput.addEventListener('change', () => {
    if (splitFileInput.files[0]) handleSplitFile(splitFileInput.files[0]);
});

setupDropzone(splitDropzone, (files) => {
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdf) handleSplitFile(pdf);
});

async function handleSplitFile(file) {
    splitFile = file;
    splitFilename.textContent = file.name;
    try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(bytes);
        splitDocTotalPages = doc.getPageCount();
        splitPageCount.textContent = `${splitDocTotalPages} pages`;
        splitRangeInput.placeholder = `e.g. 1-${Math.min(splitDocTotalPages, 3)}, ${splitDocTotalPages}`;
        splitOptions.style.display = 'block';
    } catch (e) {
        alert("Could not load PDF: " + e.message);
    }
}

btnRunSplit.addEventListener('click', async () => {
    if (!splitFile) return;
    const rangeStr = splitRangeInput.value.trim();
    if (!rangeStr) {
        alert("Please enter a page range (e.g. 1-3, 5)");
        return;
    }

    const pagesToExtract = parsePageRange(rangeStr, splitDocTotalPages);
    if (pagesToExtract.length === 0) {
        alert("Invalid page range specified.");
        return;
    }

    btnRunSplit.textContent = "Extracting...";
    btnRunSplit.disabled = true;

    try {
        const bytes = await splitFile.arrayBuffer();
        const srcDoc = await PDFLib.PDFDocument.load(bytes);
        const newDoc = await PDFLib.PDFDocument.create();

        // 0-indexed page indices
        const pageIndices = pagesToExtract.map(p => p - 1);
        const copied = await newDoc.copyPages(srcDoc, pageIndices);
        copied.forEach(p => newDoc.addPage(p));

        const extractedBytes = await newDoc.save();
        downloadBlob(extractedBytes, `extracted_${splitFile.name}`);
        showToast("Pages extracted successfully!");
    } catch (e) {
        alert("Extraction failed: " + e.message);
    } finally {
        btnRunSplit.textContent = "Extract & Download";
        btnRunSplit.disabled = false;
    }
});

function parsePageRange(str, maxPages) {
    const pages = new Set();
    const parts = str.split(',');
    for (let part of parts) {
        part = part.trim();
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
                    pages.add(i);
                }
            }
        } else {
            const p = Number(part);
            if (!isNaN(p) && p >= 1 && p <= maxPages) {
                pages.add(p);
            }
        }
    }
    return Array.from(pages).sort((a, b) => a - b);
}

// ==========================================
// 3. IMAGES TO PDF
// ==========================================
const imgFileInput = document.getElementById('img-file-input');
const imgDropzone = document.getElementById('img-dropzone');
const imgQueue = document.getElementById('img-queue');
const imgPreviewGrid = document.getElementById('img-preview-grid');
const btnRunImg2Pdf = document.getElementById('btn-run-img2pdf');
const btnClearImg = document.getElementById('btn-clear-img');

let imgFiles = [];

imgFileInput.addEventListener('change', () => {
    handleImgFiles(Array.from(imgFileInput.files));
});

setupDropzone(imgDropzone, (files) => {
    const images = files.filter(f => f.type.startsWith('image/'));
    if (images.length > 0) handleImgFiles(images);
});

function handleImgFiles(files) {
    imgFiles = imgFiles.concat(files);
    renderImgPreviews();
}

function renderImgPreviews() {
    if (imgFiles.length === 0) {
        imgQueue.style.display = 'none';
        return;
    }
    imgQueue.style.display = 'block';
    imgPreviewGrid.innerHTML = '';

    imgFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'image-preview-item';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        item.appendChild(img);
        imgPreviewGrid.appendChild(item);
    });
}

btnClearImg.addEventListener('click', () => {
    imgFiles = [];
    renderImgPreviews();
});

btnRunImg2Pdf.addEventListener('click', async () => {
    if (imgFiles.length === 0) return;

    btnRunImg2Pdf.textContent = "Converting...";
    btnRunImg2Pdf.disabled = true;

    try {
        const doc = await PDFLib.PDFDocument.create();

        for (const file of imgFiles) {
            const bytes = await file.arrayBuffer();
            let embeddedImg;

            if (file.type === 'image/jpeg' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                embeddedImg = await doc.embedJpg(bytes);
            } else {
                embeddedImg = await doc.embedPng(bytes);
            }

            const { width, height } = embeddedImg;
            const page = doc.addPage([width, height]);
            page.drawImage(embeddedImg, {
                x: 0,
                y: 0,
                width: width,
                height: height
            });
        }

        const pdfBytes = await doc.save();
        downloadBlob(pdfBytes, 'converted_images.pdf');
        showToast("Converted images to PDF!");
    } catch (e) {
        alert("Image to PDF failed: " + e.message);
    } finally {
        btnRunImg2Pdf.textContent = "Convert to PDF";
        btnRunImg2Pdf.disabled = false;
    }
});

// ==========================================
// 4. SIGN DOCUMENT
// ==========================================
const signFileInput = document.getElementById('sign-file-input');
const signDropzone = document.getElementById('sign-dropzone');
const signOptions = document.getElementById('sign-options');
const signFilename = document.getElementById('sign-filename');
const sigCanvas = document.getElementById('signature-canvas');
const btnClearSig = document.getElementById('btn-clear-sig');
const sigUploadInput = document.getElementById('sig-upload-input');
const sigPosition = document.getElementById('sig-position');
const btnRunSign = document.getElementById('btn-run-sign');

let signPdfFile = null;
const ctx = sigCanvas.getContext('2d');
let isDrawing = false;
let uploadedSigDataUrl = null;

// Drawing Canvas
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = '#000000';

function getCanvasCoords(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const scaleX = sigCanvas.width / rect.width;
    const scaleY = sigCanvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

sigCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
});
sigCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
});
window.addEventListener('mouseup', () => { isDrawing = false; });

sigCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}, { passive: false });
sigCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
}, { passive: false });
window.addEventListener('touchend', () => { isDrawing = false; });

btnClearSig.addEventListener('click', () => {
    ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    uploadedSigDataUrl = null;
});

sigUploadInput.addEventListener('change', () => {
    const file = sigUploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
                ctx.drawImage(img, 0, 0, sigCanvas.width, sigCanvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

signFileInput.addEventListener('change', () => {
    if (signFileInput.files[0]) handleSignFile(signFileInput.files[0]);
});

setupDropzone(signDropzone, (files) => {
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (pdf) handleSignFile(pdf);
});

function handleSignFile(file) {
    signPdfFile = file;
    signFilename.textContent = file.name;
    signOptions.style.display = 'block';
}

btnRunSign.addEventListener('click', async () => {
    if (!signPdfFile) return;

    btnRunSign.textContent = "Stamping Signature...";
    btnRunSign.disabled = true;

    try {
        const sigPngData = sigCanvas.toDataURL('image/png');
        const sigBytes = await fetch(sigPngData).then(res => res.arrayBuffer());

        const pdfBytes = await signPdfFile.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(pdfBytes);
        const sigImage = await doc.embedPng(sigBytes);

        const pageCount = doc.getPageCount();
        const pos = sigPosition.value;
        const targetPageIndex = (pos.includes('last')) ? pageCount - 1 : 0;
        const page = doc.getPage(targetPageIndex);

        const { width, height } = page.getSize();
        const sigWidth = 140;
        const sigHeight = (sigCanvas.height / sigCanvas.width) * sigWidth;

        let posX = 40;
        let posY = 40;

        if (pos.startsWith('bottom-right')) {
            posX = width - sigWidth - 40;
        }

        page.drawImage(sigImage, {
            x: posX,
            y: posY,
            width: sigWidth,
            height: sigHeight
        });

        const signedBytes = await doc.save();
        downloadBlob(signedBytes, `signed_${signPdfFile.name}`);
        showToast("Signature stamped successfully!");
    } catch (e) {
        alert("Signing failed: " + e.message);
    } finally {
        btnRunSign.textContent = "Stamp Signature & Download";
        btnRunSign.disabled = false;
    }
});

// Setup Generic Drag & Drop
function setupDropzone(el, onFiles) {
    el.addEventListener('dragover', (e) => {
        e.preventDefault();
        el.classList.add('dragover');
    });
    el.addEventListener('dragleave', () => el.classList.remove('dragover'));
    el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('dragover');
        if (e.dataTransfer.files) {
            onFiles(Array.from(e.dataTransfer.files));
        }
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
