import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// const firebaseConfig = {
//   // Replace with your Firebase config
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "your-sender-id",
//   appId: "your-app-id"
// };


const firebaseConfig = {
  apiKey: "AIzaSyC5EJ8Ehnk1CwmOS8kPCjSltMKsJSIUs38",
  authDomain: "testing-f97c1.firebaseapp.com",
  projectId: "testing-f97c1",
  storageBucket: "testing-f97c1.firebasestorage.app",
  messagingSenderId: "344233100530",
  appId: "1:344233100530:web:f6460a21c28904f1287c6b",
  measurementId: "G-2FZM6CGFDV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

export default app;