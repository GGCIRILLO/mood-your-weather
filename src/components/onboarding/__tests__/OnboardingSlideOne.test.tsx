import { render, fireEvent } from "@testing-library/react-native";
import { OnboardingSlideOne } from "../OnboardingSlideOne";

describe("OnboardingSlideOne Component", () => {
  it("renders the onboarding message", () => {
    const { getByText } = render(<OnboardingSlideOne onNext={jest.fn()} />);
    expect(getByText(/Your Emotions Are Like Weather/)).toBeTruthy();
  });

  it("calls onNext when the next button is pressed", () => {
    const onNext = jest.fn();
    const { getByTestId } = render(<OnboardingSlideOne onNext={onNext} />);

    fireEvent.press(getByTestId("next-button"));
    expect(onNext).toHaveBeenCalled();
  });
});
