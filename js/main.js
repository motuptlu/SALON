// ==================== MAIN JAVASCRIPT ==================== //

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== Mobile Menu Toggle ====================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // ==================== Smooth Scroll ====================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // ==================== Sticky Navigation ====================
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ==================== Lazy Loading Images ====================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('skeleton');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            img.classList.add('skeleton');
            imageObserver.observe(img);
        });
    }
    
    // ==================== Form Validation ====================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showError(field, 'This field is required');
                } else {
                    field.classList.remove('error');
                    clearError(field);
                }
                
                // Email validation
                if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showError(field, 'Please enter a valid email');
                    }
                }
                
                // Phone validation
                if (field.type === 'tel' && field.value) {
                    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                    if (!phoneRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showError(field, 'Please enter a valid phone number');
                    }
                }
            });
            
            if (isValid) {
                // Process form submission
                handleFormSubmission(form);
            }
        });
    });
    
    function showError(field, message) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = message;
            error.style.color = 'red';
            error.style.fontSize = '0.875rem';
            field.parentNode.insertBefore(error, field.nextSibling);
        }
    }
    
    function clearError(field) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }
    
    function handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            // Show success message
            showSuccessMessage(form, 'Thank you! We will contact you soon.');
            
            // Reset form
            form.reset();
            
            // Restore button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Track event in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'form_name': form.id || 'contact_form'
                });
            }
        }, 1500);
    }
    
    function showSuccessMessage(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            margin-top: 1rem;
            animation: fadeIn 0.5s ease;
        `;
        
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
    
    // ==================== Testimonials Slider ====================
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    if (testimonials.length > 0) {
        setInterval(() => {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.display = 'block';
        }, 5000);
    }
    
    // ==================== Performance Monitoring ====================
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('LCP:', entry.startTime);
                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        'name': 'LCP',
                        'value': Math.round(entry.startTime)
                    });
                }
            }
        }).observe({type: 'largest-contentful-paint', buffered: true});
        
        // Monitor First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({type: 'first-input', buffered: true});
    }
    
    // ==================== Service Worker Registration ====================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered'))
                .catch(err => console.log('SW registration failed'));
        });
    }
    
    // ==================== Dynamic WhatsApp Link ====================
    const whatsappWidget = document.querySelector('.whatsapp-widget a');
    if (whatsappWidget) {
        const message = encodeURIComponent('Hello! I would like to book an appointment at SOK Beauty Salon.');
        const phone = '35797445595';
        whatsappWidget.href = `https://wa.me/${phone}?text=${message}`;
    }
    
    // ==================== Schema.org Structured Data Helper ====================
    function generateBreadcrumbSchema() {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (!breadcrumbs) return;
        
        const items = breadcrumbs.querySelectorAll('a');
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };
        
        items.forEach((item, index) => {
            schema.itemListElement.push({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.textContent,
                "item": item.href
            });
        });
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
    
    generateBreadcrumbSchema();
    
    // ==================== Accessibility Enhancements ====================
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menu.classList.toggle('show');
            }
        });
    });
    
    // ==================== Cookie Consent ====================
    function checkCookieConsent() {
        if (!localStorage.getItem('cookieConsent')) {
            const banner = document.createElement('div');
            banner.className = 'cookie-banner';
            banner.innerHTML = `
                <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                <button class="btn btn-primary" onclick="acceptCookies()">Accept</button>
            `;
            banner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--text-dark);
                color: white;
                padding: 1rem;
                text-align: center;
                z-index: 9999;
            `;
            document.body.appendChild(banner);
        }
    }
    
    window.acceptCookies = function() {
        localStorage.setItem('cookieConsent', 'true');
        document.querySelector('.cookie-banner').remove();
        
        // Initialize analytics after consent
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };
    
    checkCookieConsent();
});

// ==================== Utility Functions ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// ==================== Instagram Feed Widget ====================
async function loadInstagramFeed() {
    const feedContainer = document.getElementById('instagram-feed-widget');
    if (!feedContainer) return;
    
    // This is a placeholder - replace with actual Instagram API integration
    const posts = [
        { image: 'images/insta1.webp', link: 'https://www.instagram.com/p/1' },
        { image: 'images/insta2.webp', link: 'https://www.instagram.com/p/2' },
        { image: 'images/insta3.webp', link: 'https://www.instagram.com/p/3' },
        { image: 'images/insta4.webp', link: 'https://www.instagram.com/p/4' }
    ];
    
    const grid = document.createElement('div');
    grid.className = 'instagram-grid';
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;';
    
    posts.forEach(post => {
        const item = document.createElement('a');
        item.href = post.link;
        item.target = '_blank';
        item.rel = 'noopener';
        item.innerHTML = `<img src="${post.image}" alt="Instagram post" loading="lazy" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px;">`;
        grid.appendChild(item);
    });
    
    feedContainer.appendChild(grid);
}

loadInstagramFeed();

// ==================== Page Load Performance ====================
window.addEventListener('load', () => {
    // Log page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
            'name': 'page_load',
            'value': loadTime
        });
    }
});
