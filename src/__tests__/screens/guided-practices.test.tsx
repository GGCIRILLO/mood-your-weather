import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GuidedPracticesScreen from "@/app/(tabs)/guided-practices";

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock useAudioPlayer hook
jest.mock("@/hooks/useAudioPlayer", () => ({
  useAudioPlayer: () => ({
    isPlaying: false,
    position: 0,
    duration: 100000,
    audioDurations: {
      1: "21:00",
      2: "29:00",
      3: "02:00",
    },
    playSound: jest.fn(),
    togglePlayback: jest.fn(),
    setPlaybackPosition: jest.fn(),
    stopSound: jest.fn(),
  }),
}));

// Mock safe area insets
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

// Mock useCompleteActivity hook used in PlayerModal
jest.mock("@/hooks/api/useCompleteActivity", () => ({
  useCompleteActivity: () => ({
    mutate: jest.fn(),
  }),
}));

describe("GuidedPracticesScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<GuidedPracticesScreen />);

    expect(getByText("GUIDED PRACTICES")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(<GuidedPracticesScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays all filter options", () => {
    const { getByTestId } = render(<GuidedPracticesScreen />);

    expect(getByTestId("filter-chip-All")).toBeTruthy();
    expect(getByTestId("filter-chip-Anxiety")).toBeTruthy();
    expect(getByTestId("filter-chip-Focus")).toBeTruthy();
    expect(getByTestId("filter-chip-Sleep")).toBeTruthy();
    expect(getByTestId("filter-chip-Meditation")).toBeTruthy();
  });

  it("displays all practices by default", () => {
    const { getByText } = render(<GuidedPracticesScreen />);

    // Check for some practice titles
    expect(getByText("Thunderstorm Release")).toBeTruthy();
    expect(getByText("Rainy Day Calm")).toBeTruthy();
    expect(getByText("Forest Focus")).toBeTruthy();
  });

  it("filters practices when filter is changed", () => {
    const { getByText, queryByText, getByTestId } = render(
      <GuidedPracticesScreen />,
    );

    // Click on Anxiety filter
    fireEvent.press(getByTestId("filter-chip-Anxiety"));

    // Should show anxiety-related practices
    expect(getByText("Thunderstorm Release")).toBeTruthy(); // has "Anxiety Relief" tag
    expect(getByText("Box Breathing")).toBeTruthy(); // has "Anxiety" type
  });

  it("filters practices for Focus", () => {
    const { getByText, getByTestId } = render(<GuidedPracticesScreen />);

    fireEvent.press(getByTestId("filter-chip-Focus"));

    expect(getByText("Forest Focus")).toBeTruthy();
    expect(getByText("Deep Work Zone")).toBeTruthy();
  });

  it("filters practices for Sleep", () => {
    const { getByText, getByTestId } = render(<GuidedPracticesScreen />);

    fireEvent.press(getByTestId("filter-chip-Sleep"));

    expect(getByText("Rainy Day Calm")).toBeTruthy();
    expect(getByText("Dreamscapes")).toBeTruthy();
  });

  it("opens modal when Begin Journey is pressed", async () => {
    const { getAllByText, getByText } = render(<GuidedPracticesScreen />);

    // Click the first "Begin Journey" button
    const beginButtons = getAllByText("Begin Journey");
    fireEvent.press(beginButtons[0]);

    // Modal should be visible - check for modal-specific content
    await waitFor(() => {
      expect(getByText("Live Session")).toBeTruthy();
    });
  });

  it("calls router.back when back button is pressed", () => {
    const { getByTestId } = render(<GuidedPracticesScreen />);
    const router = require("expo-router").router;

    // Find the back button by testID
    fireEvent.press(getByTestId("back-button"));

    expect(router.back).toHaveBeenCalled();
  });

  it("shows practices with audio durations", () => {
    const { getByText } = render(<GuidedPracticesScreen />);

    // Should display audio duration from the hook
    expect(getByText("21:00")).toBeTruthy();
  });

  it("returns to All filter shows all practices", () => {
    const { getByText, getByTestId } = render(<GuidedPracticesScreen />);

    // First filter to Anxiety
    fireEvent.press(getByTestId("filter-chip-Anxiety"));

    // Then back to All
    fireEvent.press(getByTestId("filter-chip-All"));

    // All practices should be visible again
    expect(getByText("Thunderstorm Release")).toBeTruthy();
    expect(getByText("Rainy Day Calm")).toBeTruthy();
    expect(getByText("Forest Focus")).toBeTruthy();
  });

  it("modal is not visible initially", () => {
    const { queryByText } = render(<GuidedPracticesScreen />);

    // Modal content should not be visible initially
    expect(queryByText("Live Session")).toBeNull();
  });

  it("displays practice count based on filter", () => {
    const { getByText, getAllByText, getByTestId } = render(
      <GuidedPracticesScreen />,
    );

    // All filter - should have all practices
    const allBeginButtons = getAllByText("Begin Journey");
    const totalPractices = allBeginButtons.length;

    // Switch to a specific filter
    fireEvent.press(getByTestId("filter-chip-Meditation"));

    // Should have fewer practices
    const meditationBeginButtons = getAllByText("Begin Journey");
    expect(meditationBeginButtons.length).toBeLessThan(totalPractices);
  });
});
