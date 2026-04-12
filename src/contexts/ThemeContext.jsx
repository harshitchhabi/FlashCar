/**
 * ThemeContext.jsx — Dark/Light Mode Provider
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext_24BCI0098 = createContext();

export const useTheme = () => useContext(ThemeContext_24BCI0098);

export function ThemeProvider_HarshitChhabi({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('greenroute_theme_24BCI0098');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('greenroute_theme_24BCI0098', theme);
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext_24BCI0098.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext_24BCI0098.Provider>
  );
}
