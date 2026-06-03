// ==========================================
// P6 DOMICILIOS — main.js
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAV SCROLL ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- BURGER MENU ----
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });

  // ---- COPY BUTTONS ----
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.copy;
      navigator.clipboard.writeText(num).then(() => {
        const original = btn.textContent;
        btn.textContent = '✅';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        btn.textContent = '📋';
      });
    });
  });

  // ---- SCHEDULE STATUS ----
  function checkSchedule() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...5=Fri, 6=Sat
    const h = now.getHours();
    const m = now.getMinutes();
    const time = h * 60 + m;

    const afternoon = { start: 14 * 60, end: 20 * 60 }; // 2PM - 8PM
    const morning = { start: 9 * 60, end: 12 * 60 };    // 9AM - 12PM

    let isOpen = false;

    if (day >= 1 && day <= 5) {
      // Monday to Friday: only afternoon
      isOpen = time >= afternoon.start && time < afternoon.end;
    } else {
      // Saturday & Sunday: morning + afternoon
      isOpen =
        (time >= morning.start && time < morning.end) ||
        (time >= afternoon.start && time < afternoon.end);
    }

    const el = document.getElementById('scheduleStatus');
    if (!el) return;
    if (isOpen) {
      el.textContent = '🟢 Estamos abiertos ahora';
      el.className = 'schedule__status open';
    } else {
      el.textContent = '🔴 Cerrado en este momento';
      el.className = 'schedule__status closed';
    }
  }
  checkSchedule();
  setInterval(checkSchedule, 60000);

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll(
    '.service-card, .step, .info-card, .about__text, .about__graphic, .section-header'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.index || 0) * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // ---- SMOOTH ANCHOR ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- WA FLOAT HIDE ON HERO ----
  const waFloat = document.getElementById('waFloat');
  window.addEventListener('scroll', () => {
    waFloat.style.opacity = window.scrollY > 200 ? '1' : '0';
    waFloat.style.pointerEvents = window.scrollY > 200 ? 'all' : 'none';
  });
  waFloat.style.opacity = '0';
  waFloat.style.transition = 'opacity 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease';

});
