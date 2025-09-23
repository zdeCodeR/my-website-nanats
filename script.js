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