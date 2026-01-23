import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

// Registrazione nuovo utente
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log("User registered:", user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error("Sign up error:", error.code, error.message);
    return { success: false, error: getErrorMessage(error.code) };
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
