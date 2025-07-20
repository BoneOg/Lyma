import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '../components/Notification';

interface NotificationContextType {
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [counter, setCounter] = useState(0);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const newId = counter + 1;
    setCounter(newId);
    setNotifications(prev => [
      ...prev,
      { id: newId, message, type }
    ]);
  };

  const hideNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Fixed positioned container that handles the positioning */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end max-w-sm">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            isVisible={true}
            onClose={() => hideNotification(notification.id)}
            position="bottom-right" // This prop is now ignored by the component
            duration={4000}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};