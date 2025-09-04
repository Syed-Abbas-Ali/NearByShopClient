import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission, sendTokenToServer } from './messaging';
import './NotificationBanner.scss';

const NotificationBanner = ({ userId, onTokenReceived }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Notification.permission === 'default') {
      setShowBanner(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        await sendTokenToServer(token);
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="notification-banner">
      <div className="banner-content">
        <div className="banner-header">
          <Bell className="icon" />
          <div className="banner-text">
            <h3>Enable Notifications</h3>
            <p>Get notified about new messages and offers instantly</p>
          </div>
          <button className="close-button" onClick={handleDismiss}>
            <X className="icon-small" />
          </button>
        </div>

        <div className="banner-actions">
          <button
            className="enable-button"
            onClick={handleEnableNotifications}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner" />
            ) : (
              <Check className="icon-small" />
            )}
            <span>Enable</span>
          </button>
          <button className="later-button" onClick={handleDismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
