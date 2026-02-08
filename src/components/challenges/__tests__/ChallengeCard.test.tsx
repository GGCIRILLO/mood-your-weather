import { render } from "@testing-library/react-native";
import { ChallengeCard } from "../ChallengeCard";

describe("ChallengeCard Component", () => {
  const activeChallenge: any = {
    id: "1",
    name: "Morning Sunlight",
    status: "active",
    goal: "Get 15 mins of sun",
    icon: "vibrant_sun",
  };

  const lockedChallenge: any = {
    ...activeChallenge,
    status: "locked",
  };

  const completedChallenge: any = {
    ...activeChallenge,
    status: "completed",
  };

  it("renders active challenge correctly", () => {
    const { getByText } = render(<ChallengeCard challenge={activeChallenge} />);
    expect(getByText("Morning Sunlight")).toBeTruthy();
  });

  it("renders locked challenge with lock icon text", () => {
    const { getByText } = render(<ChallengeCard challenge={lockedChallenge} />);
    expect(getByText("Locked")).toBeTruthy();
    expect(getByText("Morning Sunlight")).toBeTruthy();
  });

  it("renders completed challenge with 'Done' badge", () => {
    const { getByText } = render(
      <ChallengeCard challenge={completedChallenge} />,
    );
    expect(getByText("Done")).toBeTruthy();
    expect(getByText(completedChallenge.goal)).toBeTruthy();
  });
});
