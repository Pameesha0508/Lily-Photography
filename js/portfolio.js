// Loads portfolio items from data/portfolio.json, filters them, and shows a modal
var gallery = document.getElementById('gallery');
var filters = document.getElementById('filters');
var modal = document.getElementById('modal');
var items = [], lastFocus = null;

function art(item) {
  if (item.image) {
    return 'url("' + item.image + '") center / cover no-repeat';
  }
  var c = item.colors || ['#5c7c8a', '#14262b'];
  return 'linear-gradient(160deg,' + c[0] + ',' + c[1] + ')';
}

function render(category) {
  gallery.innerHTML = '';
  items.filter(function (i) { return category === 'All' || i.category === category; })
    .forEach(function (i) {
      var b = document.createElement('button');
      b.className = 'card work';
      b.innerHTML = '<div class="work-art"></div><div class="work-info"><h3></h3><p class="meta"></p></div>';
      var cardArt = b.querySelector('.work-art');
      cardArt.style.background = art(i);
      cardArt.setAttribute('role', 'img');
      cardArt.setAttribute('aria-label', i.alt || i.title);
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
  var mArt = document.getElementById('modalArt');
  mArt.style.background = art(i);
  mArt.setAttribute('role', 'img');
  mArt.setAttribute('aria-label', i.alt || i.title);
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
  .catch(function (err) {
    console.error(err);
    gallery.innerHTML = '<p>Could not load the portfolio. Check data/portfolio.json and the console (F12).</p>';
  });
