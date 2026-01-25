import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

// Base URL per le API
const API_BASE_URL = "http://127.0.0.1:8000";

// Registrazione nuovo utente tramite API
export const signUp = async (
  email: string,
  password: string,
  name?: string,
) => {
  try {
    // Chiamata API per registrazione
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: name || email.split("@")[0], // Usa parte email se name non fornito
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }

    const data = await response.json();

    // Autentica con Firebase usando il custom token ricevuto
    const userCredential = await signInWithCustomToken(auth, data.token);
    const user = userCredential.user;

    return { success: true, user };
  } catch (error: any) {
    console.error("Sign up error:", error.message);
    return {
      success: false,
      error: error.message || "Errore di registrazione",
    };
  }
};

// Login utente esistente
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log("User logged in:", user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error("Sign in error:", error.code, error.message);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper per messaggi errore user-friendly
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Questa email è già registrata";
    case "auth/invalid-email":
      return "Email non valida";
    case "auth/weak-password":
      return "La password deve avere almeno 6 caratteri";
    case "auth/user-not-found":
      return "Utente non trovato";
    case "auth/wrong-password":
      return "Password errata";
    case "auth/too-many-requests":
      return "Troppi tentativi. Riprova più tardi";
    default:
      return "Errore di autenticazione";
  }
};
