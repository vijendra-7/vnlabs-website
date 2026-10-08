// Official GATE Virtual Scientific Calculator Engine

const calcDisplay = document.getElementById('calc-display');
const calcExpr = document.getElementById('calc-expr');
const modeDeg = document.getElementById('mode-deg');
const modeRad = document.getElementById('mode-rad');
const btnThemeToggle = document.getElementById('btn-theme-toggle');

let currentValue = '0';
let expressionString = '';
let memoryValue = 0;
let isNewNumber = true;
let pendingOp = null;
let pendingOperand = null;

// Theme Toggle
btnThemeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('theme-tcs')) {
        document.body.classList.remove('theme-tcs');
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-tcs');
    }
});

function isDegreeMode() {
    return modeDeg.checked;
}

function updateDisplay() {
    calcDisplay.value = currentValue;
    calcExpr.value = expressionString;
}

function appendDigit(digit) {
    if (isNewNumber) {
        currentValue = (digit === '.') ? '0.' : digit;
        isNewNumber = false;
    } else {
        if (digit === '.' && currentValue.includes('.')) return;
        currentValue = currentValue + digit;
    }
    updateDisplay();
}

function clearAll() {
    currentValue = '0';
    expressionString = '';
    pendingOp = null;
    pendingOperand = null;
    isNewNumber = true;
    updateDisplay();
}

function backspace() {
    if (isNewNumber) return;
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
        isNewNumber = true;
    }
    updateDisplay();
}

function toggleSign() {
    const val = parseFloat(currentValue);
    if (!isNaN(val) && val !== 0) {
        currentValue = String(-val);
        updateDisplay();
    }
}

function factorial(n) {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

// Unary Functions
function applyFunction(func) {
    const val = parseFloat(currentValue);
    if (isNaN(val)) return;

    let res = 0;
    const isDeg = isDegreeMode();
    const toRad = (d) => d * (Math.PI / 180);
    const toDeg = (r) => r * (180 / Math.PI);

    switch (func) {
        case 'sin':
            res = isDeg ? Math.sin(toRad(val)) : Math.sin(val);
            if (isDeg && val % 180 === 0) res = 0;
            break;
        case 'cos':
            res = isDeg ? Math.cos(toRad(val)) : Math.cos(val);
            if (isDeg && (val - 90) % 180 === 0) res = 0;
            break;
        case 'tan':
            res = isDeg ? Math.tan(toRad(val)) : Math.tan(val);
            break;
        case 'asin':
            res = Math.asin(val);
            if (isDeg) res = toDeg(res);
            break;
        case 'acos':
            res = Math.acos(val);
            if (isDeg) res = toDeg(res);
            break;
        case 'atan':
            res = Math.atan(val);
            if (isDeg) res = toDeg(res);
            break;
        case 'sinh':
            res = Math.sinh(val);
            break;
        case 'cosh':
            res = Math.cosh(val);
            break;
        case 'tanh':
            res = Math.tanh(val);
            break;
        case 'asinh':
            res = Math.asinh(val);
            break;
        case 'acosh':
            res = Math.acosh(val);
            break;
        case 'atanh':
            res = Math.atanh(val);
            break;
        case 'log':
            res = Math.log10(val);
            break;
        case 'ln':
            res = Math.log(val);
            break;
        case 'log2':
            res = Math.log2(val);
            break;
        case 'ex':
        case 'exp':
            res = Math.exp(val);
            break;
        case 'exp10':
            res = Math.pow(10, val);
            break;
        case 'sqr':
            res = val * val;
            break;
        case 'cube':
            res = val * val * val;
            break;
        case 'sqrt':
            res = Math.sqrt(val);
            break;
        case 'cbrt':
            res = Math.cbrt(val);
            break;
        case 'inv':
            res = 1 / val;
            break;
        case 'fact':
            res = factorial(val);
            break;
        case 'abs':
            res = Math.abs(val);
            break;
        case 'pi':
            res = Math.PI;
            break;
        case 'e':
            res = Math.E;
            break;
        case 'percent':
            res = val / 100;
            break;
        default:
            return;
    }

    if (isNaN(res) || !isFinite(res)) {
        currentValue = "Invalid Input";
    } else {
        currentValue = parseFloat(res.toFixed(10)).toString();
    }
    isNewNumber = true;
    updateDisplay();
}

// Binary Operations (+, -, *, /, mod, xy, yroot, logyx)
function setOperator(op) {
    const val = parseFloat(currentValue);

    if (pendingOp && !isNewNumber) {
        computeResult();
    } else {
        pendingOperand = val;
    }

    pendingOp = op;
    isNewNumber = true;
    expressionString = `${pendingOperand} ${op}`;
    updateDisplay();
}

function computeResult() {
    if (pendingOp === null || pendingOperand === null) return;

    const op2 = parseFloat(currentValue);
    let result = 0;

    switch (pendingOp) {
        case '+':
            result = pendingOperand + op2;
            break;
        case '-':
            result = pendingOperand - op2;
            break;
        case '*':
            result = pendingOperand * op2;
            break;
        case '/':
            if (op2 === 0) {
                currentValue = "Cannot divide by zero";
                pendingOp = null;
                pendingOperand = null;
                isNewNumber = true;
                updateDisplay();
                return;
            }
            result = pendingOperand / op2;
            break;
        case 'mod':
            result = pendingOperand % op2;
            break;
        case 'xy':
            result = Math.pow(pendingOperand, op2);
            break;
        case 'yroot':
            result = Math.pow(pendingOperand, 1 / op2);
            break;
        case 'logyx':
            result = Math.log(pendingOperand) / Math.log(op2);
            break;
        default:
            return;
    }

    expressionString = `${pendingOperand} ${pendingOp} ${op2} =`;
    currentValue = parseFloat(result.toFixed(10)).toString();
    pendingOperand = result;
    pendingOp = null;
    isNewNumber = true;
    updateDisplay();
}

// Memory Operations
function handleMemory(action) {
    const val = parseFloat(currentValue) || 0;
    switch (action) {
        case 'mc':
            memoryValue = 0;
            break;
        case 'mr':
            currentValue = String(memoryValue);
            isNewNumber = true;
            updateDisplay();
            break;
        case 'ms':
            memoryValue = val;
            isNewNumber = true;
            break;
        case 'mplus':
            memoryValue += val;
            isNewNumber = true;
            break;
        case 'mminus':
            memoryValue -= val;
            isNewNumber = true;
            break;
    }
}

// Keypad Clicks
document.querySelectorAll('.btn-calc').forEach(button => {
    button.addEventListener('click', () => {
        const num = button.dataset.num;
        const action = button.dataset.action;
        const op = button.dataset.op;

        if (num !== undefined) {
            appendDigit(num);
        } else if (op !== undefined) {
            setOperator(op);
        } else if (action !== undefined) {
            if (action === 'c') clearAll();
            else if (action === 'backspace') backspace();
            else if (action === 'sign') toggleSign();
            else if (action === 'equals') computeResult();
            else if (['mc', 'mr', 'ms', 'mplus', 'mminus'].includes(action)) handleMemory(action);
            else if (['mod', 'xy', 'yroot', 'logyx'].includes(action)) setOperator(action);
            else applyFunction(action);
        }
    });
});

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendDigit(e.key);
    } else if (e.key === '.') {
        appendDigit('.');
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        setOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        computeResult();
    } else if (e.key === 'Backspace') {
        backspace();
    } else if (e.key === 'Escape') {
        clearAll();
    }
});
