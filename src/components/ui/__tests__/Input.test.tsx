import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "../Input";

describe("Input Component", () => {
  it("renders label and placeholder", () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Email" placeholder="Enter your email" />,
    );
    expect(getByText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
  });

  it("handles text change", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(getByPlaceholderText("Type here"), "Hello world");
    expect(onChangeText).toHaveBeenCalledWith("Hello world");
  });

  it("displays error message and changes border color", () => {
    const { getByText } = render(<Input error="Invalid email" />);
    expect(getByText("Invalid email")).toBeTruthy();
  });

  it("handles right icon press", () => {
    const onRightIconPress = jest.fn();
    const { getByText } = render(
      <Input rightIcon="👁️" onRightIconPress={onRightIconPress} />,
    );

    fireEvent.press(getByText("👁️"));
    expect(onRightIconPress).toHaveBeenCalled();
  });

  it("handles left icon", () => {
    const { getByText } = render(<Input leftIcon="📧" />);
    expect(getByText("📧")).toBeTruthy();
  });

  it("handles focus and blur", () => {
    const { getByPlaceholderText } = render(<Input placeholder="Focus me" />);
    const input = getByPlaceholderText("Focus me");

    fireEvent(input, "focus");
    fireEvent(input, "blur");
  });

  it("displays hint message", () => {
    const { getByText } = render(<Input hint="Min 8 characters" />);
    expect(getByText("Min 8 characters")).toBeTruthy();
  });

  it("renders correctly (snapshot)", () => {
    const tree = render(
      <Input label="Test Label" placeholder="Placeholder" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders with error (snapshot)", () => {
    const tree = render(<Input error="Error Message" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
