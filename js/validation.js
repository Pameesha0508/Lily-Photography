// Contact form validation (JS Validation Developer)
var form = document.getElementById('contactForm');
var status = document.getElementById('formStatus');
var rules = {
  name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).'; },
  email: function (v) {
    if (!v.trim()) return 'Enter your email address.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, like name@example.com.';
  },
  message: function (v) { return v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.'; }
};

function check(field) {
  var input = form.elements[field];
  var msg = rules[field](input.value);
  document.getElementById(field + 'Error').textContent = msg;
  input.classList.toggle('invalid', !!msg);
  input.setAttribute('aria-invalid', !!msg);
  return !msg;
}

Object.keys(rules).forEach(function (f) {
  form.elements[f].addEventListener('blur', function () { check(f); });
  form.elements[f].addEventListener('input', function () { if (form.elements[f].classList.contains('invalid')) check(f); });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  status.textContent = '';
  var results = Object.keys(rules).map(check);
  var firstBad = Object.keys(rules)[results.indexOf(false)];
  if (firstBad) { form.elements[firstBad].focus(); return; }
  // No backend in this project: simulate a send. To really send, point the form at a service such as Formspree.
  status.textContent = 'Message sent. Thank you, ' + form.elements.name.value.trim() + '. I will reply within two working days.';
  form.reset();
});
