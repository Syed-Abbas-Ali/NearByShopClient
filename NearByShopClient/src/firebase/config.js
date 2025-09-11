import { initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

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

export { app, messaging };