const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener('load', () => {
  setTimeout(() => $('#preloader')?.classList.add('hide'), 500);
});

$('#year').textContent = new Date().getFullYear();

const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded','false');
}));

const slides = $$('.hero-slide');
const dots = $('#sliderDots');
let currentSlide = 0;
let sliderTimer;
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Ir para o slide ${i+1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dots.appendChild(dot);
});
function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((s,i) => s.classList.toggle('active', i === currentSlide));
  $$('.slider-dot').forEach((d,i) => d.classList.toggle('active', i === currentSlide));
  restartSlider();
}
function restartSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 6500);
}
$('#nextSlide')?.addEventListener('click', () => goToSlide(currentSlide + 1));
$('#prevSlide')?.addEventListener('click', () => goToSlide(currentSlide - 1));
restartSlider();

$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.product-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
    });
  });
});

$$('.product-link').forEach(link => {
  link.addEventListener('click', () => {
    const product = link.dataset.product;
    const message = $('#message');
    if (message) message.value = `Gostaria de obter informações sobre: ${product}.`;
    $('#service').value = 'Peças e componentes';
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
$$('.reveal').forEach(el => observer.observe(el));

const backTop = $('#backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 600);
});
backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

$('#quoteForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const phone = $('#phone').value.trim();
  const vehicle = $('#vehicle').value.trim();
  const service = $('#service').value;
  const message = $('#message').value.trim();
  const text = `Olá, Jupes Diesel! Gostaria de solicitar um orçamento.%0A%0ANome: ${encodeURIComponent(name)}%0AContacto: ${encodeURIComponent(phone)}%0AViatura: ${encodeURIComponent(vehicle || 'Não indicado')}%0AServiço: ${encodeURIComponent(service || 'A confirmar')}%0ADescrição: ${encodeURIComponent(message || 'Gostaria de receber mais informações.')}`;
  $('#formSuccess').textContent = 'A abrir o WhatsApp com o seu pedido...';
  window.open(`https://wa.me/244941888600?text=${text}`, '_blank', 'noopener');
});

let startX = 0;
$('.hero')?.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, {passive:true});
$('.hero')?.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].screenX - startX;
  if (Math.abs(delta) > 50) goToSlide(currentSlide + (delta < 0 ? 1 : -1));
}, {passive:true});
