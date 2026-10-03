// Shop: loads data/portfolio.json + photographer uploads, filters, modal, add to cart
var gallery = document.getElementById('gallery');
var filters = document.getElementById('filters');
var modal = document.getElementById('modal');
var items = [], lastFocus = null, current = null;
var closeBtn = document.getElementById('modalClose');
closeBtn.style.zIndex = '5'; // keep the close button above the photo

function art(item) {
  if (item.image && /^(images\/|data:image\/)/.test(item.image)) {
    return 'url("' + item.image + '") center / cover no-repeat';
  }
  var c = item.colors || ['#5c7c8a', '#0f1a2e'];
  return 'linear-gradient(160deg,' + c[0] + ',' + c[1] + ')';
}
function money(n) { return '$' + Number(n).toFixed(2); }

function render(category) {
  gallery.innerHTML = '';
  items.filter(function (i) { return category === 'All' || i.category === category; })
    .forEach(function (i) {
      var card = document.createElement('article');
      card.className = 'card work glass';
      card.innerHTML = '<button class="work-art"></button><div class="work-info"><h3></h3><p class="meta"></p><div class="buy-row"><span class="price"></span><button class="btn small">Buy licence</button></div></div>';
      var a = card.querySelector('.work-art');
      a.style.background = art(i);
      a.setAttribute('aria-label', 'View ' + i.title + ': ' + (i.alt || ''));
      a.addEventListener('click', function () { openModal(i); });
      card.querySelector('h3').textContent = i.title;
      card.querySelector('.meta').textContent = i.photographer + ', ' + i.category;
      card.querySelector('.price').textContent = "From " + money(i.price);
      card.querySelector('.btn').addEventListener('click', function () { Licence.open(i); });
      gallery.appendChild(card);
    });
}

function buildFilters() {
  var cats = ['All'].concat(items.map(function (i) { return i.category; }).filter(function (c, n, a) { return a.indexOf(c) === n; }));
  cats.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'filter'; b.textContent = c;
    b.setAttribute('aria-pressed', c === 'All');
    b.addEventListener('click', function () {
      filters.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      render(c);
    });
    filters.appendChild(b);
  });
}

function openModal(i) {
  current = i; lastFocus = document.activeElement;
  var m = document.getElementById('modalArt');
  m.style.background = art(i);
  m.setAttribute('role', 'img'); m.setAttribute('aria-label', i.alt || i.title);
  document.getElementById('modalTitle').textContent = i.title;
  document.getElementById('modalMeta').textContent = i.photographer + (i.location ? ', ' + i.location : '');
  document.getElementById('modalText').textContent = i.description || '';
  document.getElementById('modalPrice').textContent = "From " + money(i.price);
  modal.hidden = false;
  document.getElementById('modalClose').focus();
}
function closeModal() { modal.hidden = true; if (lastFocus) lastFocus.focus(); }

document.getElementById('modalAdd').addEventListener('click', function () { closeModal(); Licence.open(current); });
document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

fetch('data/portfolio.json')
  .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function (data) {
    var mine = [];
    try { mine = JSON.parse(localStorage.getItem('userWorks')) || []; } catch (e) {}
    items = data.concat(mine);
    buildFilters(); render('All');
  })
  .catch(function (err) {
    console.error(err);
    gallery.innerHTML = '<p>Could not load the shop. Check data/portfolio.json and the console (F12).</p>';
  });
