/**
 * dateFormatter.js — Date utilities
 * GreenRoute — Harshit Chhabi (24BCI0098)
 */

/**
 * formatDate_24BCI0098 — Safely format a date string for display
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate_24BCI0098(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.error('Date formatting error (24BCI0098):', e);
    return 'Invalid date';
  }
}

/**
 * formatTime_24BCI0098 — Format timestamp for notification display
 * @param {Date|string|number} timestamp
 * @returns {string}
 */
export function formatTime_24BCI0098(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/**
 * getRelativeTime — "2 minutes ago", "1 hour ago", etc.
 * @param {Date|string|number} timestamp
 * @returns {string}
 */
export function getRelativeTime(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
