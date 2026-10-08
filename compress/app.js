document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const originalMeta = document.getElementById('original-meta');
    const btnRemove = document.getElementById('btn-remove');
    
    const targetSizeInput = document.getElementById('target-size');
    const maxWidthInput = document.getElementById('max-width');
    const maxHeightInput = document.getElementById('max-height');
    const outputFormatSelect = document.getElementById('output-format');
    const resizeModeSelect = document.getElementById('resize-mode');
    const padColorContainer = document.getElementById('pad-color-container');
    const padColorPicker = document.getElementById('pad-color-picker');
    const quickColors = document.querySelectorAll('.quick-color');
    
    const btnCompress = document.getElementById('btn-compress');
    const resultArea = document.getElementById('result-area');
    const newSizeVal = document.getElementById('new-size-val');
    const savedVal = document.getElementById('saved-val');
    const btnDownload = document.getElementById('btn-download');

    let currentFile = null;
    let originalImageObj = null;
    let finalBlob = null;

    // --- Drag & Drop ---
    
    resizeModeSelect.addEventListener('change', () => {
        if (resizeModeSelect.value === 'pad') {
            padColorContainer.style.display = 'block';
        } else {
            padColorContainer.style.display = 'none';
        }
    });

    quickColors.forEach(qc => {
        qc.addEventListener('click', () => {
            padColorPicker.value = qc.getAttribute('data-color');
        });
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('click', (e) => {
        // Clear value before selection so the same file can trigger 'change'
        e.target.value = '';
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    btnRemove.addEventListener('click', resetUI);

    function handleFile(file) {
        if (file.type && !file.type.startsWith('image/')) {
            alert('Please select an image file (JPEG, PNG, WebP).');
            return;
        }

        currentFile = file;
        
        // Auto-select best output format based on input
        if (file.type === 'image/png') outputFormatSelect.value = 'image/png';
        else outputFormatSelect.value = 'image/jpeg';

        const sizeKb = (file.size / 1024).toFixed(1);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImageObj = img;
                originalMeta.innerHTML = `Original: <strong>${sizeKb} KB</strong> <br> ${img.width}x${img.height} px`;
                
                // Pre-fill max dimensions
                maxWidthInput.value = img.width;
                maxHeightInput.value = img.height;
                
                imagePreview.src = e.target.result;
                dropzone.style.display = 'none';
                previewContainer.style.display = 'block';
                btnCompress.disabled = false;
                resultArea.style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function resetUI() {
        currentFile = null;
        originalImageObj = null;
        finalBlob = null;
        fileInput.value = '';
        dropzone.style.display = 'flex';
        previewContainer.style.display = 'none';
        btnCompress.disabled = true;
        resultArea.style.display = 'none';
    }

    // --- Compression Logic ---
    btnCompress.addEventListener('click', async () => {
        if (!originalImageObj) return;
        
        btnCompress.innerHTML = 'Compressing...';
        btnCompress.disabled = true;
        
        // Give UI time to update
        setTimeout(async () => {
            await performCompression();
            btnCompress.innerHTML = 'Compress Image';
            btnCompress.disabled = false;
        }, 50);
    });

    async function performCompression() {
        let maxWidth = parseInt(maxWidthInput.value) || originalImageObj.width;
        let maxHeight = parseInt(maxHeightInput.value) || originalImageObj.height;
        const targetKb = parseFloat(targetSizeInput.value) || 0;
        const mimeType = outputFormatSelect.value;
        const resizeMode = resizeModeSelect.value;
        const padColor = padColorPicker.value;
        
        let canvasWidth = maxWidth;
        let canvasHeight = maxHeight;
        let drawX = 0, drawY = 0, drawW = maxWidth, drawH = maxHeight;

        const imgW = originalImageObj.width;
        const imgH = originalImageObj.height;
        const imgRatio = imgW / imgH;
        const canvasRatio = maxWidth / maxHeight;

        if (resizeMode === 'fit') {
            // Standard fit (shrinks canvas to fit image exactly without padding or cropping)
            if (imgW > maxWidth || imgH > maxHeight) {
                if (imgRatio > canvasRatio) {
                    canvasHeight = Math.round(maxWidth / imgRatio);
                } else {
                    canvasWidth = Math.round(maxHeight * imgRatio);
                }
            } else {
                canvasWidth = imgW;
                canvasHeight = imgH;
            }
            drawW = canvasWidth;
            drawH = canvasHeight;
        } 
        else if (resizeMode === 'crop') {
            // Fill exact dimensions, crop excess
            if (imgRatio > canvasRatio) {
                // Image is wider than canvas
                drawH = maxHeight;
                drawW = Math.round(maxHeight * imgRatio);
                drawX = Math.round((maxWidth - drawW) / 2);
            } else {
                // Image is taller than canvas
                drawW = maxWidth;
                drawH = Math.round(maxWidth / imgRatio);
                drawY = Math.round((maxHeight - drawH) / 2);
            }
        } 
        else if (resizeMode === 'pad') {
            // Canvas stays exactly maxWidth x maxHeight, image shrinks to fit inside
            if (imgRatio > canvasRatio) {
                // Image is wider
                drawW = maxWidth;
                drawH = Math.round(maxWidth / imgRatio);
                drawY = Math.round((maxHeight - drawH) / 2);
            } else {
                // Image is taller
                drawH = maxHeight;
                drawW = Math.round(maxHeight * imgRatio);
                drawX = Math.round((maxWidth - drawW) / 2);
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        
        if (resizeMode === 'pad') {
            ctx.fillStyle = padColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Drawing to canvas automatically strips EXIF data for privacy!
        ctx.drawImage(originalImageObj, drawX, drawY, drawW, drawH);

        let resultBlob = null;

        if (targetKb > 0 && mimeType !== 'image/png') {
            // Smart Binary Search for exact target size (JPEG/WebP only)
            const targetBytes = targetKb * 1024;
            let minQ = 0.0;
            let maxQ = 1.0;
            let bestBlob = null;
            let bestDiff = Infinity;

            // Try 7 iterations of binary search to find perfect quality
            for (let i = 0; i < 7; i++) {
                let midQ = (minQ + maxQ) / 2;
                let blob = await canvasToBlob(canvas, mimeType, midQ);
                
                let diff = targetBytes - blob.size;
                
                // If under target size, it's a valid candidate
                if (diff >= 0 && diff < bestDiff) {
                    bestBlob = blob;
                    bestDiff = diff;
                    minQ = midQ; // try higher quality
                } else {
                    // Over target size, need lower quality
                    maxQ = midQ; 
                }
            }
            
            // If we couldn't get it under, just use the lowest quality we tried
            if (!bestBlob) {
                bestBlob = await canvasToBlob(canvas, mimeType, 0.1);
            }
            resultBlob = bestBlob;
        } else {
            // Standard compression
            let quality = mimeType === 'image/png' ? undefined : 0.8;
            resultBlob = await canvasToBlob(canvas, mimeType, quality);
        }

        finalBlob = resultBlob;
        showResult();
    }

    function canvasToBlob(canvas, mimeType, quality) {
        return new Promise(resolve => {
            canvas.toBlob(resolve, mimeType, quality);
        });
    }

    function showResult() {
        if (!finalBlob) return;
        
        const newKb = (finalBlob.size / 1024).toFixed(1);
        const oldKb = (currentFile.size / 1024).toFixed(1);
        let savedPercent = ((1 - (finalBlob.size / currentFile.size)) * 100).toFixed(1);
        
        if (savedPercent < 0) savedPercent = 0; // sometimes pngs get bigger

        newSizeVal.textContent = newKb + ' KB';
        savedVal.textContent = savedPercent + '%';
        savedVal.style.color = savedPercent > 0 ? 'var(--emerald)' : 'var(--text-muted)';
        
        resultArea.style.display = 'block';
        
        // Scroll to result on mobile
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Download ---
    btnDownload.addEventListener('click', () => {
        if (!finalBlob) return;
        
        const extension = outputFormatSelect.value.split('/')[1];
        let originalName = currentFile.name;
        let baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        
        const fileName = \`\${baseName}_vncompressed.\${extension}\`;
        
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    });
});
