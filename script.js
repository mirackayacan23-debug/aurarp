// Basit parallax efekt
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  hero.style.backgroundPositionY = -(window.scrollY * 0.3) + 'px';
});
