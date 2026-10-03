// Lets any photographer list a photo (saved in this browser's localStorage)
var form = document.getElementById('sellForm');
var status = document.getElementById('sellStatus');

function fail(id, msg) { document.getElementById(id + 'Error').textContent = msg; return !msg; }

function shrink(file, cb) { // resize to max 900px so localStorage does not fill up
  var reader = new FileReader();
  reader.onload = function () {
    var img = new Image();
    img.onload = function () {
      var s = Math.min(1, 900 / Math.max(img.width, img.height));
      var c = document.createElement('canvas');
      c.width = img.width * s; c.height = img.height * s;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = function () { cb(null); };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  status.textContent = '';
  var f = form.elements, file = f.photo.files[0], price = parseFloat(f.price.value);
  var ok = [
    fail('seller', f.seller.value.trim().length >= 2 ? '' : 'Enter your name.'),
    fail('title', f.title.value.trim().length >= 2 ? '' : 'Enter a title for the photo.'),
    fail('price', price > 0 ? '' : 'Enter a price greater than 0.'),
    fail('photo', file && /^image\//.test(file.type) && file.size < 8e6 ? '' : 'Choose an image file under 8 MB.')
  ].every(Boolean);
  if (!ok) return;

  shrink(file, function (data) {
    if (!data) { fail('photo', 'That file could not be read as an image.'); return; }
    var mine = [];
    try { mine = JSON.parse(localStorage.getItem('userWorks')) || []; } catch (err) {}
    mine.push({ id: 'u' + Date.now(), title: f.title.value.trim(), photographer: f.seller.value.trim(),
      price: price, category: f.category.value, year: new Date().getFullYear(), image: data,
      alt: f.title.value.trim(), description: f.description.value.trim() });
    try {
      localStorage.setItem('userWorks', JSON.stringify(mine));
      status.innerHTML = 'Listed! <a href="portfolio.html">See it in the shop</a>.';
      form.reset();
    } catch (err) {
      status.textContent = 'Browser storage is full. Try a smaller photo.';
    }
  });
});
