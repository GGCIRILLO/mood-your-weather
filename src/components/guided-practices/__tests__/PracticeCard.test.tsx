import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PracticeCard } from "../PracticeCard";
import { Practice } from "@/utils/practicesData";
import { CloudLightning } from "phosphor-react-native";

const mockPractice: Practice = {
  id: 1,
  title: "Test Practice",
  tag: "Anxiety Relief",
  duration: "21 min",
  type: "Relaxation",
  description: "This is a test practice description",
  icon: CloudLightning,
  image: "https://example.com/image.jpg",
  color: "#135bec",
  audio: null,
};

describe("PracticeCard", () => {
  const mockOnBeginJourney = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <PracticeCard
        practice={mockPractice}
        onBeginJourney={mockOnBeginJourney}
      />,
    );

    expect(getByText("Test Practice")).toBeTruthy();
    expect(getByText("Anxiety Relief")).toBeTruthy();
    expect(getByText("21 min")).toBeTruthy();
    expect(getByText("Relaxation")).toBeTruthy();
    expect(getByText("This is a test practice description")).toBeTruthy();
    expect(getByText("Begin Journey")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const tree = render(
      <PracticeCard
        practice={mockPractice}
        onBeginJourney={mockOnBeginJourney}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("calls onBeginJourney when button is pressed", () => {
    const { getByText } = render(
      <PracticeCard
        practice={mockPractice}
        onBeginJourney={mockOnBeginJourney}
      />,
    );

    fireEvent.press(getByText("Begin Journey"));
    expect(mockOnBeginJourney).toHaveBeenCalledWith(mockPractice);
    expect(mockOnBeginJourney).toHaveBeenCalledTimes(1);
  });

  it("displays custom audio duration when provided", () => {
    const customDuration = "15:30";
    const { getByText, queryByText } = render(
      <PracticeCard
        practice={mockPractice}
        audioDuration={customDuration}
        onBeginJourney={mockOnBeginJourney}
      />,
    );

    expect(getByText(customDuration)).toBeTruthy();
    expect(queryByText("21 min")).toBeNull();
  });

  it("displays practice duration when audioDuration is not provided", () => {
    const { getByText } = render(
      <PracticeCard
        practice={mockPractice}
        onBeginJourney={mockOnBeginJourney}
      />,
    );

    expect(getByText("21 min")).toBeTruthy();
  });

  it("renders with different practice types", () => {
    const meditationPractice = {
      ...mockPractice,
      tag: "Daily Ritual",
      type: "Meditation",
      title: "Morning Meditation",
    };

    const { getByText } = render(
      <PracticeCard
        practice={meditationPractice}
        onBeginJourney={mockOnBeginJourney}
      />,
    );

    expect(getByText("Daily Ritual")).toBeTruthy();
    expect(getByText("Meditation")).toBeTruthy();
    expect(getByText("Morning Meditation")).toBeTruthy();
  });

  it("truncates long descriptions", () => {
    const longDescription =
      "This is a very long description that should be truncated after two lines. It contains a lot of text that might overflow the card layout.";
    const practiceWithLongDesc = {
      ...mockPractice,
      description: longDescription,
    };

    const { getByText } = render(
      <PracticeCard
        practice={practiceWithLongDesc}
        onBeginJourney={mockOnBeginJourney}
      />,
    );

    const descriptionElement = getByText(longDescription);
    expect(descriptionElement.props.numberOfLines).toBe(2);
  });
});
