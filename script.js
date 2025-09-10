
// Agri-Intel 360 - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dark mode
  initDarkMode();
  
  // Initialize user dropdown
  initUserDropdown();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize settings tabs if present
  initSettingsTabs();
});

// Dark mode functionality
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use device preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    updateDarkModeToggleIcon(true);
  }
  
  // Toggle dark mode
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      updateDarkModeToggleIcon(isDarkMode);
    });
  }
}

function updateDarkModeToggleIcon(isDarkMode) {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  }
}

// User dropdown functionality
function initUserDropdown() {
  const userProfileButtons = document.querySelectorAll('.user-profile, #user-profile-button');
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');
  
  userProfileButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const container = this.closest('.user-profile-container');
      if (container) {
        container.classList.toggle('open');
      } else {
        // Fallback for older implementations
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-menu')) {
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-profile-container')) {
      document.querySelectorAll('.user-profile-container').forEach(container => {
        container.classList.remove('open');
      });
      
      // Fallback for older implementations
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.classList.add('mobile-menu-toggle');
  mobileMenuToggle.innerHTML = '☰';
  mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
  
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    document.body.appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
    
    // Close menu when clicking on a link
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        sidebar.classList.remove('open');
      });
    });
  }
}

// Settings tabs functionality
function initSettingsTabs() {
  const tabLinks = document.querySelectorAll('.settings-tab-link');
  const tabs = document.querySelectorAll('.settings-tab');
  
  if (tabLinks.length > 0) {
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs and links
        tabLinks.forEach(l => l.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab and link
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
}

// File upload preview (for crop health page)
function initImageUploadPreview() {
  const fileInput = document.getElementById('plant-image-input');
  const previewContainer = document.getElementById('image-preview');
  
  if (fileInput && previewContainer) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
          previewContainer.innerHTML = `
            <div class="image-preview-container">
              <img src="${this.result}" alt="Image preview" class="image-preview">
              <button type="button" class="btn btn-sm btn-danger remove-image">×</button>
            </div>
          `;
          
          // Add event listener to remove button
          const removeBtn = previewContainer.querySelector('.remove-image');
          removeBtn.addEventListener('click', function() {
            fileInput.value = '';
            previewContainer.innerHTML = '';
          });
        });
        
        reader.readAsDataURL(file);
      }
    });
  }
}

// Chart initialization (placeholder)
function initCharts() {
  // This would be replaced with actual chart library initialization
  const chartContainers = document.querySelectorAll('[data-chart]');
  
  chartContainers.forEach(container => {
    const chartType = container.getAttribute('data-chart');
    const placeholder = document.createElement('div');
    placeholder.classList.add('chart-placeholder');
    placeholder.innerHTML = `<span>Graphique ${chartType} (simulation)</span>`;
    container.appendChild(placeholder);
  });
}

// Form validation
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');
      
      // Add error message if not exists
      if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('error-message');
        errorMsg.textContent = 'Ce champ est requis';
        input.parentNode.insertBefore(errorMsg, input.nextSibling);
      }
    } else {
      input.classList.remove('error');
      const errorMsg = input.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
      }
    }
  });
  
  return isValid;
}

// Initialize all forms
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
    
    // Remove error class on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      });
    });
  });
}

// Export functions for global use
window.AgriIntel = {
  initDarkMode,
  initUserDropdown,
  initMobileMenu,
  initSettingsTabs,
  initImageUploadPreview,
  initCharts,
  initForms,
  validateForm
};
