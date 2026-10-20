/* =========================================
   THANK YOU PAGE — SCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. THEME SYNC (matches portfolio) */
  const themeDots = document.querySelectorAll('.theme-dot');
  const themes = ['dark', 'midnight', 'ocean', 'forest', 'light'];

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeDots.forEach(d => d.classList.toggle('active', d.dataset.theme === theme));
  }

  applyTheme(localStorage.getItem('theme') || 'dark');

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
  });


  /* 2. GET THEME COLOR FOR CONFETTI */
  function getAccentColor() {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue('--accent-light').trim() || '#00ff88';
  }


  /* 3. CONFETTI BURST (theme-matched) */
  const canvas = document.getElementById('confettiCanvas');

  function burst() {
    if (typeof confetti !== 'function') return;
    const accent = getAccentColor();
    const colors = [accent, '#ffffff', accent];

    // Big center burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.4 },
      colors,
      disableForReducedMotion: true
    });

    // Side streams
    const duration = 2500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        disableForReducedMotion: true
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // Fire after card entrance animation
  setTimeout(burst, 1200);


  /* 4. AUTO-REDIRECT COUNTDOWN */
  const countdownEl = document.getElementById('countdown');
  const REDIRECT_URL = 'index.html';
  let seconds = 10;
  let redirectTimer = null;

  function startCountdown() {
    if (!countdownEl) return;
    redirectTimer = setInterval(() => {
      seconds--;
      countdownEl.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(redirectTimer);
        window.location.href = REDIRECT_URL;
      }
    }, 1000);
  }
  // Start countdown after 2s (let confetti play first)
  setTimeout(startCountdown, 2000);

  // Cancel redirect if user interacts
  function cancelRedirect() {
    if (redirectTimer) {
      clearInterval(redirectTimer);
      redirectTimer = null;
      const hint = document.querySelector('.redirect-hint');
      if (hint) {
        hint.innerHTML = "<i class='bx bx-check-circle'></i> Ready when you are";
        hint.style.color = 'var(--accent-light)';
      }
    }
  }

  document.querySelectorAll('.action-buttons a, .social-links a, .theme-dot').forEach(el => {
    el.addEventListener('click', cancelRedirect);
  });
  document.addEventListener('keydown', cancelRedirect);
  document.addEventListener('mousemove', function once() {
    cancelRedirect();
    document.removeEventListener('mousemove', once);
  });


  /* 5. KEYBOARD SHORTCUT — press 'H' for home */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') window.location.href = REDIRECT_URL;
  });

});