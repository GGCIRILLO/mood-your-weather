import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders the title correctly", () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("handles press events", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press Me" onPress={onPress} />);

    fireEvent.press(getByText("Press Me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicator when loading is true", () => {
    const { getByRole } = render(<Button title="Loading" loading={true} />);
    // In React Native Testing Library, ActivityIndicator is often found by its presence
    // We can check if the title is NOT rendered
    // or use a testID if we added one. Since we don't have testID, check title absence.
    expect(() =>
      render(<Button title="Test" loading={true} />).getByText("Test"),
    ).toThrow();
  });

  it("is disabled when disabled prop is true", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" disabled={true} onPress={onPress} />,
    );

    fireEvent.press(getByText("Disabled"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders icons if provided", () => {
    const { getByText } = render(
      <Button title="Icons" leftIcon="🚀" rightIcon="✨" />,
    );
    expect(getByText("🚀")).toBeTruthy();
    expect(getByText("✨")).toBeTruthy();
  });

  it("renders correctly (snapshot)", () => {
    const tree = render(<Button title="Snapshot Button" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders variant secondary correctly (snapshot)", () => {
    const tree = render(
      <Button title="Secondary" variant="secondary" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
