import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission, sendTokenToServer } from './messaging';
import './NotificationBanner.scss';

const NotificationBanner = ({ userId, onTokenReceived }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // *** MODIFIED LOGIC ***
  // Check if running inside our Android WebView
  const isAndroidApp = window.Android && typeof window.Android.requestNotifications === 'function';

  useEffect(() => {
    // Only show the web banner if NOT in the Android app
    // and permission is 'default'
    if (!isAndroidApp && Notification.permission === 'default') {
      setShowBanner(true);
    }
  }, [isAndroidApp]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      // *** MODIFIED LOGIC ***
      // If inside the Android app, call the native code.
      // Otherwise, use the web permission flow.
      if (isAndroidApp) {
        console.log("Calling native Android function for notifications...");
        window.Android.requestNotifications();
        // The banner will be hidden by the dismiss button, as native prompt appears
      } else {
        const token = await requestNotificationPermission();
        if (token) {
          await sendTokenToServer(token);
          if (onTokenReceived) onTokenReceived(token);
          setShowBanner(false);
        }
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