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
