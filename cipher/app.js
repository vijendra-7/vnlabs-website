document.addEventListener('DOMContentLoaded', () => {
    const tabEncrypt = document.getElementById('tab-encrypt');
    const tabDecrypt = document.getElementById('tab-decrypt');
    const contentEncrypt = document.getElementById('content-encrypt');
    const contentDecrypt = document.getElementById('content-decrypt');
    
    const encryptText = document.getElementById('encrypt-text');
    const encryptPassword = document.getElementById('encrypt-password');
    const btnEncrypt = document.getElementById('btn-encrypt');
    
    const decryptText = document.getElementById('decrypt-text');
    const decryptPassword = document.getElementById('decrypt-password');
    const btnDecrypt = document.getElementById('btn-decrypt');
    
    const resultBox = document.getElementById('result-box');
    const resultContent = document.getElementById('result-content');
    const resultLabel = document.getElementById('result-label');
    const btnCopy = document.getElementById('btn-copy');
    const errorBox = document.getElementById('error-box');

    // Tab Switching
    tabEncrypt.addEventListener('click', () => {
        tabEncrypt.classList.add('active');
        tabDecrypt.classList.remove('active');
        contentEncrypt.style.display = 'block';
        contentDecrypt.style.display = 'none';
        hideResult();
    });

    tabDecrypt.addEventListener('click', () => {
        tabDecrypt.classList.add('active');
        tabEncrypt.classList.remove('active');
        contentDecrypt.style.display = 'block';
        contentEncrypt.style.display = 'none';
        hideResult();
    });

    // Copy Button
    btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(resultContent.textContent);
        btnCopy.textContent = 'Copied!';
        setTimeout(() => btnCopy.textContent = 'Copy', 2000);
    });

    function hideResult() {
        resultBox.style.display = 'none';
        errorBox.style.display = 'none';
    }

    function showError(msg) {
        resultBox.style.display = 'none';
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    }

    function showResult(text, labelStr, color) {
        errorBox.style.display = 'none';
        resultContent.textContent = text;
        resultLabel.textContent = labelStr;
        resultLabel.style.color = color;
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Crypto Utils ---
    
    // Convert string to ArrayBuffer
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    // Derive AES key from password
    async function deriveKey(password, salt) {
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );
        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }

    // ArrayBuffer to Base64
    function bufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // Base64 to ArrayBuffer
    function base64ToBuffer(b64) {
        const binary = window.atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // --- Encrypt ---
    btnEncrypt.addEventListener('click', async () => {
        const text = encryptText.value.trim();
        const pwd = encryptPassword.value;
        if (!text || !pwd) {
            showError("Please enter both a message and a password.");
            return;
        }

        try {
            btnEncrypt.disabled = true;
            btnEncrypt.innerHTML = 'Encrypting...';

            // Generate random salt and IV
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const key = await deriveKey(pwd, salt);
            
            const encryptedContent = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                enc.encode(text)
            );

            // Combine salt, iv, and ciphertext into one buffer
            const encryptedBytes = new Uint8Array(encryptedContent);
            const packageBytes = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
            packageBytes.set(salt, 0);
            packageBytes.set(iv, salt.length);
            packageBytes.set(encryptedBytes, salt.length + iv.length);

            const b64Token = "VNC:" + bufferToBase64(packageBytes.buffer);

            showResult(b64Token, "Encrypted Ciphertext", "var(--cyan)");

        } catch (err) {
            console.error(err);
            showError("Encryption failed.");
        } finally {
            btnEncrypt.disabled = false;
            btnEncrypt.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Encrypt Message';
        }
    });

    // --- Decrypt ---
    btnDecrypt.addEventListener('click', async () => {
        let b64Token = decryptText.value.trim();
        const pwd = decryptPassword.value;
        if (!b64Token || !pwd) {
            showError("Please enter both the ciphertext and the password.");
            return;
        }

        if (b64Token.startsWith("VNC:")) {
            b64Token = b64Token.substring(4);
        }

        try {
            btnDecrypt.disabled = true;
            btnDecrypt.innerHTML = 'Decrypting...';

            const packageBuffer = base64ToBuffer(b64Token);
            const packageBytes = new Uint8Array(packageBuffer);

            // Extract salt (16), iv (12), and ciphertext
            if (packageBytes.length < 28) throw new Error("Invalid ciphertext format.");
            
            const salt = packageBytes.slice(0, 16);
            const iv = packageBytes.slice(16, 28);
            const ciphertext = packageBytes.slice(28);

            const key = await deriveKey(pwd, salt);

            const decryptedContent = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );

            const originalText = dec.decode(decryptedContent);
            showResult(originalText, "Decrypted Secret", "var(--purple)");

        } catch (err) {
            console.error(err);
            showError("Decryption failed. Incorrect password or corrupted ciphertext.");
        } finally {
            btnDecrypt.disabled = false;
            btnDecrypt.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg> Decrypt Message';
        }
    });
});
