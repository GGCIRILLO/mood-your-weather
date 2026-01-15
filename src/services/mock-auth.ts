// ============================================
// MOCK AUTH SERVICE
// ============================================

import { storageService } from "./storage.service";
import type { User, ApiResponse } from "@/types";

/**
 * Mock authentication credentials
 */
const MOCK_USERS = [
  {
    id: "mock-user-1",
    email: "luigi@example.com",
    name: "Luigi",
    password: "password123", // Only for mock, never store passwords in real app!
  },
  {
    id: "mock-user-2",
    email: "test@example.com",
    name: "Test User",
    password: "test123",
  },
] as const;

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock authentication service
 */
class MockAuthService {
  /**
   * Mock login with email/password
   */
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    await delay(800); // Simulate network delay

    // Find user
    const mockUser = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!mockUser) {
      return {
        success: false,
        error: {
          code: "AUTH_FAILED",
          message: "Email o password non validi",
        },
      };
    }

    // Create user object without password
    const user: User = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    await storageService.saveUser(user);
    await storageService.saveAuthToken(`mock-token-${user.id}`);

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Mock signup with email/password
   */
  async signup(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<User>> {
    await delay(800); // Simulate network delay

    // Validate inputs
    if (!email || !password || !name) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Tutti i campi sono obbligatori",
        },
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: {
          code: "WEAK_PASSWORD",
          message: "La password deve essere di almeno 6 caratteri",
        },
      };
    }

    // Check if email already exists
    const existingUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "Questo indirizzo email è già registrato",
        },
      };
    }

    // Create new user (in real app, this would be saved to backend)
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    await storageService.saveUser(user);
    await storageService.saveAuthToken(`mock-token-${user.id}`);

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Mock social sign-in (Google, Apple)
   */
  async socialSignIn(provider: "google" | "apple"): Promise<ApiResponse<User>> {
    await delay(1000); // Simulate OAuth flow delay

    // Mock successful social sign-in
    const user: User = {
      id: `${provider}-user-${Date.now()}`,
      email: `user@${provider}.com`,
      name: provider === "google" ? "Google User" : "Apple User",
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    await storageService.saveUser(user);
    await storageService.saveAuthToken(`mock-token-${user.id}`);

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await storageService.getUser();
    const token = await storageService.getAuthToken();
    return !!(user && token);
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    return await storageService.getUser();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await storageService.removeUser();
    await storageService.removeAuthToken();
  }

  /**
   * Mock password reset
   */
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    await delay(800);

    const userExists = MOCK_USERS.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userExists) {
      return {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "Nessun account trovato con questo indirizzo email",
        },
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();
