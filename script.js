const header = document.getElementById('header');
const loader = document.getElementById('loader');
const reveals = document.querySelectorAll('.reveal');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const heroBg = document.querySelector('.hero__bg');

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 450);
});

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'in-view');
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((item) => observer.observe(item));

window.addEventListener('scroll', () => {
  updateHeader();
  if (heroBg) {
    const offset = window.scrollY * 0.18;
    heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
  }
});

updateHeader();

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.ripple').forEach((button) => {
  button.addEventListener('click', (event) => {
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--x', `${event.clientX - rect.left}px`);
    button.style.setProperty('--y', `${event.clientY - rect.top}px`);
    button.classList.remove('rippling');
    void button.offsetWidth;
    button.classList.add('rippling');
  });
});

// Simple mock form handling to keep page behavior polished.
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.textContent = 'Skickat! Vi hör av oss snart';
  submitButton.disabled = true;
});
