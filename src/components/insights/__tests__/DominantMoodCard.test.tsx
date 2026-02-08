import { render } from "@testing-library/react-native";
import { DominantMoodCard } from "../DominantMoodCard";

describe("DominantMoodCard Component", () => {
  it("renders correctly with provided mood", () => {
    const { getByText } = render(<DominantMoodCard dominantMood="stormy" />);
    expect(getByText("stormy")).toBeTruthy();
    expect(getByText("Dominant Mood")).toBeTruthy();
  });

  it("renders default mood when none provided", () => {
    const { getByText } = render(<DominantMoodCard dominantMood={null} />);
    expect(getByText("sunny")).toBeTruthy();
  });
});
