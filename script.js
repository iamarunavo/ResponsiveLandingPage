/* ===============================================
   AUREON - INTERACTIVE FUNCTIONALITY
   Production-Level JavaScript with Performance Optimization
   =============================================== */

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} Is element visible
 */
function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -threshold * rect.height &&
    rect.left >= -threshold * rect.width &&
    rect.bottom <= windowHeight + threshold * rect.height &&
    rect.right <= windowWidth + threshold * rect.width
  );
}

/**
 * Smooth scroll to element
 * @param {string} targetId - Target element ID
 * @param {number} offset - Offset from top
 */
function smoothScrollTo(targetId, offset = 80) {
  const target = document.querySelector(targetId);
  if (!target) return;
  
  const targetPosition = target.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let start = null;
  
  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  
  requestAnimationFrame(animation);
}

/**
 * Easing function for smooth scroll
 */
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
}

// ===============================================
// THEME MANAGEMENT
// ===============================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('aureon-theme') || 'dark';
    this.init();
  }
  
  init() {
    this.applyTheme(this.theme);
    this.bindEvents();
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('aureon-theme', theme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }
  
  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }
  
  bindEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggle());
    }
  }
}

// ===============================================
// NAVIGATION MANAGEMENT
// ===============================================

class NavigationManager {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
  }
  
  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Smooth scroll for anchor links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          smoothScrollTo(href);
        }
      });
    });
    
    // Handle scroll events
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
  }
  
  toggleMobileMenu() {
    const isActive = this.navMenu.classList.contains('active');
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animate menu items
    const menuItems = this.navMenu.querySelectorAll('.nav-link');
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.style.animation = 'fadeInUp 0.3s ease forwards';
    });
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset menu items animation
    const menuItems = this.navMenu.querySelectorAll('.nav-link');
    menuItems.forEach(item => {
      item.style.animation = '';
      item.style.animationDelay = '';
    });
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class for nav styling
    if (scrollY > 100) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    this.updateActiveNavLink();
  }
  
  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
}

// ===============================================
// SCROLL ANIMATIONS
// ===============================================

class ScrollAnimations {
  constructor() {
    this.animatedElements = [];
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.bindScrollEvents();
  }
  
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe elements with data-aos attribute
    const elementsToAnimate = document.querySelectorAll('[data-aos]');
    elementsToAnimate.forEach(el => {
      this.observer.observe(el);
    });
  }
  
  animateElement(element) {
    const animationType = element.getAttribute('data-aos');
    const delay = element.getAttribute('data-aos-delay') || 0;
    
    setTimeout(() => {
      element.classList.add(`aos-animate-${animationType}`);
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateX(0) scale(1)';
    }, delay);
  }
  
  bindScrollEvents() {
    // Parallax effect for hero elements
    window.addEventListener('scroll', throttle(() => {
      this.handleParallax();
    }, 16));
  }
  
  handleParallax() {
    const scrollY = window.scrollY;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ===============================================
// PERFORMANCE OPTIMIZATIONS
// ===============================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.lazyLoadImages();
    this.optimizeAnimations();
    this.preloadCriticalResources();
  }
  
  lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.style.setProperty('--duration-fast', '0ms');
      document.documentElement.style.setProperty('--duration-normal', '0ms');
      document.documentElement.style.setProperty('--duration-slow', '0ms');
    }
    
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduce-motion');
    }
  }
  
  preloadCriticalResources() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
  }
}

// ===============================================
// INTERACTIVE COMPONENTS
// ===============================================

class InteractiveComponents {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupButtonInteractions();
    this.setupCardHoverEffects();
    this.setupFormValidation();
  }
  
  setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Ripple effect
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e, button);
      });
      
      // Loading state for CTA buttons
      if (button.classList.contains('pricing-btn') || button.textContent.includes('Demo')) {
        button.addEventListener('click', (e) => {
          this.showLoadingState(button);
        });
      }
    });
  }
  
  createRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  showLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-check"></i> Success!';
      button.style.background = 'var(--color-accent)';
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.background = '';
      }, 2000);
    }, 2000);
  }
  
  setupCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
  
  setupFormValidation() {
    // Placeholder for future form validation
    // This would handle contact forms, newsletter signups, etc.
  }
}

// ===============================================
// ACCESSIBILITY ENHANCEMENTS
// ===============================================

class AccessibilityManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
  }
  
  setupKeyboardNavigation() {
    // Handle Escape key for closing modals/menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const navManager = window.aureonApp?.navigationManager;
        if (navManager) {
          navManager.closeMobileMenu();
        }
      }
    });
    
    // Handle Enter and Space keys for buttons
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('btn') || e.target.classList.contains('theme-toggle')) {
          e.preventDefault();
          e.target.click();
        }
      }
    });
  }
  
  setupFocusManagement() {
    // Skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.addEventListener('focus', () => {
      skipLink.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', () => {
      skipLink.classList.add('sr-only');
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const main = document.querySelector('main') || document.querySelector('.hero');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }
  
  setupScreenReaderSupport() {
    // Add live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Announce theme changes
    const originalThemeToggle = window.aureonApp?.themeManager?.toggle;
    if (originalThemeToggle) {
      window.aureonApp.themeManager.toggle = function() {
        originalThemeToggle.call(this);
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
          liveRegion.textContent = `Theme changed to ${this.theme} mode`;
        }
      };
    }
  }
}

// ===============================================
// APPLICATION INITIALIZATION
// ===============================================

class AureonApp {
  constructor() {
    this.themeManager = null;
    this.navigationManager = null;
    this.scrollAnimations = null;
    this.performanceOptimizer = null;
    this.interactiveComponents = null;
    this.accessibilityManager = null;
  }
  
  init() {
    // Initialize core components
    this.themeManager = new ThemeManager();
    this.navigationManager = new NavigationManager();
    this.scrollAnimations = new ScrollAnimations();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.interactiveComponents = new InteractiveComponents();
    this.accessibilityManager = new AccessibilityManager();
    
    // Add ripple animation CSS
    this.addRippleAnimation();
    
    // Setup error handling
    this.setupErrorHandling();
    
    console.log('🚀 Aureon App initialized successfully');
  }
  
  addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .aos-animate-fade-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Aureon App Error:', e.error);
      // In production, you might want to send this to an error tracking service
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Aureon App Unhandled Promise Rejection:', e.reason);
      // In production, you might want to send this to an error tracking service
    });
  }
}

// ===============================================
// INITIALIZE APPLICATION
// ===============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aureonApp = new AureonApp();
    window.aureonApp.init();
  });
} else {
  window.aureonApp = new AureonApp();
  window.aureonApp.init();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AureonApp, ThemeManager, NavigationManager };
}
