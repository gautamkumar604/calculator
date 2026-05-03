class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.history = [];
        this.soundEnabled = true;
        this.scientificMode = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadSettings();
        this.updateDisplay();
    }

    initializeElements() {
        // Display elements
        this.displayCurrent = document.getElementById('display-current');
        this.displayHistory = document.getElementById('display-history');
        
        // Buttons
        this.buttons = document.querySelectorAll('.btn');
        this.numberButtons = document.querySelectorAll('.btn-number');
        this.operatorButtons = document.querySelectorAll('.btn-operator');
        this.clearButton = document.querySelector('[data-action="clear"]');
        this.deleteButton = document.querySelector('[data-action="delete"]');
        this.equalsButton = document.querySelector('[data-action="equals"]');
        this.decimalButton = document.querySelector('[data-action="decimal"]');
        this.percentButton = document.querySelector('[data-action="percent"]');
        
        // Scientific buttons
        this.scientificButtons = document.querySelectorAll('.btn-scientific');
        this.scientificToggle = document.getElementById('scientific-toggle');
        this.scientificPanel = document.getElementById('scientific-buttons');
        
        // Control buttons
        this.themeToggle = document.getElementById('theme-toggle');
        this.historyToggle = document.getElementById('history-toggle');
        this.soundToggle = document.getElementById('sound-toggle');
        this.clearHistoryButton = document.getElementById('clear-history');
        
        // Panels
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');
    }

    initializeEventListeners() {
        // Number buttons
        this.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.playSound();
            });
        });

        // Operator buttons
        this.operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.dataset.action);
                this.playSound();
            });
        });

        // Action buttons
        this.clearButton.addEventListener('click', () => {
            this.clear();
            this.playSound();
        });

        this.deleteButton.addEventListener('click', () => {
            this.delete();
            this.playSound();
        });

        this.equalsButton.addEventListener('click', () => {
            this.calculate();
            this.playSound();
        });

        this.decimalButton.addEventListener('click', () => {
            this.appendDecimal();
            this.playSound();
        });

        this.percentButton.addEventListener('click', () => {
            this.percentage();
            this.playSound();
        });

        // Scientific buttons
        this.scientificButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleScientific(button.dataset.action);
                this.playSound();
            });
        });

        this.scientificToggle.addEventListener('click', () => {
            this.toggleScientificMode();
            this.playSound();
        });

        // Control buttons
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        this.historyToggle.addEventListener('click', () => {
            this.toggleHistory();
            this.playSound();
        });

        this.soundToggle.addEventListener('click', () => {
            this.toggleSound();
        });

        this.clearHistoryButton.addEventListener('click', () => {
            this.clearHistory();
            this.playSound();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Prevent zoom on double tap for mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentValue = '0';
            this.shouldResetScreen = false;
        }

        if (this.currentValue === '0') {
            this.currentValue = number;
        } else if (this.currentValue.length < 16) {
            this.currentValue += number;
        }

        this.updateDisplay();
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentValue = '0';
            this.shouldResetScreen = false;
        }

        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }

        this.updateDisplay();
    }

    handleOperator(operator) {
        if (this.operation !== null && !this.shouldResetScreen) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operation = operator;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    calculate() {
        if (this.operation === null || this.shouldResetScreen) return;

        let result;
        const previous = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        switch (this.operation) {
            case 'add':
                result = previous + current;
                break;
            case 'subtract':
                result = previous - current;
                break;
            case 'multiply':
                result = previous * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = previous / current;
                break;
            default:
                return;
        }

        // Add to history
        const expression = `${this.formatNumber(previous)} ${this.getOperatorSymbol(this.operation)} ${this.formatNumber(current)}`;
        this.addToHistory(expression, result);

        this.currentValue = this.formatResult(result);
        this.operation = null;
        this.previousValue = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    handleScientific(action) {
        const current = parseFloat(this.currentValue);
        let result;

        switch (action) {
            case 'sqrt':
                if (current < 0) {
                    this.showError('Invalid input');
                    return;
                }
                result = Math.sqrt(current);
                this.addToHistory(`√${this.formatNumber(current)}`, result);
                break;
            case 'power':
                result = current * current;
                this.addToHistory(`${this.formatNumber(current)}²`, result);
                break;
            case 'power-y':
                if (this.previousValue && this.operation === 'power-y') {
                    const base = parseFloat(this.previousValue);
                    result = Math.pow(base, current);
                    this.addToHistory(`${this.formatNumber(base)}^${this.formatNumber(current)}`, result);
                    this.operation = null;
                    this.previousValue = '';
                } else {
                    this.previousValue = this.currentValue;
                    this.operation = 'power-y';
                    this.shouldResetScreen = true;
                    this.updateDisplay();
                    return;
                }
                break;
            case 'log':
                if (current <= 0) {
                    this.showError('Invalid input');
                    return;
                }
                result = Math.log10(current);
                this.addToHistory(`log(${this.formatNumber(current)})`, result);
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError('Invalid input');
                    return;
                }
                result = Math.log(current);
                this.addToHistory(`ln(${this.formatNumber(current)})`, result);
                break;
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                this.addToHistory(`sin(${this.formatNumber(current)}°)`, result);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                this.addToHistory(`cos(${this.formatNumber(current)}°)`, result);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                this.addToHistory(`tan(${this.formatNumber(current)}°)`, result);
                break;
            case 'pi':
                this.currentValue = Math.PI.toString();
                this.updateDisplay();
                return;
            case 'e':
                this.currentValue = Math.E.toString();
                this.updateDisplay();
                return;
            case 'factorial':
                if (current < 0 || current !== Math.floor(current)) {
                    this.showError('Invalid input');
                    return;
                }
                result = this.factorial(current);
                this.addToHistory(`${this.formatNumber(current)}!`, result);
                break;
            case 'reciprocal':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = 1 / current;
                this.addToHistory(`1/${this.formatNumber(current)}`, result);
                break;
            default:
                return;
        }

        this.currentValue = this.formatResult(result);
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    percentage() {
        const current = parseFloat(this.currentValue);
        this.currentValue = this.formatResult(current / 100);
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    delete() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.displayCurrent.textContent = this.formatNumber(this.currentValue);
        
        if (this.operation && this.previousValue) {
            const operatorSymbol = this.getOperatorSymbol(this.operation);
            this.displayHistory.textContent = `${this.formatNumber(this.previousValue)} ${operatorSymbol}`;
        } else {
            this.displayHistory.textContent = '';
        }
    }

    formatNumber(num) {
        const number = typeof num === 'string' ? parseFloat(num) : num;
        
        if (isNaN(number)) return '0';
        
        // Handle very large or very small numbers
        if (Math.abs(number) >= 1e10 || (Math.abs(number) < 1e-10 && number !== 0)) {
            return number.toExponential(6);
        }
        
        // Handle regular numbers
        const rounded = Math.round(number * 100000000) / 100000000;
        return rounded.toLocaleString('en-US', {
            maximumFractionDigits: 8,
            minimumFractionDigits: 0
        });
    }

    formatResult(result) {
        if (isNaN(result) || !isFinite(result)) {
            return 'Error';
        }
        return result.toString();
    }

    getOperatorSymbol(operator) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[operator] || '';
    }

    showError(message) {
        this.currentValue = message;
        this.updateDisplay();
        this.shouldResetScreen = true;
        
        setTimeout(() => {
            this.clear();
        }, 2000);
    }

    handleKeyboard(e) {
        e.preventDefault();
        
        // Numbers
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
            this.playSound();
        }
        
        // Decimal
        else if (e.key === '.') {
            this.appendDecimal();
            this.playSound();
        }
        
        // Operators
        else if (e.key === '+') {
            this.handleOperator('add');
            this.playSound();
        }
        else if (e.key === '-') {
            this.handleOperator('subtract');
            this.playSound();
        }
        else if (e.key === '*') {
            this.handleOperator('multiply');
            this.playSound();
        }
        else if (e.key === '/') {
            this.handleOperator('divide');
            this.playSound();
        }
        
        // Equals
        else if (e.key === 'Enter' || e.key === '=') {
            this.calculate();
            this.playSound();
        }
        
        // Clear
        else if (e.key === 'Escape') {
            this.clear();
            this.playSound();
        }
        
        // Delete/Backspace
        else if (e.key === 'Backspace') {
            this.delete();
            this.playSound();
        }
        
        // Percentage
        else if (e.key === '%') {
            this.percentage();
            this.playSound();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('calculator-theme', newTheme);
    }

    toggleHistory() {
        this.historyPanel.classList.toggle('active');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggle.style.opacity = this.soundEnabled ? '1' : '0.5';
        localStorage.setItem('calculator-sound', this.soundEnabled.toString());
    }

    toggleScientificMode() {
        this.scientificMode = !this.scientificMode;
        this.scientificPanel.classList.toggle('active');
        this.scientificToggle.classList.toggle('active');
        localStorage.setItem('calculator-scientific', this.scientificMode.toString());
    }

    playSound() {
        if (!this.soundEnabled) return;
        
        // Create a simple click sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: this.formatNumber(result),
            timestamp: new Date().toISOString()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            
            historyElement.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            `;
            
            historyElement.addEventListener('click', () => {
                this.currentValue = item.result.replace(/,/g, '');
                this.updateDisplay();
                this.playSound();
            });
            
            this.historyList.appendChild(historyElement);
        });
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        localStorage.setItem('calculator-history', JSON.stringify(this.history));
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('calculator-history');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.renderHistory();
        }
    }

    loadSettings() {
        // Load theme
        const savedTheme = localStorage.getItem('calculator-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        // Load sound setting
        const savedSound = localStorage.getItem('calculator-sound');
        if (savedSound !== null) {
            this.soundEnabled = savedSound === 'true';
            this.soundToggle.style.opacity = this.soundEnabled ? '1' : '0.5';
        }
        
        // Load scientific mode
        const savedScientific = localStorage.getItem('calculator-scientific');
        if (savedScientific !== null) {
            this.scientificMode = savedScientific === 'true';
            if (this.scientificMode) {
                this.scientificPanel.classList.add('active');
                this.scientificToggle.classList.add('active');
            }
        }
        
        // Load history
        this.loadHistory();
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Service Worker for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
