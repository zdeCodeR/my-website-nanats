const loading = document.getElementById('loading');
const intro = document.getElementById('intro');
const main = document.getElementById('main');
const audio = document.getElementById('audio');
const themeIcon = document.getElementById('themeIcon');

const texts = ["Hello, I'm Azam Tukam.", "welcome to my website."];

function typeText(el, words) {
  let index = 0, char = 0, isComplete = false;
  function type() {
    if (!isComplete && index < words.length) {
      if (char <= words[index].length) {
        el.textContent = words[index].slice(0, char++);
        setTimeout(type, 80);
      } else {
        index++; char = 0;
        setTimeout(type, 1000);
      }
    } else if (!isComplete) {
      isComplete = true;
      el.innerHTML += "<br><span style='color: rgba(255, 255, 255, 0.9); font-weight: 500;'>Transforming Ideas into Digital Solutions</span>";
    }
  }
  type();
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  localStorage.setItem('theme', newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

window.onload = () => {
  loadTheme();
  setTimeout(() => {
    loading.style.display = 'none';
    intro.style.display = 'block';
    typeText(document.getElementById("introTyping"), texts);
  }, 4000);
};

function goToMain() {
  intro.style.display = 'none';
  main.style.display = 'block';
  audio.play().catch(e => console.log('Audio autoplay prevented'));
  typeText(document.getElementById("mainTyping"), texts);
}

function showSection(section) {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  document.getElementById(section).style.display = 'block';
}

function backToMain() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  main.style.display = 'block';
}

function copyNumber(number) {
  navigator.clipboard.writeText(number).then(() => {
    showNotification(`<i class="fas fa-check-circle"></i> Number copied: ${number}`);
  }).catch(() => {
    showNotification(`<i class="fas fa-exclamation-circle"></i> Failed to copy. Please copy manually: ${number}`);
  });
}

function downloadQRIS() {
  const qrisImage = document.getElementById('qrisImage');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const link = document.createElement('a');
    link.download = 'IMG-QRIS-Payment.png';
    link.href = canvas.toDataURL();
    link.click();
    
    showNotification(`<i class="fas fa-download"></i> QRIS downloaded successfully!`);
  };
  
  img.src = qrisImage.src;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'notificationSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1) reverse';
    setTimeout(() => notification.remove(), 600);
  }, 3000);
}

// ===== 🔍 NIK PARSER FUNCTIONS =====
function showNIKParser() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const nikParserHTML = `
    <div class="section-title">
      <i class="fas fa-id-card"></i>
      NIK Parser Tools
    </div>
    
    <div class="nik-container">
      <div class="nik-input-section">
        <label for="nikInput" class="nik-label">Enter NIK Number</label>
        <input type="text" id="nikInput" placeholder="Enter 16-digit NIK" maxlength="16" class="nik-input">
        <button onclick="parseNIK()" class="btn-primary nik-button">
          <i class="fas fa-search"></i> Parse NIK
        </button>
      </div>
      
      <div class="nik-result-section">
        <div class="nik-result-header">
          <strong>Parsing Result</strong>
          <button onclick="copyNIKResult()" class="btn-secondary">
            <i class="fas fa-copy"></i> Copy Result
          </button>
        </div>
        <div id="nikResult" class="nik-result"></div>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const nikSection = document.getElementById('nikparser');
  nikSection.innerHTML = nikParserHTML;
  nikSection.style.display = 'block';
}

function parseNIK() {
  const nik = document.getElementById('nikInput').value;
  const resultDiv = document.getElementById('nikResult');
  
  if (!nik) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter a NIK number</div>';
    return;
  }
  
  if (nik.length !== 16) {
    resultDiv.innerHTML = '<div class="nik-error">NIK must be 16 digits</div>';
    return;
  }
  
  // Simple NIK parsing logic (bisa diganti dengan library yang lebih advanced)
  try {
    const provinceCode = nik.substring(0, 2);
    const regencyCode = nik.substring(2, 4);
    const districtCode = nik.substring(4, 6);
    const birthDate = nik.substring(6, 12);
    const uniqueCode = nik.substring(12, 16);
    
    // Parse birth date
    const day = parseInt(birthDate.substring(0, 2));
    const month = parseInt(birthDate.substring(2, 4));
    const year = parseInt(birthDate.substring(4, 6));
    
    const fullYear = year + (year < 25 ? 2000 : 1900);
    const gender = day > 40 ? 'Female' : 'Male';
    const actualDay = day > 40 ? day - 40 : day;
    
    const result = {
      "NIK": nik,
      "Province Code": provinceCode,
      "Regency Code": regencyCode,
      "District Code": districtCode,
      "Birth Info": {
        "Date": `${actualDay.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${fullYear}`,
        "Day": actualDay,
        "Month": month,
        "Year": fullYear,
        "Gender": gender
      },
      "Unique Code": uniqueCode
    };
    
    resultDiv.innerHTML = `<pre class="nik-success">${JSON.stringify(result, null, 2)}</pre>`;
    resultDiv.classList.add('fade-in');
    
  } catch (error) {
    resultDiv.innerHTML = '<div class="nik-error">Error parsing NIK. Please check the format.</div>';
  }
}

function copyNIKResult() {
  const resultText = document.getElementById('nikResult').innerText;
  if (!resultText || resultText.includes('Please enter') || resultText.includes('Error')) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> No valid result to copy');
    return;
  }
  
  navigator.clipboard.writeText(resultText).then(() => {
    showNotification('<i class="fas fa-check"></i> NIK result copied to clipboard!');
  }).catch(err => {
    showNotification('<i class="fas fa-times"></i> Failed to copy result');
  });
    }

// ===== 🔐 PASSWORD GENERATOR =====
function showPasswordGenerator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const passwordHTML = `
    <div class="section-title">
      <i class="fas fa-key"></i>
      Password Generator
    </div>
    
    <div class="tool-container">
      <div class="password-settings">
        <div class="setting-group">
          <label class="setting-label">Password Length</label>
          <input type="range" id="lengthSlider" min="8" max="32" value="12" class="slider">
          <span id="lengthValue" class="value-display">12</span>
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Uppercase</label>
          <input type="checkbox" id="uppercase" checked class="checkbox">
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Lowercase</label>
          <input type="checkbox" id="lowercase" checked class="checkbox">
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Numbers</label>
          <input type="checkbox" id="numbers" checked class="checkbox">
        </div>
        
        <div class="setting-group">
          <label class="setting-label">Include Symbols</label>
          <input type="checkbox" id="symbols" checked class="checkbox">
        </div>
      </div>
      
      <button onclick="generatePassword()" class="btn-primary generate-btn">
        <i class="fas fa-bolt"></i> Generate Password
      </button>
      
      <div class="password-result">
        <input type="text" id="passwordOutput" readonly class="password-output">
        <button onclick="copyPassword()" class="btn-secondary copy-btn">
          <i class="fas fa-copy"></i>
        </button>
      </div>
      
      <div class="password-strength">
        <div class="strength-bar">
          <div id="strengthFill" class="strength-fill"></div>
        </div>
        <span id="strengthText" class="strength-text">Strength: Medium</span>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const passSection = document.getElementById('passwordgenerator');
  passSection.innerHTML = passwordHTML;
  passSection.style.display = 'block';
  
  // Update slider value
  document.getElementById('lengthSlider').addEventListener('input', function() {
    document.getElementById('lengthValue').textContent = this.value;
  });
}

function generatePassword() {
  const length = parseInt(document.getElementById('lengthSlider').value);
  const uppercase = document.getElementById('uppercase').checked;
  const lowercase = document.getElementById('lowercase').checked;
  const numbers = document.getElementById('numbers').checked;
  const symbols = document.getElementById('symbols').checked;
  
  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };
  
  let charPool = '';
  if (uppercase) charPool += chars.uppercase;
  if (lowercase) charPool += chars.lowercase;
  if (numbers) charPool += chars.numbers;
  if (symbols) charPool += chars.symbols;
  
  if (!charPool) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Select at least one character type');
    return;
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charPool.charAt(Math.floor(Math.random() * charPool.length));
  }
  
  document.getElementById('passwordOutput').value = password;
  updatePasswordStrength(password);
}

function copyPassword() {
  const password = document.getElementById('passwordOutput').value;
  if (!password) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> No password to copy');
    return;
  }
  
  navigator.clipboard.writeText(password).then(() => {
    showNotification('<i class="fas fa-check"></i> Password copied!');
  });
}

function updatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 12) strength += 25;
  if (password.match(/[a-z]/)) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 15;
  if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
  
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  strengthFill.style.width = strength + '%';
  
  if (strength >= 80) {
    strengthFill.style.background = '#4ecdc4';
    strengthText.textContent = 'Strength: Strong';
  } else if (strength >= 60) {
    strengthFill.style.background = '#ffd93d';
    strengthText.textContent = 'Strength: Good';
  } else if (strength >= 40) {
    strengthFill.style.background = '#ff9f43';
    strengthText.textContent = 'Strength: Medium';
  } else {
    strengthFill.style.background = '#ff6b6b';
    strengthText.textContent = 'Strength: Weak';
  }
}

// ===== 🔐 TEXT ENCRYPTION =====
function showTextEncryption() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const encryptionHTML = `
    <div class="section-title">
      <i class="fas fa-lock"></i>
      Text Encryption
    </div>
    
    <div class="tool-container">
      <div class="encryption-tabs">
        <button class="tab-btn active" onclick="switchEncryptionTab('base64')">Base64</button>
        <button class="tab-btn" onclick="switchEncryptionTab('caesar')">Caesar Cipher</button>
      </div>
      
      <div id="base64Tab" class="tab-content active">
        <textarea id="base64Input" placeholder="Enter text to encode/decode..." class="text-area"></textarea>
        <div class="encryption-buttons">
          <button onclick="base64Encode()" class="btn-primary">
            <i class="fas fa-lock"></i> Encode
          </button>
          <button onclick="base64Decode()" class="btn-secondary">
            <i class="fas fa-unlock"></i> Decode
          </button>
        </div>
        <textarea id="base64Output" readonly placeholder="Result will appear here..." class="text-area output"></textarea>
      </div>
      
      <div id="caesarTab" class="tab-content">
        <div class="caesar-controls">
          <label class="setting-label">Shift Amount</label>
          <input type="number" id="caesarShift" min="1" max="25" value="3" class="number-input">
        </div>
        <textarea id="caesarInput" placeholder="Enter text to encrypt/decrypt..." class="text-area"></textarea>
        <div class="encryption-buttons">
          <button onclick="caesarEncrypt()" class="btn-primary">
            <i class="fas fa-lock"></i> Encrypt
          </button>
          <button onclick="caesarDecrypt()" class="btn-secondary">
            <i class="fas fa-unlock"></i> Decrypt
          </button>
        </div>
        <textarea id="caesarOutput" readonly placeholder="Result will appear here..." class="text-area output"></textarea>
      </div>
      
      <button onclick="copyEncryptionResult()" class="btn-secondary">
        <i class="fas fa-copy"></i> Copy Result
      </button>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const encryptSection = document.getElementById('textencryption');
  encryptSection.innerHTML = encryptionHTML;
  encryptSection.style.display = 'block';
}

function switchEncryptionTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabName + 'Tab').classList.add('active');
}

function base64Encode() {
  const input = document.getElementById('base64Input').value;
  const encoded = btoa(unescape(encodeURIComponent(input)));
  document.getElementById('base64Output').value = encoded;
}

function base64Decode() {
  const input = document.getElementById('base64Input').value;
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    document.getElementById('base64Output').value = decoded;
  } catch (error) {
    document.getElementById('base64Output').value = 'Error: Invalid Base64 input';
  }
}

function caesarEncrypt() {
  const input = document.getElementById('caesarInput').value;
  const shift = parseInt(document.getElementById('caesarShift').value);
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    if (char.match(/[a-z]/i)) {
      const code = input.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    }
    result += char;
  }
  
  document.getElementById('caesarOutput').value = result;
}

function caesarDecrypt() {
  const input = document.getElementById('caesarInput').value;
  const shift = parseInt(document.getElementById('caesarShift').value);
  let result = '';
  
  for (let i = 0; i < input.length; i++) {
    let char = input[i];
    if (char.match(/[a-z]/i)) {
      const code = input.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
    }
    result += char;
  }
  
  document.getElementById('caesarOutput').value = result;
}

function copyEncryptionResult() {
  const activeTab = document.querySelector('.tab-content.active');
  const output = activeTab.querySelector('.output').value;
  
  if (!output) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> No result to copy');
    return;
  }
  
  navigator.clipboard.writeText(output).then(() => {
    showNotification('<i class="fas fa-check"></i> Result copied!');
  });
}

// ===== KALKULATOR =====
function showCalculator() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const calculatorHTML = `
    <div class="section-title">
      <i class="fas fa-calculator"></i>
      Calculator
    </div>
    
    <div class="calculator-container">
      <input type="text" placeholder="0" id="output-screen" readonly>
      <div class="calculator-buttons">
        <button onclick="calcClr()" class="calc-btn">CL</button>
        <button onclick="calcDel()" class="calc-btn">DEL</button>
        <button onclick="calcDisplay('%')" class="calc-btn">%</button>
        <button onclick="calcDisplay('/')" class="calc-btn">/</button>
        <button onclick="calcDisplay('7')" class="calc-btn">7</button>
        <button onclick="calcDisplay('8')" class="calc-btn">8</button>
        <button onclick="calcDisplay('9')" class="calc-btn">9</button>
        <button onclick="calcDisplay('*')" class="calc-btn">×</button>
        <button onclick="calcDisplay('4')" class="calc-btn">4</button>
        <button onclick="calcDisplay('5')" class="calc-btn">5</button>
        <button onclick="calcDisplay('6')" class="calc-btn">6</button>
        <button onclick="calcDisplay('-')" class="calc-btn">-</button>
        <button onclick="calcDisplay('1')" class="calc-btn">1</button>
        <button onclick="calcDisplay('2')" class="calc-btn">2</button>
        <button onclick="calcDisplay('3')" class="calc-btn">3</button>
        <button onclick="calcDisplay('+')" class="calc-btn">+</button>
        <button onclick="calcDisplay('.')" class="calc-btn">.</button>
        <button onclick="calcDisplay('0')" class="calc-btn">0</button>
        <button onclick="calcCalculate()" class="calc-btn equal">=</button>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const calcSection = document.getElementById('calculator');
  calcSection.innerHTML = calculatorHTML;
  calcSection.style.display = 'block';
}

// Fungsi kalkulator
function calcDisplay(num) {
  const output = document.getElementById('output-screen');
  output.value += num;
}

function calcCalculate() {
  try {
    const output = document.getElementById('output-screen');
    output.value = eval(output.value);
  } catch (err) {
    showNotification('<i class="fas fa-exclamation-triangle"></i> Invalid calculation');
  }
}

function calcClr() {
  document.getElementById('output-screen').value = '';
}

function calcDel() {
  const output = document.getElementById('output-screen');
  output.value = output.value.slice(0, -1);
}

// ===== TIC TAC TOE =====
function showTicTacToe() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const tictactoeHTML = `
    <div class="section-title">
      <i class="fas fa-gamepad"></i>
      Tic Tac Toe
    </div>
    
    <div class="tictactoe-container">
      <div id="tictactoe-board"></div>
      <div id="tictactoe-output">Player X's turn</div>
      <div class="tictactoe-controls">
        <button class="btn-primary" onclick="resetTicTacToe()">
          <i class="fas fa-redo"></i> Restart Game
        </button>
        <button class="btn-secondary" onclick="switchTicTacToeMode()">
          <i class="fas fa-robot"></i> Mode: <span id="mode-text">PvP</span>
        </button>
      </div>
    </div>
    
    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const tttSection = document.getElementById('tictactoe');
  tttSection.innerHTML = tictactoeHTML;
  tttSection.style.display = 'block';
  
  initializeTicTacToe();
}

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsAI = false;

function initializeTicTacToe() {
  const board = document.getElementById('tictactoe-board');
  board.innerHTML = '';
  board.style.display = 'grid';
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'tictactoe-cell';
    cell.id = `cell-${i}`;
    cell.addEventListener('click', () => makeMove(i));
    board.appendChild(cell);
  }
  
  resetTicTacToe();
}

function makeMove(index) {
  if (!gameActive || gameBoard[index] !== '') return;
  
  gameBoard[index] = currentPlayer;
  document.getElementById(`cell-${index}`).textContent = currentPlayer;
  document.getElementById(`cell-${index}`).classList.add(`player-${currentPlayer}`);
  
  if (checkWinner()) {
    document.getElementById('tictactoe-output').textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }
  
  if (gameBoard.every(cell => cell !== '')) {
    document.getElementById('tictactoe-output').textContent = "It's a draw!";
    gameActive = false;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('tictactoe-output').textContent = `Player ${currentPlayer}'s turn`;
  
  if (vsAI && currentPlayer === 'O' && gameActive) {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  if (emptyCells.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  makeMove(emptyCells[randomIndex]);
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function resetTicTacToe() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  
  for (let i = 0; i < 9; i++) {
    const cell = document.getElementById(`cell-${i}`);
    if (cell) {
      cell.textContent = '';
      cell.classList.remove('player-X', 'player-O');
    }
  }
  
  document.getElementById('tictactoe-output').textContent = "Player X's turn";
  
  if (vsAI && currentPlayer === 'O') {
    setTimeout(makeAIMove, 500);
  }
}

function switchTicTacToeMode() {
  vsAI = !vsAI;
  document.getElementById('mode-text').textContent = vsAI ? 'PvAI' : 'PvP';
  resetTicTacToe();
}

// Konfigurasi Bot Telegram (ganti dengan token dan ID Anda)
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

function showRequestFeature() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const requestHTML = `
    <div class="section-title">
      <i class="fas fa-paper-plane"></i>
      Request Feature
    </div>

    <div class="tool-container">
      <div class="nik-input-section">
        <label for="requestInput" class="nik-label">Your Request Message</label>
        <textarea id="requestInput" placeholder="Describe your feature request or bug report..." class="text-area" rows="4"></textarea>
        
        <div class="setting-group">
          <label class="setting-label">Your Name (optional)</label>
          <input type="text" id="requesterName" placeholder="Enter your name" class="nik-input">
        </div>
        
        <button onclick="sendTelegramRequest()" class="btn-primary nik-button">
          <i class="fas fa-paper-plane"></i> Send Request
        </button>
      </div>
      
      <div id="requestResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const requestSection = document.getElementById('request');
  requestSection.innerHTML = requestHTML;
  requestSection.style.display = 'block';
}

async function sendTelegramRequest() {
  const message = document.getElementById('requestInput').value;
  const name = document.getElementById('requesterName').value || 'Anonymous';
  const resultDiv = document.getElementById('requestResult');
  
  if (!message) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter your request message</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    resultDiv.innerHTML = '<div class="nik-error">Telegram bot not configured</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  const requestData = {
    name: name,
    message: message,
    timestamp: new Date().toLocaleString(),
    userAgent: navigator.userAgent
  };
  
  const telegramMessage = `
🆕 *New Feature Request*

👤 *From:* ${requestData.name}
⏰ *Time:* ${requestData.timestamp}
📱 *Browser:* ${requestData.userAgent}

💬 *Message:*
${requestData.message}
  `;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      resultDiv.innerHTML = '<div class="nik-success">✅ Request sent successfully! Thank you for your feedback.</div>';
      document.getElementById('requestInput').value = '';
      document.getElementById('requesterName').value = '';
    } else {
      resultDiv.innerHTML = '<div class="nik-error">❌ Failed to send request. Please try again later.</div>';
    }
  } catch (error) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Network error. Please check your connection.</div>';
  }
  
  resultDiv.style.display = 'block';
  
  // Sembunyikan result setelah 5 detik
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  });

  document.querySelectorAll('.product-card, .payment-method').forEach(el => {
    observer.observe(el);
  });
});
