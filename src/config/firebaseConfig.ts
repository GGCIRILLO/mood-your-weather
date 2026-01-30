import { initializeApp } from "firebase/app";
import { 
  getReactNativePersistence, 
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMCT2ujTPELex_1ILqJVnMZmOVSgAr9DM",
  authDomain: "mood-your-weather.firebaseapp.com",
  databaseURL:
    "https://mood-your-weather-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mood-your-weather",
  storageBucket: "mood-your-weather.firebasestorage.app",
  messagingSenderId: "806577155657",
  appId: "1:806577155657:web:20f31583dd0cfee72d5998",
  measurementId: "G-3YX11T92F7",
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Auth con persistenza AsyncStorage (per Expo)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
