
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuBtn.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
  });
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuBtn) menuBtn.textContent = '☰';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================================
   PHOTO CAROUSELS
   Any element with data-carousel becomes a carousel automatically.
   ============================================================ */

document.querySelectorAll('[data-carousel]').forEach(setupCarousel);

function setupCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const viewport = root.querySelector('.carousel-viewport');
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const prevBtn = root.querySelector('.carousel-prev');
  const nextBtn = root.querySelector('.carousel-next');
  const dotsWrap = root.querySelector('.carousel-dots');
  const counter = root.querySelector('.carousel-counter');

  if (!track || slides.length === 0) return;

  // If a photo file hasn't been added yet, show a tidy placeholder
  // instead of a broken image icon.
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (!img) return;
    const flagMissing = () => {
      if (slide.classList.contains('is-missing')) return;
      slide.classList.add('is-missing');
      const note = document.createElement('div');
      note.className = 'slide-missing';
      note.textContent = 'Add photo: ' + img.getAttribute('src');
      slide.prepend(note);
    };
    img.addEventListener('error', flagMissing);
    if (img.complete && img.naturalWidth === 0) flagMissing();
  });

  let index = 0;
  const dots = [];
  const autoplayDelay = parseInt(root.getAttribute('data-autoplay') || '0', 10);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;

  if (slides.length < 2) {
    root.classList.add('is-single');
  } else if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Photo ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * index) + '%)';
    dots.forEach((dot, n) => dot.classList.toggle('active', n === index));
    slides.forEach((slide, n) => slide.setAttribute('aria-hidden', n === index ? 'false' : 'true'));
    if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
    restart();
  }

  function play() {
    if (!autoplayDelay || reduceMotion || slides.length < 2) return;
    timer = setInterval(() => goTo(index + 1), autoplayDelay);
  }

  function pause() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restart() {
    if (timer) { pause(); play(); }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(index + 1); }
  });

  // swipe on touch screens
  if (viewport) {
    let startX = 0, startY = 0, tracking = false;
    viewport.addEventListener('touchstart', event => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    viewport.addEventListener('touchend', event => {
      if (!tracking) return;
      tracking = false;
      const dx = event.changedTouches[0].clientX - startX;
      const dy = event.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) goTo(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
  }

  // autoplay pauses on hover, on keyboard focus, and when the tab is hidden
  if (autoplayDelay && !reduceMotion && slides.length > 1) {
    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { pause(); } else { play(); }
    });
    play();
  }

  goTo(0);
}
