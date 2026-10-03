// Loads portfolio items from data/portfolio.json, filters them, and shows a modal
var gallery = document.getElementById('gallery');
var filters = document.getElementById('filters');
var modal = document.getElementById('modal');
var items = [], lastFocus = null;

function art(c) { return 'linear-gradient(160deg,' + c[0] + ',' + c[1] + ')'; }

function render(category) {
  gallery.innerHTML = '';
  items.filter(function (i) { return category === 'All' || i.category === category; })
    .forEach(function (i) {
      var b = document.createElement('button');
      b.className = 'card work';
      b.innerHTML = '<div class="work-art"></div><div class="work-info"><h3></h3><p class="meta"></p></div>';
      b.querySelector('.work-art').style.background = art(i.colors);
      b.querySelector('h3').textContent = i.title;
      b.querySelector('.meta').textContent = i.category + ', ' + i.year;
      b.addEventListener('click', function () { openModal(i); });
      gallery.appendChild(b);
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
  lastFocus = document.activeElement;
  document.getElementById('modalArt').style.background = art(i.colors);
  document.getElementById('modalTitle').textContent = i.title;
  document.getElementById('modalMeta').textContent = i.location + ', ' + i.year;
  document.getElementById('modalText').textContent = i.description;
  modal.hidden = false;
  document.getElementById('modalClose').focus();
}
function closeModal() { modal.hidden = true; if (lastFocus) lastFocus.focus(); }

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

fetch('data/portfolio.json')
  .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function (data) { items = data; buildFilters(); render('All'); })
  .catch(function () {
    gallery.innerHTML = '<p>Could not load the portfolio. Run the site through a local server (see README).</p>';
  });
