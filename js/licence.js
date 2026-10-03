// Pay-to-download licence dialog (demo: no real payment)
(function () {
  var TIERS = [
    { id: 'personal', name: 'Personal', mult: 1, desc: 'Screens and prints for yourself. No business use or resale.' },
    { id: 'commercial', name: 'Commercial', mult: 2.5, desc: 'Websites, ads and products for one business, up to 10,000 copies.' },
    { id: 'extended', name: 'Extended', mult: 5, desc: 'Unlimited copies, merchandise and products for resale.' }
  ];
  var m, item, tier = TIERS[0];

  function cost(t) { return (item.price * t.mult).toFixed(2); }
  function $(id) { return document.getElementById(id); }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  function build() {
    m = document.createElement('div');
    m.className = 'modal'; m.hidden = true;
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'licTitle');
    m.innerHTML = '<div class="modal-box glass"><button class="modal-close" id="licClose" aria-label="Close">&times;</button>' +
      '<h2 id="licTitle"></h2><p class="meta" id="licBy"></p>' +
      '<form id="licForm" novalidate><fieldset class="tiers"><legend>Choose a licence</legend><div id="licTiers"></div></fieldset>' +
      '<div class="field"><label for="licName">Your name</label><input id="licName" type="text" autocomplete="name"><span class="error" id="licNameError" role="alert"></span></div>' +
      '<div class="field"><label for="licEmail">Email</label><input id="licEmail" type="email" autocomplete="email"><span class="error" id="licEmailError" role="alert"></span></div>' +
      '<button class="btn" type="submit" id="licPay"></button><p class="meta">Demo checkout: no card details are collected and nothing is charged.</p></form>' +
      '<div id="licDone" hidden><h3>Payment confirmed (demo)</h3><p id="licMsg"></p>' +
      '<p class="btn-row"><a class="btn" id="licPhoto">Download photo</a><a class="btn ghost" id="licDoc">Download licence</a></p></div></div>';
    document.body.appendChild(m);
    $('licClose').addEventListener('click', close);
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) close(); });
    $('licForm').addEventListener('submit', pay);
  }

  function close() { m.hidden = true; }

  function open(it) {
    if (!m) build();
    item = it; tier = TIERS[0];
    $('licTitle').textContent = it.title;
    $('licBy').textContent = 'Photo by ' + it.photographer;
    var box = $('licTiers'); box.innerHTML = '';
    TIERS.forEach(function (t, n) {
      var l = document.createElement('label'); l.className = 'tier';
      var r = document.createElement('input'); r.type = 'radio'; r.name = 'tier'; r.value = t.id; r.checked = n === 0;
      r.addEventListener('change', function () { tier = t; $('licPay').textContent = 'Pay $' + cost(t) + ' and download'; });
      var s = document.createElement('span');
      s.innerHTML = '<strong></strong> <em></em><br><small></small>';
      s.querySelector('strong').textContent = t.name;
      s.querySelector('em').textContent = '$' + cost(t);
      s.querySelector('small').textContent = t.desc;
      l.appendChild(r); l.appendChild(s); box.appendChild(l);
    });
    $('licPay').textContent = 'Pay $' + cost(tier) + ' and download';
    ['licName', 'licEmail'].forEach(function (id) { $(id).value = ''; $(id + 'Error').textContent = ''; });
    $('licForm').hidden = false; $('licDone').hidden = true;
    m.hidden = false;
    box.querySelector('input').focus();
  }

  function pay(e) {
    e.preventDefault();
    var name = $('licName').value.trim(), email = $('licEmail').value.trim();
    var okName = name.length >= 2, okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    $('licNameError').textContent = okName ? '' : 'Enter your name.';
    $('licEmailError').textContent = okMail ? '' : 'Enter a valid email, like name@example.com.';
    if (!okName || !okMail) return;

    var id = 'LP-' + Date.now().toString(36).toUpperCase();
    var photo = $('licPhoto'), doc = $('licDoc');

    if (item.image && /^(images\/|data:image\/)/.test(item.image)) {
      photo.href = item.image;
      photo.download = slug(item.title) + (/png/.test(item.image) ? '.png' : '.jpg');
    } else { // placeholder item: generate an image from its colours
      var c = document.createElement('canvas'); c.width = 1600; c.height = 1200;
      var ctx = c.getContext('2d'), col = item.colors || ['#5c7c8a', '#0f1a2e'];
      var g = ctx.createLinearGradient(0, 0, 1600, 1200); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1600, 1200);
      photo.href = c.toDataURL('image/png'); photo.download = slug(item.title) + '.png';
    }

    var text = 'LICENCE ' + id + '\n\nWork: ' + item.title + '\nPhotographer: ' + item.photographer +
      '\nLicence type: ' + tier.name + '\nTerms: ' + tier.desc + '\nPrice paid: $' + cost(tier) +
      '\nLicensed to: ' + name + ' <' + email + '>\nDate: ' + new Date().toDateString() +
      '\n\nCopyright stays with the photographer. This is a demo licence for a class project and is not legally binding.\n';
    doc.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    doc.download = 'licence-' + id + '.txt';

    $('licMsg').textContent = tier.name + ' licence ' + id + ' issued to ' + name + '. Download both files and keep the licence with the photo.';
    $('licForm').hidden = true; $('licDone').hidden = false;
    photo.focus();
  }

  window.Licence = { open: open };
})();
