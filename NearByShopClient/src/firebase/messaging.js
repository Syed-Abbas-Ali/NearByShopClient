import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      await sendTokenToServer(token);
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

// Send token to server
export const sendTokenToServer = async (token) => {
  try {
    const accessToken = await AsyncStorage.getItem('token');
    if (!accessToken) return;

    const response = await fetch(`https://api.waytoshops.com/api/v1/global/notification/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token, platform: 'android' }),
    });

    if (!response.ok) {
      throw new Error('Failed to save token');
    }
    console.log("Token sent to server successfully.");
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

// Setup Firebase messaging
export const setupFirebaseMessaging = async () => {
  // Request permission
  await requestNotificationPermission();

  // Handle background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  // Handle foreground messages
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message received:', remoteMessage);
    // You can show a local notification here
  });

  // Handle notification open
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification caused app to open:', remoteMessage);
    // Navigate to appropriate screen based on notification data
  });

  // Check if app was opened from a notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from quit state:', remoteMessage);
        // Navigate to appropriate screen based on notification data
      }
    });

  return unsubscribe;
};