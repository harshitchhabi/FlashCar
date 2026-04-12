/**
 * NotificationContext.jsx — Toast Notification System
 * GreenRoute — Developed by Harshit Chhabi (24BCI0098)
 */
import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext_24BCI0098 = createContext();

export const useNotifications = () => useContext(NotificationContext_24BCI0098);

export function NotificationProvider_HarshitChhabi({ children }) {
  const [notifications, setNotifications] = useState([]);

  // addNotification — add a toast notification (24BCI0098)
  const addNotification = useCallback((message, type = 'info', autoClose = true) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNotification = {
      id,
      message,
      type, // 'info' | 'success' | 'warning' | 'error'
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    if (autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }

    return id;
  }, []);

  // removeNotification — dismiss by id
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // clearNotifications — dismiss all
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <NotificationContext_24BCI0098.Provider value={value}>
      {children}
    </NotificationContext_24BCI0098.Provider>
  );
}
