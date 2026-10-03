// Hamburger menu for mobile
var menuBtn = document.getElementById('menuBtn');
var nav = document.getElementById('nav');
menuBtn.addEventListener('click', function () {
  var open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
