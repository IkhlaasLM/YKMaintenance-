
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

  // make sure the slides either side of this one have started loading, so a
  // lazy image is never blank by the time it slides into view
  function preloadAround(i) {
    [i - 1, i, i + 1].forEach(n => {
      const slide = slides[(n + slides.length) % slides.length];
      const img = slide && slide.querySelector('img[loading="lazy"]');
      if (img) img.loading = 'eager';
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    preloadAround(index);
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

/* ============================================================
   ENQUIRY FORM

   Right now, pressing "Send Enquiry" opens the customer's own email app
   with everything they typed already filled in, addressed to you. It works
   straight away with no account needed, but the customer has to press send
   in their mail app.

   TO GET ENQUIRIES DELIVERED STRAIGHT TO YOUR INBOX INSTEAD (2 minutes):
     1. Go to web3forms.com and enter youssufmo@hotmail.com
     2. They email you an access key - copy it
     3. Paste it between the quotes on the ACCESS_KEY line below
   The form then sends silently in the background and shows a thank-you
   message, without opening anything.
   ============================================================ */

const ACCESS_KEY = '';                       // <- paste your key between the quotes
const ENQUIRY_EMAIL = 'youssufmo@hotmail.com';

const enquiryForm = document.getElementById('enquiry-form');

if (enquiryForm) {
  const status = document.getElementById('form-status');
  const button = enquiryForm.querySelector('button[type="submit"]');

  enquiryForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(enquiryForm);

    const say = (message, kind) => {
      status.textContent = message;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    // No access key yet: fall back to the customer's own email app.
    if (!ACCESS_KEY) {
      const lines = [];
      for (const [field, value] of data.entries()) {
        if (value) lines.push(field.charAt(0).toUpperCase() + field.slice(1) + ': ' + value);
      }
      const subject = 'Website enquiry' + (data.get('service') ? ' - ' + data.get('service') : '');
      window.location.href = 'mailto:' + ENQUIRY_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      say('Your email app should now open with the details filled in \u2014 just press send. If nothing opened, call ' +
          '07513 349559 or email ' + ENQUIRY_EMAIL + ' directly.');
      return;
    }

    button.disabled = true;
    say('Sending\u2026');
    data.append('access_key', ACCESS_KEY);
    data.append('subject', 'New website enquiry - YK Property and Maintenance');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      const result = await response.json();
      if (result.success) {
        enquiryForm.reset();
        say('Thanks \u2014 your enquiry has been sent. You\u2019ll get a reply shortly.', 'ok');
      } else {
        throw new Error(result.message || 'Send failed');
      }
    } catch (err) {
      say('Sorry, that didn\u2019t send. Please call 07513 349559 or email ' + ENQUIRY_EMAIL + ' instead.', 'error');
    } finally {
      button.disabled = false;
    }
  });
}
