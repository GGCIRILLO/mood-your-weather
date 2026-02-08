import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DataPrivacy } from "../DataPrivacy";

describe("DataPrivacy", () => {
  const mockOnExportData = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when not exporting", () => {
    const { getByText } = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    expect(getByText("Data & Privacy")).toBeTruthy();
    expect(getByText("Export All Data")).toBeTruthy();
    expect(getByText("Log Out")).toBeTruthy();
  });

  it("matches snapshot when not exporting", () => {
    const tree = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("matches snapshot when exporting", () => {
    const tree = render(
      <DataPrivacy
        isExporting={true}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows Exporting... text when isExporting is true", () => {
    const { getByText, queryByText } = render(
      <DataPrivacy
        isExporting={true}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    expect(getByText("Exporting...")).toBeTruthy();
    expect(queryByText("Export All Data")).toBeNull();
  });

  it("calls onExportData when Export button is pressed", () => {
    const { getByText } = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    fireEvent.press(getByText("Export All Data"));
    expect(mockOnExportData).toHaveBeenCalledTimes(1);
    expect(mockOnLogout).not.toHaveBeenCalled();
  });

  it("calls onLogout when Log Out button is pressed", () => {
    const { getByText } = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    fireEvent.press(getByText("Log Out"));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    expect(mockOnExportData).not.toHaveBeenCalled();
  });

  it("renders DownloadSimple icon", () => {
    const { UNSAFE_getByType } = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    const DownloadSimple = require("phosphor-react-native").DownloadSimple;
    expect(() => UNSAFE_getByType(DownloadSimple)).not.toThrow();
  });

  it("renders SignOut icon", () => {
    const { UNSAFE_getByType } = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    const SignOut = require("phosphor-react-native").SignOut;
    expect(() => UNSAFE_getByType(SignOut)).not.toThrow();
  });

  it("renders CaretRight icon", () => {
    const { UNSAFE_getByType } = render(
      <DataPrivacy
        isExporting={false}
        onExportData={mockOnExportData}
        onLogout={mockOnLogout}
      />,
    );

    const CaretRight = require("phosphor-react-native").CaretRight;
    expect(() => UNSAFE_getByType(CaretRight)).not.toThrow();
  });
});
