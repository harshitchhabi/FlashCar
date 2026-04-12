/**
 * NotificationCenter.jsx — Toast Notification Display
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatTime_24BCI0098 } from '../../utils/dateFormatter';

// Icon map for notification types — harshitChhabiNotifIcons
const harshitChhabiNotifIcons = {
  success: (
    <svg className="gr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg className="gr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg className="gr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg className="gr-toast-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export default function NotificationCenter_HarshitChhabi() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="gr-toast-container" id="notification-center-24BCI0098">
      <AnimatePresence>
        {notifications.slice(0, 5).map((notif) => (
          <motion.div
            key={notif.id}
            className={`gr-toast gr-toast-${notif.type}`}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            layout
          >
            {harshitChhabiNotifIcons[notif.type] || harshitChhabiNotifIcons.info}
            <div className="gr-toast-content">
              <p className="gr-toast-message">{notif.message}</p>
              <span className="gr-toast-time">{formatTime_24BCI0098(notif.timestamp)}</span>
            </div>
            <button
              className="gr-toast-dismiss"
              onClick={() => removeNotification(notif.id)}
              aria-label="Dismiss"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
