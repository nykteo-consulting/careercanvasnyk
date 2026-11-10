// Runs in <head> before first paint: theme and motion preference, no flash.
(function () {
  var root = document.documentElement;
  var dark = null, motion = null;
  try {
    dark = localStorage.getItem('darkMode');
    motion = localStorage.getItem('motion');
  } catch (e) {}
  if (dark === null) dark = root.getAttribute('data-default-theme') !== 'light' ? 'true' : 'false';
  if (motion !== 'on' && motion !== 'off') {
    motion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'on';
  }
  root.classList.toggle('dark', dark === 'true');
  root.setAttribute('data-motion', motion);
  root.classList.add('js');
})();
