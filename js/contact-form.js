document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const originalBtnHTML = submitBtn.innerHTML;

  // Create notification container dynamically
  const notifContainer = document.createElement('div');
  notifContainer.className = 'notification-container';
  document.body.appendChild(notifContainer);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset errors
    form.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));
    
    let isValid = true;

    // Validate required fields
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        input.parentElement.querySelector('.error-text').textContent = 'This field is required';
        isValid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');
        input.parentElement.querySelector('.error-text').textContent = 'Please enter a valid email address';
        isValid = false;
      }
    });

    if (!isValid) return;

    // Set Loading State
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
    submitBtn.disabled = true;

    try {
      // Prepare data
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim() || 'General Inquiry',
        message: form.message.value.trim()
      };

      // Send to backend (Ensure your backend is running on port 5500)
      const response = await fetch('https://portfolio-backend-1-sjxf.onrender.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success!
      showNotification('Message sent successfully! Redirecting...', 'success');
      form.reset();
      
      // Redirect to thank you page after a short delay
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 1500);

    } catch (error) {
      console.error('Contact form error:', error);
      showNotification(error.message || 'Something went wrong. Please try again.', 'error');
      
      // Reset button on error
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalBtnHTML;
      submitBtn.disabled = false;
    }
  });

  // Helper function to show notifications
  function showNotification(message, type) {
    const icon = type === 'success' ? 'bx-check-circle' : 'bx-error-circle';
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.innerHTML = `<i class='bx ${icon}'></i> <span>${message}</span>`;
    
    notifContainer.appendChild(el);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }
});