import { render } from "@testing-library/react-native";
import { JournalEntryCard } from "../JournalEntryCard";

describe("JournalEntryCard", () => {
  const defaultProps: any = {
    date: "2024-01-01",
    emojis: ["sunny", "partly"],
    intensity: 75,
    note: "Un giorno fantastico con un po' di nuvole.",
    time: "12:00",
  };

  it("renders basic information correctly", () => {
    const { getByText } = render(<JournalEntryCard {...defaultProps} />);

    expect(getByText("12:00")).toBeTruthy();
    expect(getByText("75%")).toBeTruthy();
    expect(
      getByText("Un giorno fantastico con un po' di nuvole."),
    ).toBeTruthy();
  });

  it("renders sentiment label when NLP data is provided", () => {
    const { getByText } = render(
      <JournalEntryCard {...defaultProps} nlpSentiment="positive" />,
    );

    expect(getByText("Positive")).toBeTruthy();
  });

  it("highlights search query in the note", () => {
    const { getByText } = render(
      <JournalEntryCard {...defaultProps} searchQuery="fantastico" />,
    );

    // The text is split into components, but we verify it's still present
    expect(getByText(/fantastico/)).toBeTruthy();
  });

  it("renders location and weather info if provided", () => {
    const props = {
      ...defaultProps,
      location: "Milano",
      externalWeather: { condition: "Clear", temperature: 22 },
    };
    const { getByText } = render(<JournalEntryCard {...props} />);

    expect(getByText("Milano")).toBeTruthy();
    expect(getByText("Clear, 22°C")).toBeTruthy();
  });
});
