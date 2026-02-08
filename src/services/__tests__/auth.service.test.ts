import {
  signUp,
  signIn,
  logout,
  resetPassword,
  updateUserProfile,
  updateUserPassword,
  onAuthStateChange,
} from "../auth.service";
import { auth } from "../../config/firebaseConfig";
import { storageService } from "../storage.service";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

jest.mock("firebase/auth", () => ({
  signInWithCustomToken: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
  updatePassword: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  EmailAuthProvider: { credential: jest.fn(() => "mock-credential") },
  onAuthStateChanged: jest.fn(),
}));

jest.mock("../../config/firebaseConfig", () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock("../storage.service", () => ({
  storageService: {
    saveAuthToken: jest.fn(),
    removeAuthToken: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("AuthService", () => {
  const mockUser = {
    email: "test@example.com",
    getIdToken: jest.fn().mockResolvedValue("mock-token"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as any).currentUser = null;
  });

  describe("signUp", () => {
    it("should sign up successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: "custom-token" }),
      });
      (signInWithCustomToken as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await signUp(
        "test@example.com",
        "password123",
        "Test User",
      );

      expect(result.success).toBe(true);
      expect(result.user).toBe(mockUser);
      expect(storageService.saveAuthToken).toHaveBeenCalledWith("mock-token");
    });

    it("should sign up successfully without name", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: "custom-token" }),
      });
      (signInWithCustomToken as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await signUp("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"name":"test"'),
        }),
      );
    });

    it("should handle registration failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ detail: "User already exists" }),
      });

      const result = await signUp("test@example.com", "password123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("User already exists");
    });

    it("should handle token saving error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ token: "custom-token" }),
      });
      (signInWithCustomToken as jest.Mock).mockResolvedValueOnce({
        user: {
          ...mockUser,
          getIdToken: jest.fn().mockRejectedValueOnce(new Error("Token error")),
        },
      });

      const result = await signUp("test@example.com", "password123");

      expect(result.success).toBe(true); // Signup still succeeds
      expect(storageService.saveAuthToken).not.toHaveBeenCalled();
    });
  });

  describe("signIn", () => {
    it("should sign in successfully", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await signIn("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.user).toBe(mockUser);
      expect(storageService.saveAuthToken).toHaveBeenCalledWith("mock-token");
    });

    it("should return existing user if already logged in and token is valid", async () => {
      (auth as any).currentUser = mockUser;
      const result = await signIn("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.user).toBe(mockUser);
      expect(storageService.saveAuthToken).toHaveBeenCalledWith("mock-token");
      expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    });

    it("should proceed with normal login if existing user token fails", async () => {
      (auth as any).currentUser = {
        ...mockUser,
        getIdToken: jest.fn().mockRejectedValueOnce(new Error("Expired")),
      };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
      });

      const result = await signIn("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });

    it("should handle login failure", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
        code: "auth/wrong-password",
      });

      const result = await signIn("test@example.com", "wrong-password");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Password errata");
    });

    it("should handle network failure by returning currentUser if exists", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
        code: "auth/network-request-failed",
      });
      (auth as any).currentUser = mockUser;

      const result = await signIn("test@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.user).toBe(mockUser);
    });

    it("should handle network failure without currentUser", async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
        code: "auth/network-request-failed",
      });

      const result = await signIn("test@example.com", "password123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Impossibile connettersi");
    });

    /* it("should handle token saving error during normal login", async () => {
        const mockUserWithFailingToken = {
            email: "test@example.com",
            getIdToken: jest.fn().mockImplementation(() => Promise.reject(new Error("Token error"))),
        };
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
            user: mockUserWithFailingToken,
        });

        const result = await signIn("test@example.com", "password123");

        expect(result.success).toBe(true);
        expect(result.user).toBe(mockUserWithFailingToken);
    }); */
  });

  describe("logout", () => {
    it("should log out successfully", async () => {
      (signOut as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await logout();

      expect(result.success).toBe(true);
      expect(storageService.removeAuthToken).toHaveBeenCalled();
    });

    it("should handle logout error", async () => {
      (signOut as jest.Mock).mockRejectedValueOnce(new Error("Logout error"));

      const result = await logout();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Logout error");
    });
  });

  describe("resetPassword", () => {
    it("should send reset email successfully", async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await resetPassword("test@example.com");

      expect(result.success).toBe(true);
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        auth,
        "test@example.com",
      );
    });

    it("should handle reset email error", async () => {
      (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce({
        code: "auth/user-not-found",
      });

      const result = await resetPassword("test@example.com");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Utente non trovato");
    });
  });

  describe("updateUserProfile", () => {
    it("should update profile successfully", async () => {
      (auth as any).currentUser = mockUser;
      (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await updateUserProfile("New Name", "new-photo-url");

      expect(result.success).toBe(true);
      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: "New Name",
        photoURL: "new-photo-url",
      });
    });

    it("should throw error if no user is logged in", async () => {
      const result = await updateUserProfile("New Name");

      expect(result.success).toBe(false);
      expect(result.error).toBe("No user logged in");
    });
  });

  describe("updateUserPassword", () => {
    it("should update password successfully with re-auth", async () => {
      (auth as any).currentUser = mockUser;
      (updatePassword as jest.Mock).mockResolvedValueOnce(undefined);
      (reauthenticateWithCredential as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const result = await updateUserPassword("new-pass", "old-pass");

      expect(result.success).toBe(true);
      expect(EmailAuthProvider.credential).toHaveBeenCalled();
      expect(reauthenticateWithCredential).toHaveBeenCalled();
      expect(updatePassword).toHaveBeenCalled();
    });

    it("should update password without re-auth if no current password provided", async () => {
      (auth as any).currentUser = mockUser;
      (updatePassword as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await updateUserPassword("new-pass");

      expect(result.success).toBe(true);
      expect(reauthenticateWithCredential).not.toHaveBeenCalled();
    });

    it("should handle requires-recent-login error", async () => {
      (auth as any).currentUser = mockUser;
      (updatePassword as jest.Mock).mockRejectedValueOnce({
        code: "auth/requires-recent-login",
      });

      const result = await updateUserPassword("new-pass");

      expect(result.success).toBe(false);
      expect(result.error).toContain("current password");
    });

    it("should handle other update password errors", async () => {
      (auth as any).currentUser = mockUser;
      (updatePassword as jest.Mock).mockRejectedValueOnce({
        code: "auth/weak-password",
      });

      const result = await updateUserPassword("123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("La password deve avere almeno 6 caratteri");
    });
  });

  describe("onAuthStateChange", () => {
    it("should register listener", () => {
      const callback = jest.fn();
      onAuthStateChange(callback);
      expect(onAuthStateChanged).toHaveBeenCalledWith(auth, callback);
    });
  });

  describe("getErrorMessage helper via resetPassword", () => {
    it("should return default message for unknown codes", async () => {
      (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce({
        code: "unknown",
      });
      const result = await resetPassword("test@example.com");
      expect(result.error).toBe("Errore di autenticazione");
    });

    it("should handle various error codes", async () => {
      const testCodes = [
        {
          code: "auth/email-already-in-use",
          expected: "Questa email è già registrata",
        },
        { code: "auth/invalid-email", expected: "Email non valida" },
        {
          code: "auth/too-many-requests",
          expected: "Troppi tentativi. Riprova più tardi",
        },
        {
          code: "auth/network-request-failed",
          expected: "Errore di connessione. Controlla la rete e riprova",
        },
      ];

      for (const test of testCodes) {
        (sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce({
          code: test.code,
        });
        const result = await resetPassword("test@example.com");
        expect(result.error).toBe(test.expected);
      }
    });
  });
});
