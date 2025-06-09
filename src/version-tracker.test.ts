import { VersionTracker } from "./version-tracker";
import { FileOperations } from "./utils/file-operations";
import { BuildNumberUtils } from "./utils/build-number";

// Mock the FileOperations and BuildNumberUtils
jest.mock("./utils/file-operations");
jest.mock("./utils/build-number");

describe("VersionTracker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default config", () => {
    const mockPackageJson = { name: "test-app", version: "1.0.0" };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(
      mockPackageJson
    );
    const tracker = VersionTracker.initialize();
    expect(tracker.getVersionInfo()).toEqual({
      appName: "test-app",
      version: "1.0.0",
      buildNumber: "1",
      environment: "development",
      lastDeployed: expect.any(String),
    });
  });

  it("should increment build number", () => {
    const mockPackageJson = {
      name: "test-app",
      version: "1.0.0",
      buildNumber: "1",
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(
      mockPackageJson
    );
    (BuildNumberUtils.getNextBuildNumber as jest.Mock).mockReturnValue("2");
    const tracker = VersionTracker.initialize();
    const newBuildNumber = tracker.incrementBuildNumber();
    expect(newBuildNumber).toBe("2");
    expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ buildNumber: "2" })
    );
  });

  it("should set build number", () => {
    const mockPackageJson = {
      name: "test-app",
      version: "1.0.0",
      buildNumber: "1",
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(
      mockPackageJson
    );
    const tracker = VersionTracker.initialize();
    tracker.setBuildNumber("100");
    expect(FileOperations.writePackageJson).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ buildNumber: "100" })
    );
  });

  it("should check for updates", async () => {
    const mockPackageJson = {
      name: "test-app",
      version: "1.0.0",
      buildNumber: "1",
    };
    (FileOperations.readPackageJson as jest.Mock).mockReturnValue(
      mockPackageJson
    );
    const tracker = VersionTracker.initialize();
    const hasUpdates = await tracker.checkForUpdates();
    expect(hasUpdates).toBe(false);
  });
});
