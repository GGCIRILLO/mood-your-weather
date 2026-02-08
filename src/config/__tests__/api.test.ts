import { Platform } from "react-native";
import Constants from "expo-constants";
import { getApiBaseUrl } from "../api";

jest.mock("react-native", () => ({
  Platform: {
    select: jest.fn(),
    OS: "ios",
  },
}));

jest.mock("expo-constants", () => ({
  manifest: {
    debuggerHost: "192.168.1.100:8081",
  },
}));

describe("API Config", () => {
  const originalDev = global.__DEV__;

  beforeEach(() => {
    jest.resetModules();
    global.__DEV__ = true;
  });

  afterAll(() => {
    global.__DEV__ = originalDev;
  });

  it("should return localhost for iOS in DEV", () => {
    Platform.OS = "ios";
    expect(getApiBaseUrl()).toBe("http://127.0.0.1:8000");
  });

  it("should return special IP for Android in DEV", () => {
    Platform.OS = "android";
    expect(getApiBaseUrl()).toBe("http://10.0.2.2:8000");
  });

  it("should return localhost for Web in DEV", () => {
    Platform.OS = "web";
    expect(getApiBaseUrl()).toBe("http://localhost:8000");
  });

  it("should return debugger host IP for physical device in DEV", () => {
    Platform.OS = "other" as any;
    expect(getApiBaseUrl()).toBe("http://192.168.1.100:8000");
  });

  it("should return fallback IP if manifest is missing in DEV", () => {
    Platform.OS = "other" as any;
    (Constants as any).manifest = null;
    expect(getApiBaseUrl()).toBe("http://192.168.1.17:8000");
  });

  it("should return production API URL when NOT in DEV", () => {
    global.__DEV__ = false;
    expect(getApiBaseUrl()).toBe("https://your-production-api.com");
  });
});
