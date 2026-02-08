import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { PlayerModal } from "../PlayerModal";
import { Practice } from "@/utils/practicesData";
import { CloudLightning } from "phosphor-react-native";

// Mock the useCompleteActivity hook
jest.mock("@/hooks/api/useCompleteActivity", () => ({
  useCompleteActivity: () => ({
    mutate: jest.fn(),
  }),
}));

const mockPractice: Practice = {
  id: 1,
  title: "Test Practice",
  tag: "Breathwork",
  duration: "21 min",
  type: "Relaxation",
  description: "This is a test practice description",
  icon: CloudLightning,
  image: "https://example.com/image.jpg",
  color: "#135bec",
  audio: null,
};

describe("PlayerModal", () => {
  const mockOnClose = jest.fn();
  const mockOnTogglePlayback = jest.fn();
  const mockOnSeek = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const { getByText } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    expect(getByText("Test Practice")).toBeTruthy();
    expect(getByText(/Breathwork/)).toBeTruthy();
    expect(getByText(/Relaxation/)).toBeTruthy();
    expect(getByText("Live Session")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <PlayerModal
        visible={false}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    expect(queryByText("Test Practice")).toBeNull();
  });

  it("does not render when practice is null", () => {
    const { queryByText } = render(
      <PlayerModal
        visible={true}
        practice={null}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    expect(queryByText("Live Session")).toBeNull();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    // Find the close button
    const closeButton = getByTestId("close-player-button");
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onTogglePlayback when play/pause button is pressed", () => {
    const { getByTestId } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    // Find the play/pause button
    const playButton = getByTestId("play-pause-button");
    fireEvent.press(playButton);

    expect(mockOnTogglePlayback).toHaveBeenCalledTimes(1);
  });

  it("displays pause icon when playing", () => {
    const { UNSAFE_getByType } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={true}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    // Check that Pause icon is rendered
    const PauseIcon = require("phosphor-react-native").Pause;
    expect(() => UNSAFE_getByType(PauseIcon)).not.toThrow();
  });

  it("displays play icon when paused", () => {
    const { UNSAFE_getByType } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    // Check that Play icon is rendered
    const PlayIcon = require("phosphor-react-native").Play;
    expect(() => UNSAFE_getByType(PlayIcon)).not.toThrow();
  });

  it("displays correct text for Breathwork practice", () => {
    const { getByText } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    expect(getByText("Breathe In")).toBeTruthy();
  });

  it("displays correct text for non-Breathwork practice", () => {
    const meditationPractice = {
      ...mockPractice,
      tag: "Meditation",
    };

    const { getByText } = render(
      <PlayerModal
        visible={true}
        practice={meditationPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    expect(getByText("Immerse Yourself")).toBeTruthy();
  });

  it("calls onSeek when slider is changed", () => {
    const { UNSAFE_getByType } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={0}
        duration={100000}
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    const Slider = require("@react-native-community/slider").default;
    const slider = UNSAFE_getByType(Slider);

    fireEvent(slider, "onSlidingComplete", 50000);
    expect(mockOnSeek).toHaveBeenCalledWith(50000);
  });

  it("displays formatted time correctly", () => {
    const { getByText } = render(
      <PlayerModal
        visible={true}
        practice={mockPractice}
        isPlaying={false}
        position={60000} // 1 minute
        duration={300000} // 5 minutes
        onClose={mockOnClose}
        onTogglePlayback={mockOnTogglePlayback}
        onSeek={mockOnSeek}
      />,
    );

    // formatTime should convert 60000ms to "01:00"
    expect(getByText("01:00")).toBeTruthy();
    expect(getByText("05:00")).toBeTruthy();
  });
});
