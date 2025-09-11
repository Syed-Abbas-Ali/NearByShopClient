import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';
import { accessTokenValue } from '../utils/authenticationToken';

// Request notification permission and get FCM token FOR WEB BROWSERS
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BEsXO0TPY6NE6KLx3E-Q8eey6v212Zvmxve5V5wKAvMO9e1QR6uiAEh3mXJ6TBMpWbaNJylvwVK13xudON1wXBw'
      });

      console.log('FCM Token (from Web):', token);
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

// Send token to server (This function is now used by both web and mobile)
export const sendTokenToServer = async (token) => {
  console.log("Access Token:", accessTokenValue());
  try {
    const response = await fetch(`https://api.waytoshops.com/api/v1/global/notification/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessTokenValue()}`,
      },
      body: JSON.stringify({ token, platform: 'android' }), // Added platform for clarity
    });

    if (!response.ok) {
      throw new Error('Failed to save token');
    }
    console.log("Token sent to server successfully.");
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

// *** NEW CODE STARTS HERE ***
// This function is the "bridge" that Android will call.
// We attach it to the window object to make it globally accessible.
window.handleAndroidToken = (token) => {
  console.log('Received FCM Token from Android App:', token);
  if (token) {
    // Use the same function to send the token to your server
    sendTokenToServer(token);
  } else {
    console.error('Android app sent an empty token.');
  }
};