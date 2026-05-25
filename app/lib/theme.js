/** @typedef {'light' | 'dark'} Theme */

export const THEME_STORAGE_KEY = 'candy-theme';

/** @returns {Theme} */
export function getStoredTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

/** @param {Theme} theme */
export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/** @param {Theme} theme */
export function setTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

/** @returns {Theme} */
export function toggleTheme() {
  const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/** Inline script for Layout — applies stored theme before first paint. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
