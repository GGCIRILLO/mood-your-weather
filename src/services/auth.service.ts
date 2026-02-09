import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
  getAuth,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/api";
import { storageService } from "./storage.service";

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

    // Salva il token in AsyncStorage come fallback
    try {
      const idToken = await user.getIdToken();
      await storageService.saveAuthToken(idToken);
    } catch (tokenError) {
      console.warn("⚠️ Impossibile salvare token dopo signup:", tokenError);
    }

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
    // Prima controlla se c'è già un utente autenticato in cache
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === email) {
      // Verifica se ha ancora un token valido
      try {
        const token = await currentUser.getIdToken();
        await storageService.saveAuthToken(token);
        return { success: true, user: currentUser };
      } catch (tokenError) {
        console.log("⚠️ Token esistente scaduto, procedo con login normale");
      }
    }

    // Login normale con Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Salva il token in AsyncStorage come fallback
    try {
      const idToken = await user.getIdToken();
      await storageService.saveAuthToken(idToken);
    } catch (tokenError) {
      console.warn("Impossibile salvare token dopo login:", tokenError);
    }

    return { success: true, user };
  } catch (error: any) {
    console.error("Sign in error:", error.code, error.message);

    // Se il problema è di rete, prova a usare l'utente già autenticato se esiste
    if (error.code === "auth/network-request-failed") {
      const currentUser = auth.currentUser;
      if (currentUser) {
        return { success: true, user: currentUser };
      }

      return {
        success: false,
        error: "Impossibile connettersi. Controlla la connessione internet.",
      };
    }

    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    await storageService.removeAuthToken();
    console.log("User logged out");
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  const authFirebase = getAuth();
  try {
    await sendPasswordResetEmail(authFirebase, email);
    console.log("Password reset email sent");
    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Update profile (name, photo)
export const updateUserProfile = async (
  displayName: string,
  photoURL?: string,
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    await updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
};

// Update password
export const updateUserPassword = async (
  newPassword: string,
  currentPassword?: string,
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    if (currentPassword && user.email) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
    }

    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: any) {
    console.error("Update password error:", error);

    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        error: "Please provide your current password to confirm changes.",
      };
    }

    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Delete account
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");

    const userId = user.uid;
    const token = await user.getIdToken();

    // Call backend to delete user data and Firebase Auth user
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Failed to delete account from server",
      );
    }

    // Sign out locally and clear storage
    await signOut(auth);
    await storageService.removeAuthToken();

    return { success: true };
  } catch (error: any) {
    console.error("Delete account error:", error);

    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        error:
          "Please logout and login again to delete your account for security reasons.",
      };
    }

    return {
      success: false,
      error: error.message || "Errore durante la cancellazione dell'account",
    };
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
    case "auth/network-request-failed":
      return "Errore di connessione. Controlla la rete e riprova";
    default:
      return "Errore di autenticazione";
  }
};
