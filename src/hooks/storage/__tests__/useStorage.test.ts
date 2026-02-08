import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useOnboarding, useCurrentUser, useMoodEntries } from "../useStorage";
import { storageService } from "@/services/storage.service";

jest.mock("@/services/storage.service", () => ({
  storageService: {
    getOnboardingState: jest.fn(),
    setOnboardingCompleted: jest.fn(),
    resetOnboarding: jest.fn(),
    getUser: jest.fn(),
    saveUser: jest.fn(),
    removeUser: jest.fn(),
    removeAuthToken: jest.fn(),
    getMoodEntries: jest.fn(),
    saveMoodEntry: jest.fn(),
    updateMoodEntry: jest.fn(),
    deleteMoodEntry: jest.fn(),
    getRecentMoodEntries: jest.fn(),
  },
}));

describe("useOnboarding Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load onboarding state on mount", async () => {
    const mockState = { completed: true, completedAt: "2024-01-01" };
    (storageService.getOnboardingState as jest.Mock).mockResolvedValueOnce(
      mockState,
    );

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.onboarding).toEqual(mockState);
    expect(result.current.isCompleted).toBe(true);
  });

  it("should complete onboarding", async () => {
    (storageService.getOnboardingState as jest.Mock).mockResolvedValueOnce({
      completed: false,
    });
    const { result } = renderHook(() => useOnboarding());

    await act(async () => {
      await result.current.completeOnboarding();
    });

    expect(storageService.setOnboardingCompleted).toHaveBeenCalled();
    expect(result.current.isCompleted).toBe(true);
  });

  it("should reset onboarding", async () => {
    (storageService.getOnboardingState as jest.Mock).mockResolvedValueOnce({
      completed: true,
    });
    const { result } = renderHook(() => useOnboarding());

    await act(async () => {
      await result.current.resetOnboarding();
    });

    expect(storageService.resetOnboarding).toHaveBeenCalled();
    expect(result.current.isCompleted).toBe(false);
  });
});

describe("useCurrentUser Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load user on mount", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test" };
    (storageService.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should handle null user", async () => {
    (storageService.getUser as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should save user", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test" };
    (storageService.getUser as jest.Mock).mockResolvedValueOnce(null);
    const { result } = renderHook(() => useCurrentUser());

    await act(async () => {
      await result.current.saveUser(mockUser as any);
    });

    expect(storageService.saveUser).toHaveBeenCalledWith(mockUser);
    expect(result.current.user).toEqual(mockUser);
  });

  it("should logout", async () => {
    const mockUser = { id: "1", email: "test@example.com", name: "Test" };
    (storageService.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(storageService.removeUser).toHaveBeenCalled();
    expect(storageService.removeAuthToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it("should refresh user", async () => {
    const mockUser1 = { id: "1", name: "User 1" };
    const mockUser2 = { id: "1", name: "User 2" };

    (storageService.getUser as jest.Mock)
      .mockResolvedValueOnce(mockUser1)
      .mockResolvedValueOnce(mockUser2);

    const { result } = renderHook(() => useCurrentUser());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser1);

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(result.current.user).toEqual(mockUser2);
  });
});

describe("useMoodEntries Hook", () => {
  const mockEntries = [
    { id: "1", mood: "happy", date: "2024-01-01" },
    { id: "2", mood: "sad", date: "2024-01-02" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load entries on mount", async () => {
    (storageService.getMoodEntries as jest.Mock).mockResolvedValueOnce(
      mockEntries,
    );

    const { result } = renderHook(() => useMoodEntries());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.entries).toEqual(mockEntries);
  });

  it("should add entry and refresh", async () => {
    const newEntry = { id: "3", mood: "excited" };
    (storageService.getMoodEntries as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([newEntry]);

    const { result } = renderHook(() => useMoodEntries());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addEntry(newEntry as any);
    });

    expect(storageService.saveMoodEntry).toHaveBeenCalledWith(newEntry);
    expect(result.current.entries).toEqual([newEntry]);
  });

  it("should update entry and refresh", async () => {
    const updatedEntry = { id: "1", mood: "better" };
    (storageService.getMoodEntries as jest.Mock)
      .mockResolvedValueOnce(mockEntries)
      .mockResolvedValueOnce([updatedEntry, mockEntries[1]]);

    const { result } = renderHook(() => useMoodEntries());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateEntry("1", { mood: "better" });
    });

    expect(storageService.updateMoodEntry).toHaveBeenCalledWith("1", {
      mood: "better",
    });
  });

  it("should delete entry and refresh", async () => {
    (storageService.getMoodEntries as jest.Mock)
      .mockResolvedValueOnce(mockEntries)
      .mockResolvedValueOnce([mockEntries[1]]);

    const { result } = renderHook(() => useMoodEntries());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteEntry("1");
    });

    expect(storageService.deleteMoodEntry).toHaveBeenCalledWith("1");
    expect(result.current.entries).toEqual([mockEntries[1]]);
  });

  it("should get recent entries", async () => {
    (storageService.getMoodEntries as jest.Mock).mockResolvedValueOnce(
      mockEntries,
    );
    (storageService.getRecentMoodEntries as jest.Mock).mockResolvedValueOnce([
      mockEntries[0],
    ]);

    const { result } = renderHook(() => useMoodEntries());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let recent;
    await act(async () => {
      recent = await result.current.getRecentEntries(1);
    });

    expect(storageService.getRecentMoodEntries).toHaveBeenCalledWith(1);
    expect(recent).toEqual([mockEntries[0]]);
  });
});
