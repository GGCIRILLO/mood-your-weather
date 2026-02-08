import { initializeApp } from "firebase/app";
import { 
  getReactNativePersistence, 
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mood-your-weather.firebaseapp.com",
  databaseURL:
    "https://mood-your-weather-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mood-your-weather",
  storageBucket: "mood-your-weather.firebasestorage.app",
  messagingSenderId: "806577155657",
  appId: "1:806577155657:web:f34ab05d5c53ec232d5998",
  measurementId: "G-E4ETBY5HMW",
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Auth con persistenza AsyncStorage (per Expo)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
