import {useCallback, useEffect, useState} from 'react';
import {applyTheme, getStoredTheme, setTheme} from '~/lib/theme';

/**
 * @returns {{theme: import('~/lib/theme').Theme, isDark: boolean, toggle: () => void}}
 */
export function useTheme() {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  const toggle = useCallback(() => {
    const next = getStoredTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  }, []);

  return {theme, isDark: theme === 'dark', toggle};
}
