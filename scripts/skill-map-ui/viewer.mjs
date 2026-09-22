for (const control of document.querySelectorAll('[data-submit]')) {
  control.addEventListener('change', () => control.form.requestSubmit());
}
document.querySelectorAll('.apply').forEach(button => { button.hidden = true; });
document.addEventListener('click', event => {
  const row = event.target.closest('tr[data-href]');
  if (row && !event.target.closest('a, button, details, input, select') && !window.getSelection().toString()) {
    window.location.assign(row.dataset.href);
  }
});
if (window.location.hash === '#graph-heading') document.querySelector('#graph-heading')?.focus({ preventScroll: true });
