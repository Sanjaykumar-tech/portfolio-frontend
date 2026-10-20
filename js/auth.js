document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Logic
  const themeDots = document.querySelectorAll('.theme-swatch');
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeDots.forEach(d => d.classList.toggle('active', d.dataset.theme === theme));
  }
  applyTheme(localStorage.getItem('theme') || 'dark');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
  });

  // 2. Password Show/Hide
  const togglePass = document.getElementById('togglePass');
  const passwordInput = document.getElementById('password');
  if (togglePass && passwordInput) {
    togglePass.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePass.classList.replace('bx-show', 'bx-hide');
      } else {
        passwordInput.type = 'password';
        togglePass.classList.replace('bx-hide', 'bx-show');
      }
    });
  }

  // ⚡ UPDATED BACKEND URL
  const API_URL = 'https://portfolio-backend-1-sjxf.onrender.com/api/auth';

  // 3. LOGIN FORM HANDLER
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = loginForm.querySelector('button');
      const originalBtnHTML = btn.innerHTML;

      // Loading state
      btn.innerHTML = 'Signing In... <i class="bx bx-loader-alt bx-spin"></i>';
      btn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token); // Save JWT Token
          alert(`Welcome back, ${data.name}!`);
          window.location.href = 'index.html'; // Redirect to Home
        } else {
          alert(data.error || 'Invalid credentials');
          btn.innerHTML = originalBtnHTML;
          btn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        alert('Server error. Please check your connection or try again later.');
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;
      }
    });
  }

  // 4. SIGNUP FORM HANDLER
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = signupForm.querySelector('button');
      const originalBtnHTML = btn.innerHTML;

      // Loading state
      btn.innerHTML = 'Creating Account... <i class="bx bx-loader-alt bx-spin"></i>';
      btn.disabled = true;

      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (res.ok) {
          alert('Account created successfully! Please login.');
          window.location.href = 'login.html'; // Redirect to Login Page
        } else {
          alert(data.error || 'Failed to create account');
          btn.innerHTML = originalBtnHTML;
          btn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        alert('Server error. Please check your connection or try again later.');
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;
      }
    });
  }
});