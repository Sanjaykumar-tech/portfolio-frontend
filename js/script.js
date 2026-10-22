/* =========================================
   PREMIUM PORTFOLIO — MAIN SCRIPT (OPTIMIZED)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. YEAR */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. GSAP ANIMATIONS (Faster & Optimized) */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ delay: 0.1 });
    tl.from(".gsap-fade-down", { y: -20, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" });
    tl.from(".gsap-title-line", { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.4");
    tl.from(".gsap-fade-up", { y: 20, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }, "-=0.4");
    tl.from(".gsap-scale-in", { scale: 0.95, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");

    gsap.utils.toArray('.gsap-scroll-up').forEach(el => {
      gsap.from(el, { y: 30, opacity: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    gsap.utils.toArray('.gsap-scroll-left').forEach(el => {
      gsap.from(el, { x: -30, opacity: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    gsap.utils.toArray('.gsap-scroll-right').forEach(el => {
      gsap.from(el, { x: 30, opacity: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    gsap.utils.toArray('.gsap-project-card').forEach((card, i) => {
      gsap.from(card, { y: 40, opacity: 0, duration: 0.6, delay: i * 0.05, ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 90%" } });
    });
  }

  /* 3. CURSOR GLOW (Disabled on Mobile) */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.innerWidth > 1024 && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    (function anim() {
      gx += (mx - gx) * 0.1;
      gy += (my - gy) * 0.1;
      if (cursorGlow) { cursorGlow.style.left = gx + 'px'; cursorGlow.style.top = gy + 'px'; }
      requestAnimationFrame(anim);
    })();
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* 4. THEME SYSTEM */
  const themeToggle = document.getElementById('themeToggle');
  const swatches = document.querySelectorAll('.theme-swatch');
  const themes = ['dark', 'midnight', 'ocean', 'forest', 'light'];

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === theme));
    const moon = themeToggle?.querySelector('.bx-moon');
    const sun = themeToggle?.querySelector('.bx-sun');
    if (moon && sun) {
      if (theme === 'light') { moon.style.display = 'none'; sun.style.display = 'block'; }
      else { moon.style.display = 'block'; sun.style.display = 'none'; }
    }
  }

  applyTheme(localStorage.getItem('theme') || 'dark');
  swatches.forEach(s => s.addEventListener('click', () => applyTheme(s.dataset.theme)));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = document.body.getAttribute('data-theme');
      const idx = themes.indexOf(cur);
      applyTheme(themes[(idx + 1) % themes.length]);
    });
  }

  /* 5. MOBILE MENU */
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) icon.className = navbar.classList.contains('active') ? 'bx bx-x' : 'bx bx-menu';
    });
    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'bx bx-menu';
      });
    });
  }

  /* 6. SCROLL EFFECTS */
  const header = document.getElementById('header');
  const progressBar = document.getElementById('scrollProgress');

  const handleScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* 7. ROLE ROTATOR */
  const roles = document.querySelectorAll('.role-text');
  let currentRole = 0;
  if (roles.length > 0) {
    roles[0].classList.add('active');
    setInterval(() => {
      roles[currentRole].classList.remove('active');
      currentRole = (currentRole + 1) % roles.length;
      roles[currentRole].classList.add('active');
    }, 3000);
  }

  /* 8. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* 9. NUMBER COUNTER */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let cur = 0;
        const step = Math.ceil(target / 30);
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur + '+';
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* 10. TERMINAL */
  const terminalModal = document.getElementById('terminalModal');
  const openTerminalBtn = document.getElementById('openTerminalBtn');
  const closeTerminal = document.getElementById('closeTerminal');
  const terminalBody = document.getElementById('terminalBody');
  const terminalInput = document.getElementById('terminalInput');

  const openTerminal = () => {
    if (terminalModal) {
      terminalModal.classList.add('active');
      setTimeout(() => terminalInput && terminalInput.focus(), 100);
    }
  };
  if (openTerminalBtn) openTerminalBtn.addEventListener('click', openTerminal);
  if (closeTerminal) closeTerminal.addEventListener('click', () => terminalModal.classList.remove('active'));
  if (terminalModal) terminalModal.addEventListener('click', e => { if (e.target === terminalModal) terminalModal.classList.remove('active'); });

  const commands = {
    help: 'Commands: help, about, skills, projects, experience, arcade, contact, theme, matrix, clear, whoami, date, games',
    about: 'Navigating to About...',
    skills: 'Navigating to Skills...',
    projects: 'Navigating to Projects...',
    experience: 'Navigating to Experience...',
    arcade: 'Navigating to Arcade...',
    games: 'Opening SK Arcade — 15 games available!',
    contact: 'Navigating to Contact...',
    theme: 'Cycling theme...',
    matrix: 'Toggling Matrix mode...',
    clear: '',
    whoami: 'guest@sk — a curious visitor exploring the portfolio.',
    date: new Date().toLocaleString()
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        if (input === 'clear') { terminalBody.innerHTML = ''; return; }
        const p = document.createElement('p');
        p.innerHTML = `<span class="prompt">guest@sk:~$</span> ${input}`;
        terminalBody.appendChild(p);
        if (commands[input] !== undefined) {
          if (input !== 'clear') {
            const res = document.createElement('p');
            res.textContent = commands[input];
            terminalBody.appendChild(res);
          }
          if (input === 'about') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          if (input === 'skills') document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          if (input === 'projects') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          if (input === 'experience') document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
          if (input === 'arcade' || input === 'games') document.getElementById('arcade')?.scrollIntoView({ behavior: 'smooth' });
          if (input === 'contact') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          if (input === 'theme') themeToggle?.click();
          if (input === 'matrix') window.toggleMatrix && window.toggleMatrix();
        } else {
          const err = document.createElement('p');
          err.innerHTML = `<span style="color:#ff4444;">Command not found: ${input}</span>`;
          terminalBody.appendChild(err);
        }
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  /* 11. LOGO EASTER EGG */
  let logoClicks = 0;
  const skLogo = document.getElementById('skLogo');
  if (skLogo) {
    skLogo.addEventListener('click', (e) => {
      logoClicks++;
      if (logoClicks >= 5) {
        e.preventDefault();
        logoClicks = 0;
        if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      clearTimeout(skLogo._t);
      skLogo._t = setTimeout(() => { logoClicks = 0; }, 3000);
    });
  }

  /* 12. MATRIX MODE */
  const matrixCanvas = document.getElementById('matrixCanvas');
  const mCtx = matrixCanvas ? matrixCanvas.getContext('2d') : null;
  let matrixInterval = null;
  let isMatrixOn = false;

  window.toggleMatrix = function() {
    if (!matrixCanvas || !mCtx) return;
    isMatrixOn = !isMatrixOn;
    if (isMatrixOn) {
      matrixCanvas.classList.add('active');
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
      const fontSize = 16;
      const columns = matrixCanvas.width / fontSize;
      const drops = Array(Math.ceil(columns)).fill(1);
      matrixInterval = setInterval(() => {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        mCtx.fillStyle = '#00ff88';
        mCtx.font = fontSize + 'px "JetBrains Mono", monospace';
        drops.forEach((y, i) => {
          mCtx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, y * fontSize);
          if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        });
      }, 50);
    } else {
      matrixCanvas.classList.remove('active');
      clearInterval(matrixInterval);
      matrixInterval = null;
      mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    }
  };

  /* 13. PARTICLE BACKGROUND (Optimized) */
  const pCanvas = document.getElementById('particleCanvas');
  const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
  
  // ONLY RUN ON DESKTOP
  if (pCanvas && pCtx && window.innerWidth > 1024) {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    const particles = [];
    const NUM = 35; // Reduced from 60
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5
      });
    }
    function drawParticles() {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      const color = getComputedStyle(document.body).getPropertyValue('--accent-light').trim() || '#00ff88';
      pCtx.fillStyle = color;
      pCtx.globalAlpha = 0.4;
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            pCtx.strokeStyle = color;
            pCtx.globalAlpha = (1 - dist / 120) * 0.15;
            pCtx.beginPath();
            pCtx.moveTo(p.x, p.y);
            pCtx.lineTo(q.x, q.y);
            pCtx.stroke();
          }
        }
      });
      pCtx.globalAlpha = 1;
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
    window.addEventListener('resize', () => {
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
    });
  } else if (pCanvas) {
    pCanvas.style.display = 'none'; // Hide on mobile
  }

  /* 14. CMD PALETTE */
  const cmdPalette = document.getElementById('cmdPalette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');

  const searchData = [
    { title: 'Home', icon: 'bx-home', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'About', icon: 'bx-user', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Skills', icon: 'bx-code-alt', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Projects', icon: 'bx-briefcase', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Experience', icon: 'bx-time', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Arcade — 15 Games', icon: 'bx-game', action: () => document.getElementById('arcade')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Contact', icon: 'bx-envelope', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: 'Open Terminal', icon: 'bx-terminal', action: () => openTerminal() },
    { title: 'Toggle Matrix Mode', icon: 'bx-code', action: () => window.toggleMatrix() },
    { title: 'Cycle Theme', icon: 'bx-palette', action: () => themeToggle?.click() }
  ];

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('active');
    if (cmdInput) cmdInput.value = '';
    renderResults(searchData);
    setTimeout(() => cmdInput && cmdInput.focus(), 100);
  }
  function closeCmdPalette() { if (cmdPalette) cmdPalette.classList.remove('active'); }
  function renderResults(results) {
    if (!cmdResults) return;
    cmdResults.innerHTML = '';
    if (results.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No results found.';
      li.style.cursor = 'default';
      cmdResults.appendChild(li);
      return;
    }
    results.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<i class='bx ${item.icon}'></i> ${item.title}`;
      li.addEventListener('click', () => { item.action(); closeCmdPalette(); });
      cmdResults.appendChild(li);
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      cmdPalette && cmdPalette.classList.contains('active') ? closeCmdPalette() : openCmdPalette();
    }
    if (e.key === 'Escape') {
      closeCmdPalette();
      if (terminalModal) terminalModal.classList.remove('active');
      if (document.getElementById('gameModal')) document.getElementById('gameModal').classList.remove('active');
    }
  });

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openCmdPalette);
  if (cmdPalette) cmdPalette.addEventListener('click', e => { if (e.target === cmdPalette) closeCmdPalette(); });
  if (cmdInput) {
    cmdInput.addEventListener('input', e => {
      const val = e.target.value.toLowerCase();
      renderResults(searchData.filter(item => item.title.toLowerCase().includes(val)));
    });
  }

  /* 15. VANILLA TILT */
  if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 1024) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 6, speed: 400, glare: true, 'max-glare': 0.15
    });
  }

});