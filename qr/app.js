// QR Studio & Lens — Generator & Universal Scanner

// Mode Navigation
const tabGenBtn = document.getElementById('tab-gen-btn');
const tabScanBtn = document.getElementById('tab-scan-btn');
const viewGenerate = document.getElementById('view-generate');
const viewScan = document.getElementById('view-scan');

tabGenBtn.addEventListener('click', () => {
    tabGenBtn.classList.add('active');
    tabScanBtn.classList.remove('active');
    viewGenerate.classList.add('active');
    viewScan.classList.remove('active');
    stopCamera();
});

tabScanBtn.addEventListener('click', () => {
    tabScanBtn.classList.add('active');
    tabGenBtn.classList.remove('active');
    viewScan.classList.add('active');
    viewGenerate.classList.remove('active');
});

// ==========================================
// 1. GENERATOR LOGIC
// ==========================================
const typePills = document.querySelectorAll('.type-pill');
const typeFields = document.querySelectorAll('.type-fields');
const qrPreviewBox = document.getElementById('qr-preview-box');
const qrDarkColor = document.getElementById('qr-dark-color');
const qrLightColor = document.getElementById('qr-light-color');
const btnDownloadQr = document.getElementById('btn-download-qr');
const btnCopyQr = document.getElementById('btn-copy-qr');

let currentType = 'url';
let qrInstance = null;

// Type Selection
typePills.forEach(pill => {
    pill.addEventListener('click', () => {
        typePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentType = pill.dataset.type;

        typeFields.forEach(f => f.style.display = 'none');
        const targetField = document.getElementById('field-' + currentType);
        if (targetField) targetField.style.display = 'flex';

        updateQr();
    });
});

// Input Listeners
document.querySelectorAll('.fields-container input, .fields-container textarea, .fields-container select').forEach(input => {
    input.addEventListener('input', updateQr);
});
qrDarkColor.addEventListener('input', updateQr);
qrLightColor.addEventListener('input', updateQr);

function getQrPayload() {
    switch (currentType) {
        case 'url':
            return document.getElementById('input-url').value.trim() || 'https://vnlabs.in';
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value.trim();
            const pass = document.getElementById('wifi-pass').value;
            const sec = document.getElementById('wifi-sec').value;
            return `WIFI:S:${ssid};T:${sec};P:${pass};;`;
        case 'upi':
            const upiId = document.getElementById('upi-id').value.trim();
            const upiName = encodeURIComponent(document.getElementById('upi-name').value.trim());
            const amount = document.getElementById('upi-amount').value.trim();
            let upiStr = `upi://pay?pa=${upiId}&pn=${upiName}&cu=INR`;
            if (amount) upiStr += `&am=${amount}`;
            return upiStr;
        case 'wa':
            const phone = document.getElementById('wa-phone').value.replace(/[^0-9]/g, '');
            const msg = encodeURIComponent(document.getElementById('wa-msg').value.trim());
            return `https://wa.me/${phone}?text=${msg}`;
        case 'text':
            return document.getElementById('input-text').value.trim() || 'VN Labs';
        default:
            return 'https://vnlabs.in';
    }
}

function updateQr() {
    const payload = getQrPayload();
    qrPreviewBox.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
        qrInstance = new QRCode(qrPreviewBox, {
            text: payload,
            width: 200,
            height: 200,
            colorDark: qrDarkColor.value,
            colorLight: qrLightColor.value,
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Download PNG
btnDownloadQr.addEventListener('click', () => {
    const canvas = qrPreviewBox.querySelector('canvas');
    const img = qrPreviewBox.querySelector('img');

    if (canvas) {
        const link = document.createElement('a');
        link.download = `qrcode_${currentType}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } else if (img) {
        const link = document.createElement('a');
        link.download = `qrcode_${currentType}.png`;
        link.href = img.src;
        link.click();
    }
});

// Copy Image to Clipboard
btnCopyQr.addEventListener('click', async () => {
    const canvas = qrPreviewBox.querySelector('canvas');
    if (canvas && navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                const orig = btnCopyQr.textContent;
                btnCopyQr.textContent = '✔ Copied!';
                setTimeout(() => { btnCopyQr.textContent = orig; }, 1800);
            } catch (err) {
                alert("Could not copy image: " + err.message);
            }
        });
    }
});

// ==========================================
// 2. SCANNER / LENS LOGIC
// ==========================================
const scanDropzone = document.getElementById('scan-dropzone');
const scanFileInput = document.getElementById('scan-file-input');
const btnStartCamera = document.getElementById('btn-start-camera');
const cameraReader = document.getElementById('camera-reader');
const scanResultCard = document.getElementById('scan-result-card');
const scanResultText = document.getElementById('scan-result-text');
const btnCopyResult = document.getElementById('btn-copy-result');
const btnOpenResult = document.getElementById('btn-open-result');

let html5QrCode = null;
let isCameraActive = false;

// File Upload Scan
scanFileInput.addEventListener('change', () => {
    if (scanFileInput.files[0]) {
        decodeImageFile(scanFileInput.files[0]);
    }
});

// Dropzone Scan
scanDropzone.addEventListener('dragover', (e) => { e.preventDefault(); });
scanDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
        decodeImageFile(e.dataTransfer.files[0]);
    }
});

// Clipboard Paste Scan (Ctrl+V)
window.addEventListener('paste', (e) => {
    if (viewScan.classList.contains('active')) {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                decodeImageFile(file);
                break;
            }
        }
    }
});

async function decodeImageFile(file) {
    stopCamera();
    try {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("camera-reader");
        }
        const decodedText = await html5QrCode.scanFile(file, true);
        showScanResult(decodedText);
    } catch (err) {
        alert("No readable QR code found in this image.");
    }
}

// Camera Scanner
btnStartCamera.addEventListener('click', async () => {
    if (isCameraActive) {
        stopCamera();
        return;
    }

    cameraReader.style.display = 'block';
    btnStartCamera.textContent = 'Stop Camera';
    isCameraActive = true;

    try {
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("camera-reader");
        }

        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                showScanResult(decodedText);
                stopCamera();
            },
            (errorMessage) => {
                // scanning frame error (ignore)
            }
        );
    } catch (err) {
        alert("Camera permission denied or camera not available.");
        stopCamera();
    }
});

function stopCamera() {
    if (html5QrCode && isCameraActive) {
        html5QrCode.stop().then(() => {
            cameraReader.style.display = 'none';
            btnStartCamera.textContent = 'Start Camera';
            isCameraActive = false;
        }).catch(() => {
            cameraReader.style.display = 'none';
            btnStartCamera.textContent = 'Start Camera';
            isCameraActive = false;
        });
    }
}

function showScanResult(text) {
    scanResultText.textContent = text;
    scanResultCard.style.display = 'block';

    if (text.startsWith('http://') || text.startsWith('https://')) {
        btnOpenResult.style.display = 'inline-flex';
        btnOpenResult.onclick = () => window.open(text, '_blank');
    } else {
        btnOpenResult.style.display = 'none';
    }
}

btnCopyResult.addEventListener('click', () => {
    navigator.clipboard.writeText(scanResultText.textContent);
    const orig = btnCopyResult.textContent;
    btnCopyResult.textContent = '✔ Copied!';
    setTimeout(() => { btnCopyResult.textContent = orig; }, 1800);
});

// Initial QR Generation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateQr);
} else {
    updateQr();
}
