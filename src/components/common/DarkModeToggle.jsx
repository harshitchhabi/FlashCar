/**
 * DarkModeToggle.jsx — Theme Toggle Button
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { useTheme } from '../../contexts/ThemeContext';

export default function DarkModeToggle_24BCI0098() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="gr-btn-icon"
      id="dark-mode-toggle-24BCI0098"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
      style={{
        background: 'var(--gr-bg-secondary)',
        border: '1px solid var(--gr-border)',
        color: 'var(--gr-text-primary)',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
