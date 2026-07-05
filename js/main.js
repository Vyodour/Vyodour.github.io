import { TechShooter } from '../components/organisms/tech-shooter/shooter.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('shooter-area')) {
        new TechShooter();
    }

    setupTabs();
    setupNavbarSpy();
    setupScrollAnimations();
    setupMarquee();
    setupProjectModal();
    setupContactForm();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetEl = document.getElementById(`content-${targetTab}`);
            if (targetEl) targetEl.classList.add('active');
        });
    });
}

function setupNavbarSpy() {
    const sections = document.querySelectorAll('.panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const container = document.getElementById('app-container');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { root: container, threshold: 0.5 });

    sections.forEach(sec => observer.observe(sec));
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            container.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('.fade-section');

    const observerOptions = {
        root: document.getElementById('app-container'),
        threshold: 0.5
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    sections.forEach(sec => {
        fadeObserver.observe(sec);
    });
}

function setupMarquee() {
    const containers = document.querySelectorAll('.marquee-container');
    if (!containers) return;

    containers.forEach(container => {
        const track = container.querySelector('.marquee-track');
        if (!track) return;
        
        const cards = track.querySelectorAll('.shadcn-card');
        
        if (cards.length <= 3) {
            track.classList.add('slide-carousel-track');
            
            let currentIndex = 0;

            function updateCarousel() {
                cards.forEach((card, i) => {
                    card.classList.remove('slide-active', 'slide-prev', 'slide-next');
                    
                    if (i === currentIndex) {
                        card.classList.add('slide-active');
                    } else if (cards.length === 2) {
                        if (currentIndex === 0) {
                            card.classList.add('slide-next');
                        } else {
                            card.classList.add('slide-prev');
                        }
                    } else if (i === (currentIndex - 1 + cards.length) % cards.length) {
                        card.classList.add('slide-prev');
                    } else if (i === (currentIndex + 1) % cards.length) {
                        card.classList.add('slide-next');
                    }
                });
            }

            if (cards.length > 0) {
                updateCarousel();
            }
            
            if (cards.length > 1) {
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % cards.length;
                    updateCarousel();
                }, 4000); 
            }
        } 
        else {
            const clone = track.innerHTML;
            track.innerHTML += clone;
            track.style.width = 'max-content'; 
        }
    });
}

function setupProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalLink = document.getElementById('modal-link');
    const closeBtn = document.getElementById('close-modal');

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.interactive-card');
        if (card) {
            const title = card.getAttribute('data-title') || 'Proyek';
            const desc = card.getAttribute('data-desc') || '';
            const img = card.getAttribute('data-img') || '';
            const link = card.getAttribute('data-link') || '#';
            const techs = card.getAttribute('data-tech');

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalLink.href = link;
            
            if (img) {
                modalImg.src = img;
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none';
            }

            modalTech.innerHTML = '';
            if (techs) {
                const techArray = techs.split(',');
                techArray.forEach(tech => {
                    const span = document.createElement('span');
                    span.className = 'badge';
                    span.textContent = tech.trim();
                    modalTech.appendChild(span);
                });
            }

            modal.classList.add('active');
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function setupContactForm() {
    const contactForm = document.querySelector('.shadcn-form');
    const sendBtn = document.getElementById('send-btn');
    const nameInput = document.getElementById('name_field');
    const emailInput = document.getElementById('email_field');
    const realReplyTo = document.getElementById('real_replyto');
    const messageInput = document.getElementById('message_field');

    if (!contactForm || !sendBtn) return;
    const triggerBlink = (element) => {
        if (!element) return;
        
        element.animate([
            { backgroundColor: 'transparent', borderColor: '#27272a', boxShadow: 'none' },
            { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#ffffff', boxShadow: '0 0 20px rgba(255, 255, 255, 0.9)', color: '#000000', offset: 0.5 },
            { backgroundColor: 'transparent', borderColor: '#27272a', boxShadow: 'none' }
        ], {
            duration: 300,
            iterations: 1,
            easing: 'ease-in-out'
        });
    };

    sendBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let isValid = true;

        if (!nameInput.value.trim()) {
            isValid = false;
            triggerBlink(nameInput);
        }

        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            isValid = false;
            triggerBlink(emailInput);
        }

        if (!messageInput.value.trim()) {
            isValid = false;
            triggerBlink(messageInput);
        }

        if (isValid) {
            realReplyTo.value = emailVal;
            contactForm.submit();
        }
    });
}