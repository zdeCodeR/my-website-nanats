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

// ===== 🔐 ADMIN PANEL =====
/*const ADMIN_PASSWORD = "admin123"; // Ganti dengan password kuat

function showAdminPanel() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  // Cek apakah sudah login
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (isLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLoginForm();
  }
}

function showAdminLoginForm() {
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-user-shield"></i>
      Admin Login
    </div>

    <div class="tool-container">
      <div class="admin-login-form">
        <div class="setting-group">
          <label class="setting-label">Admin Password</label>
          <input type="password" id="adminPassword" placeholder="Enter admin password" class="password-input">
        </div>
        
        <button onclick="attemptAdminLogin()" class="btn-primary nik-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        
        <div id="adminLoginResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function attemptAdminLogin() {
  const password = document.getElementById('adminPassword').value;
  const resultDiv = document.getElementById('adminLoginResult');
  
  if (!password) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter password</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminLoggedIn', 'true');
    showAdminDashboard();
  } else {
    resultDiv.innerHTML = '<div class="nik-error">❌ Invalid password</div>';
    resultDiv.style.display = 'block';
  }
}

function showAdminDashboard() {
  // Hitung statistics
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0}');
  const totalRequests = requests.count;
  
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-cog"></i>
      Admin Dashboard
    </div>

    <div class="tool-container">
      <div class="admin-stats">
        <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-number">${totalRequests}</span>
            <span class="stat-label">Total Requests</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${getActiveUsers()}</span>
            <span class="stat-label">Active Users</span>
          </div>
        </div>
      </div>

      <div class="admin-actions">
        <button class="admin-btn" onclick="resetAllLimits()">
          <i class="fas fa-refresh"></i>
          <div>
            <strong>Reset All Limits</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Reset request limits for all users</div>
          </div>
        </button>
        
        <button class="admin-btn" onclick="clearAllData()">
          <i class="fas fa-trash"></i>
          <div>
            <strong>Clear All Data</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Clear all stored data</div>
          </div>
        </button>
        
        <button class="admin-btn btn-danger" onclick="adminLogout()">
          <i class="fas fa-sign-out-alt"></i>
          <div>
            <strong>Logout</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Sign out from admin panel</div>
          </div>
        </button>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function getActiveUsers() {
  // Simple active users count (based on localStorage data)
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      count++;
    }
  }
  return count;
}

function resetAllLimits() {
  // Clear all request limits
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      localStorage.removeItem(key);
    }
  }
  showNotification('✅ All limits reset successfully!');
  showAdminDashboard(); // Refresh view
}

function clearAllData() {
  if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
    localStorage.clear();
    showNotification('✅ All data cleared successfully!');
    showAdminDashboard();
  }
}

function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  showNotification('✅ Logged out successfully!');
  showAdminLoginForm();
}*/

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

// ===== 📱 TELEGRAM REQUEST FEATURE =====
/*const TELEGRAM_BOT_TOKEN = '8470962705:AAEM_nC-i9q4kdqFbGX3TR_jJwaSufqb2_g';
const TELEGRAM_CHAT_ID = '7710986992';
const MAX_REQUESTS = 3; // Maksimal 3 request
const TIME_WINDOW = 12 * 60 * 60 * 1000; // 12 jam dalam milidetik

function showRequestFeature() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const requestCount = getRequestCount();
  const remainingRequests = MAX_REQUESTS - requestCount.count;
  const timeLeft = getTimeLeft(requestCount.lastRequest);
  
  const requestHTML = `
    <div class="section-title">
      <i class="fas fa-paper-plane"></i>
      Request Feature
    </div>

    <div class="tool-container">
      <div class="request-info" style="
        background: ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
        border: 1px solid ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="font-size: 2rem; font-weight: bold; color: ${remainingRequests > 0 ? '#4ecdc4' : '#ff6b6b'}">
          ${remainingRequests} / ${MAX_REQUESTS}
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
          Requests remaining (resets in ${timeLeft})
        </div>
        ${remainingRequests === 0 ? `
          <div style="color: #ff6b6b; margin-top: 0.5rem; font-weight: 600;">
            <i class="fas fa-clock"></i> Limit reached. Try again later.
          </div>
        ` : ''}
      </div>
      
      <div class="nik-input-section">
        <label for="requestInput" class="nik-label">Your Request Message</label>
        <textarea 
          id="requestInput" 
          placeholder="Describe your feature request or bug report..." 
          class="text-area" 
          rows="4"
          ${remainingRequests === 0 ? 'disabled' : ''}
        ></textarea>
        
        <div class="setting-group">
          <label class="setting-label">Your Name (optional)</label>
          <input 
            type="text" 
            id="requesterName" 
            placeholder="Enter your name" 
            class="nik-input"
            ${remainingRequests === 0 ? 'disabled' : ''}
          >
        </div>
        
        <button 
          onclick="sendTelegramRequest()" 
          class="btn-primary nik-button"
          ${remainingRequests === 0 ? 'disabled' : ''}
          style="${remainingRequests === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
        >
          <i class="fas fa-paper-plane"></i> 
          ${remainingRequests === 0 ? 'Limit Reached' : 'Send Request'}
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

// Fungsi untuk mendapatkan jumlah request
function getRequestCount() {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0, "lastRequest": 0}');
  
  // Reset jika sudah lewat 12 jam
  if (now - requests.lastRequest > TIME_WINDOW) {
    return { count: 0, lastRequest: now };
  }
  
  return requests;
}

// Fungsi untuk update jumlah request
function updateRequestCount() {
  const requests = getRequestCount();
  requests.count += 1;
  requests.lastRequest = Date.now();
  localStorage.setItem('telegram_requests', JSON.stringify(requests));
  return requests;
}

// Fungsi untuk menghitung sisa waktu
function getTimeLeft(lastRequest) {
  const now = Date.now();
  const timePassed = now - lastRequest;
  const timeLeft = TIME_WINDOW - timePassed;
  
  if (timeLeft <= 0) return '0 hours';
  
  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours}h ${minutes}m`;
}

async function sendTelegramRequest() {
  const message = document.getElementById('requestInput').value;
  const name = document.getElementById('requesterName').value || 'Anonymous';
  const resultDiv = document.getElementById('requestResult');
  
  // Cek limit
  const requestCount = getRequestCount();
  if (requestCount.count >= MAX_REQUESTS) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Request limit reached (3 per 12 hours). Please try again later.</div>';
    resultDiv.style.display = 'block';
    return;
  }

  if (!message) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter your request message</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === '8470962705:AAEM_nC-i9q4kdqFbGX3TR_jJwaSufqb2_g') {
    resultDiv.innerHTML = '<div class="nik-error">Telegram bot not configured</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  // Update request count
  updateRequestCount();
  
  const requestData = {
    name: name,
    message: message,
    timestamp: new Date().toLocaleString(),
    userAgent: navigator.userAgent,
    requestNumber: requestCount.count + 1
  };
  
  const telegramMessage = `
🆕 *New Feature Request* (#${requestData.requestNumber}/3)

👤 *From:* ${requestData.name}
⏰ *Time:* ${requestData.timestamp}
📱 *Browser:* ${requestData.userAgent}

💬 *Message:*
${requestData.message}

⏳ *Requests used:* ${requestCount.count + 1}/3 (Resets in 12 hours)
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
      resultDiv.innerHTML = `
        <div class="nik-success">
          ✅ Request sent successfully! 
          <br><small>Requests remaining: ${MAX_REQUESTS - (requestCount.count + 1)}/3</small>
        </div>
      `;
      document.getElementById('requestInput').value = '';
      document.getElementById('requesterName').value = '';
      
      // Refresh tampilan untuk update limit
      setTimeout(() => {
        showRequestFeature();
      }, 2000);
    } else {
      resultDiv.innerHTML = '<div class="nik-error">❌ Failed to send request. Please try again later.</div>';
    }
  } catch (error) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Network error. Please check your connection.</div>';
  }
  
  resultDiv.style.display = 'block';
  
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}*/
// ===== 📱 TELEGRAM REQUEST FEATURE =====
const TELEGRAM_BOT_TOKEN = '8470962705:AAEM_nC-i9q4kdqFbGX3TR_jJwaSufqb2_g';
const TELEGRAM_CHAT_ID = '7710986992';
const MAX_REQUESTS = 3;
const TIME_WINDOW = 12 * 60 * 60 * 1000;

// Fungsi untuk mendapatkan jumlah request
function getRequestCount() {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0, "lastRequest": 0}');
  
  if (now - requests.lastRequest > TIME_WINDOW) {
    return { count: 0, lastRequest: now };
  }
  
  return requests;
}

// Fungsi untuk update jumlah request
function updateRequestCount() {
  const requests = getRequestCount();
  requests.count += 1;
  requests.lastRequest = Date.now();
  localStorage.setItem('telegram_requests', JSON.stringify(requests));
  return requests;
}

// Fungsi untuk menghitung sisa waktu
function getTimeLeft(lastRequest) {
  const now = Date.now();
  const timePassed = now - lastRequest;
  const timeLeft = TIME_WINDOW - timePassed;
  
  if (timeLeft <= 0) return '0 hours';
  
  const hours = Math.floor(timeLeft / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours}h ${minutes}m`;
}

// Fungsi utama show request feature
function showRequestFeature() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const requestCount = getRequestCount();
  const remainingRequests = MAX_REQUESTS - requestCount.count;
  const timeLeft = getTimeLeft(requestCount.lastRequest);

  const requestHTML = `
    <div class="section-title">
      <i class="fas fa-paper-plane"></i>
      Request Feature
    </div>

    <div class="tool-container">
      <div class="request-info" style="
        background: ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
        border: 1px solid ${remainingRequests > 0 ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <div style="font-size: 2rem; font-weight: bold; color: ${remainingRequests > 0 ? '#4ecdc4' : '#ff6b6b'}">
          ${remainingRequests} / ${MAX_REQUESTS}
        </div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">
          Requests remaining (resets in ${timeLeft})
        </div>
        ${remainingRequests === 0 ? `
          <div style="color: #ff6b6b; margin-top: 0.5rem; font-weight: 600;">
            <i class="fas fa-clock"></i> Limit reached. Try again later.
          </div>
        ` : ''}
      </div>
      
      <div class="nik-input-section">
        <label for="requestInput" class="nik-label">Your Request Message</label>
        <textarea 
          id="requestInput" 
          placeholder="Describe your feature request or bug report..." 
          class="text-area" 
          rows="4"
          ${remainingRequests === 0 ? 'disabled' : ''}
        ></textarea>
        
        <div class="setting-group">
          <label class="setting-label">Your Name (optional)</label>
          <input 
            type="text" 
            id="requesterName" 
            placeholder="Enter your name" 
            class="nik-input"
            ${remainingRequests === 0 ? 'disabled' : ''}
          >
        </div>
        
        <button 
          onclick="sendTelegramRequest()" 
          class="btn-primary nik-button"
          ${remainingRequests === 0 ? 'disabled' : ''}
          style="${remainingRequests === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
        >
          <i class="fas fa-paper-plane"></i> 
          ${remainingRequests === 0 ? 'Limit Reached' : 'Send Request'}
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

// Fungsi kirim request ke Telegram
async function sendTelegramRequest() {
  const message = document.getElementById('requestInput').value;
  const name = document.getElementById('requesterName').value || 'Anonymous';
  const resultDiv = document.getElementById('requestResult');
  
  // Cek limit
  const requestCount = getRequestCount();
  if (requestCount.count >= MAX_REQUESTS) {
    resultDiv.innerHTML = '<div class="nik-error">❌ Request limit reached (3 per 12 hours). Please try again later.</div>';
    resultDiv.style.display = 'block';
    return;
  }

  if (!message) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter your request message</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  // Update request count
  updateRequestCount();
  
  const requestData = {
    name: name,
    message: message,
    timestamp: new Date().toLocaleString(),
    userAgent: navigator.userAgent,
    requestNumber: requestCount.count + 1
  };
  
  const telegramMessage = `
🆕 *New Feature Request* (#${requestData.requestNumber}/3)

👤 *From:* ${requestData.name}
⏰ *Time:* ${requestData.timestamp}
📱 *Browser:* ${requestData.userAgent}

💬 *Message:*
${requestData.message}

⏳ *Requests used:* ${requestCount.count + 1}/3 (Resets in 12 hours)
  `;
  
  try {
    console.log("📨 Sending to Telegram...");
    
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
    console.log("📡 Telegram response:", result);
    
    if (result.ok) {
      resultDiv.innerHTML = `
        <div class="nik-success">
          ✅ Request sent successfully! 
          <br><small>Requests remaining: ${MAX_REQUESTS - (requestCount.count + 1)}/3</small>
        </div>
      `;
      document.getElementById('requestInput').value = '';
      document.getElementById('requesterName').value = '';
      
      // Refresh tampilan untuk update limit
      setTimeout(() => {
        showRequestFeature();
      }, 2000);
    } else {
      resultDiv.innerHTML = `<div class="nik-error">❌ Telegram error: ${result.description || 'Unknown error'}</div>`;
    }
  } catch (error) {
    console.error("🌐 Network error:", error);
    resultDiv.innerHTML = '<div class="nik-error">❌ Network error. Please check your connection.</div>';
  }
  
  resultDiv.style.display = 'block';
  
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}

// ===== 🔐 ADMIN PANEL =====
const ADMIN_PASSWORD = "admin123";

function showAdminPanel() {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (isLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLoginForm();
  }
}

function showAdminLoginForm() {
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-user-shield"></i>
      Admin Login
    </div>

    <div class="tool-container">
      <div class="admin-login-form">
        <div class="setting-group">
          <label class="setting-label">Admin Password</label>
          <input type="password" id="adminPassword" placeholder="Enter admin password" class="password-input">
        </div>
        
        <button onclick="attemptAdminLogin()" class="btn-primary nik-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        
        <div id="adminLoginResult" class="nik-result" style="margin-top: 1rem; display: none;"></div>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function attemptAdminLogin() {
  const password = document.getElementById('adminPassword').value;
  const resultDiv = document.getElementById('adminLoginResult');
  
  if (!password) {
    resultDiv.innerHTML = '<div class="nik-error">Please enter password</div>';
    resultDiv.style.display = 'block';
    return;
  }
  
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminLoggedIn', 'true');
    showAdminDashboard();
  } else {
    resultDiv.innerHTML = '<div class="nik-error">❌ Invalid password</div>';
    resultDiv.style.display = 'block';
  }
}

function showAdminDashboard() {
  const requests = JSON.parse(localStorage.getItem('telegram_requests') || '{"count": 0}');
  const totalRequests = requests.count;
  
  const adminHTML = `
    <div class="section-title">
      <i class="fas fa-cog"></i>
      Admin Dashboard
    </div>

    <div class="tool-container">
      <div class="admin-stats">
        <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-number">${totalRequests}</span>
            <span class="stat-label">Total Requests</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${getActiveUsers()}</span>
            <span class="stat-label">Active Users</span>
          </div>
        </div>
      </div>

      <div class="admin-actions">
        <button class="admin-btn" onclick="resetAllLimits()">
          <i class="fas fa-refresh"></i>
          <div>
            <strong>Reset All Limits</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Reset request limits for all users</div>
          </div>
        </button>
        
        <button class="admin-btn" onclick="clearAllData()">
          <i class="fas fa-trash"></i>
          <div>
            <strong>Clear All Data</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Clear all stored data</div>
          </div>
        </button>
        
        <button class="admin-btn btn-danger" onclick="adminLogout()">
          <i class="fas fa-sign-out-alt"></i>
          <div>
            <strong>Logout</strong>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">Sign out from admin panel</div>
          </div>
        </button>
      </div>
    </div>

    <button class="btn-secondary" onclick="backToMain()">
      <i class="fas fa-arrow-left"></i> Back to Main
    </button>
  `;
  
  const adminSection = document.getElementById('admin');
  adminSection.innerHTML = adminHTML;
  adminSection.style.display = 'block';
}

function getActiveUsers() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      count++;
    }
  }
  return count;
}

function resetAllLimits() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('telegram_requests')) {
      localStorage.removeItem(key);
    }
  }
  showNotification('✅ All limits reset successfully!');
  showAdminDashboard();
}

function clearAllData() {
  if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
    localStorage.clear();
    showNotification('✅ All data cleared successfully!');
    showAdminDashboard();
  }
}

function adminLogout() {
  localStorage.removeItem('adminLoggedIn');
  showNotification('✅ Logged out successfully!');
  showAdminLoginForm();
}

// ... (kode lainnya tetap di bawah)

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
