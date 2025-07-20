import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';
import { accessTokenValue } from '../utils/authenticationToken';

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BEsXO0TPY6NE6KLx3E-Q8eey6v212Zvmxve5V5wKAvMO9e1QR6uiAEh3mXJ6TBMpWbaNJylvwVK13xudON1wXBw' // Generate this in Firebase Console
      });

      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, callback);
};

// Send token to server
export const sendTokenToServer = async (token) => {
  console.log(accessTokenValue())
  try {
    const response = await fetch(`https://api.waytoshops.com/api/v1/global/notification/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessTokenValue()}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to save token');
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};


