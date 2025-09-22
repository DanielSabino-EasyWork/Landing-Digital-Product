// Utility: get URL params
    const getParam = (key) => new URLSearchParams(window.location.search).get(key);

    // Quick personalization by product type
    const productMap = {
      course: { label:'Online course', keyword:'your skill', noun:'course', ctaBuy:'Buy now' },
      app:   { label:'Mobile app', keyword:'your productivity', noun:'app',   ctaBuy:'Download app' },
      ebook: { label:'eBook', keyword:'your knowledge', noun:'eBook', ctaBuy:'Download eBook' }
    };

    const type = (getParam('type') || 'course').toLowerCase();
    const conf = productMap[type] || productMap.course;

    // Update dynamic texts
    const byId = (id) => document.getElementById(id);
    byId('hero-badge').textContent = conf.label;
    byId('hero-keyword').textContent = conf.keyword;
    byId('hero-product').textContent = conf.noun;
    byId('cta-verb-1').textContent = conf.ctaBuy;
    byId('feat-product').textContent = conf.noun;

    // Simple slider
    const slides = Array.from(document.querySelectorAll('.slide'));
    let i = 0;
    const show = (idx) => slides.forEach((el, n) => el.classList.toggle('active', n === idx));
    document.getElementById('prev').addEventListener('click', () => { i = (i - 1 + slides.length) % slides.length; show(i); });
    document.getElementById('next').addEventListener('click', () => { i = (i + 1) % slides.length; show(i); });

    // Swipe support for slider (basic)
    (() => {
      const frame = document.querySelector('.slider-frame');
      let startX = 0;
      const onTouchStart = (e) => { startX = e.touches[0].clientX; };
      const onTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          i = dx > 0 ? (i - 1 + slides.length) % slides.length : (i + 1) % slides.length;
          show(i);
        }
      };
      frame.addEventListener('touchstart', onTouchStart, { passive:true });
      frame.addEventListener('touchend', onTouchEnd, { passive:true });
    })();

    // Form validation (HTML5 + JS)
    const form = byId('ctaForm');
    const status = byId('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(!form.checkValidity()){
        e.stopPropagation();
        form.classList.add('was-validated');
        status.textContent = '';
        status.classList.replace('text-success','text-danger');
        status.textContent = 'Please review the highlighted fields.';
        return;
      }
      // Demo submit
      const data = Object.fromEntries(new FormData(form));
      status.classList.replace('text-danger','text-success');
      status.textContent = `Thanks, ${data.name}! We just emailed ${data.email}.`;
      form.reset();
      form.classList.remove('was-validated');
    });

    // Download button (demo)
    document.getElementById('btnDownload').addEventListener('click', () => {
      const blob = new Blob([`Thanks for downloading the ${conf.noun}.\nEnjoy your content.`], { type:'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href:url, download:`${conf.noun}-demo.txt` });
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    // Modal: enable pay when terms accepted
    const terms = document.getElementById('terms');
    const btnPay = document.getElementById('btnPay');
    terms.addEventListener('change', () => btnPay.disabled = !terms.checked);
    btnPay.addEventListener('click', () => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
      modal.hide();
      alert('Payment processed (demo). Integrate your real gateway here.');
    });

    // Offcanvas: close on link click
    const offcanvasEl = document.getElementById('navOffcanvas');
    offcanvasEl.addEventListener('click', (e) => {
      const target = e.target.closest('[data-nav-close]');
      if(target){
        const oc = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
        oc.hide();
      }
    });

    // Current year
    byId('year').textContent = new Date().getFullYear();