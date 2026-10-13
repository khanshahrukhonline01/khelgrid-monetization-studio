import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  useAdSenseDiagnostics,
  type AdSenseDiagnosticState,
  type AdSenseDiagnosticIssue,
} from "./use-adsense-diagnostics";
import * as adsConfigModule from "@/config/ads";

describe("useAdSenseDiagnostics Hook", () => {
  let originalConsoleError: typeof console.error;
  let originalConsoleWarn: typeof console.warn;
  let originalConsoleInfo: typeof console.info;

  let consoleErrorCalls: unknown[][] = [];
  let consoleWarnCalls: unknown[][] = [];
  let consoleInfoCalls: unknown[][] = [];

  beforeEach(() => {
    consoleErrorCalls = [];
    consoleWarnCalls = [];
    consoleInfoCalls = [];

    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    originalConsoleInfo = console.info;

    console.error = (...args: unknown[]) => {
      consoleErrorCalls.push(args);
    };
    console.warn = (...args: unknown[]) => {
      consoleWarnCalls.push(args);
    };
    console.info = (...args: unknown[]) => {
      consoleInfoCalls.push(args);
    };

    vi.restoreAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
    vi.restoreAllMocks();
  });

  it("reports warning to console when VITE_GOOGLE_ADSENSE_ID is missing from environment", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);
    vi.spyOn(adsConfigModule, "getEnvPublisherId").mockReturnValue("");

    let capturedState: AdSenseDiagnosticState | null = null;

    function TestComponent() {
      const diag = useAdSenseDiagnostics({ enabled: true });
      capturedState = diag;
      return <div id="test-view">{diag.status}</div>;
    }

    renderToString(<TestComponent />);

    expect(capturedState).not.toBeNull();
    expect(capturedState?.status).toBe("unconfigured");
    expect(capturedState?.isLoaded).toBe(false);

    // Verify console warning was output directly
    const hasEnvWarning = consoleWarnCalls.some((call) =>
      call.some((arg) => typeof arg === "string" && arg.includes("MISSING_ENV_ID")),
    );
    expect(hasEnvWarning).toBe(true);
  });

  it("reports error to console when publisher ID format is invalid", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(true);
    vi.spyOn(adsConfigModule, "getEnvPublisherId").mockReturnValue("invalid-pub-id");

    let capturedState: AdSenseDiagnosticState | null = null;
    const onErrorMock = vi.fn();

    function TestComponent() {
      const diag = useAdSenseDiagnostics({
        enabled: true,
        onError: onErrorMock,
      });
      capturedState = diag;
      return <div id="test-view">{diag.status}</div>;
    }

    renderToString(<TestComponent />);

    expect(capturedState?.hasError).toBe(true);
    expect(capturedState?.isValidPublisherId).toBe(false);

    // Verify console error was reported directly
    const hasFormatError = consoleErrorCalls.some((call) =>
      call.some((arg) => typeof arg === "string" && arg.includes("INVALID_PUBLISHER_ID_FORMAT")),
    );
    expect(hasFormatError).toBe(true);
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "INVALID_PUBLISHER_ID_FORMAT",
        type: "error",
      }),
    );
  });

  it("initializes in idle state when valid publisher ID is present", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(true);
    vi.spyOn(adsConfigModule, "getEnvPublisherId").mockReturnValue("ca-pub-8352691151177209");

    let capturedState: AdSenseDiagnosticState | null = null;

    function TestComponent() {
      const diag = useAdSenseDiagnostics({
        enabled: true,
        expectedPublisherId: "ca-pub-8352691151177209",
      });
      capturedState = diag;
      return <div id="test-view">{diag.status}</div>;
    }

    renderToString(<TestComponent />);

    expect(capturedState?.isValidPublisherId).toBe(true);
    expect(capturedState?.publisherId).toBe("ca-pub-8352691151177209");
  });

  it("provides runDiagnostics and dumpReport methods that log diagnostic details", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(true);
    vi.spyOn(adsConfigModule, "getEnvPublisherId").mockReturnValue("ca-pub-8352691151177209");

    let diagControls: ReturnType<typeof useAdSenseDiagnostics> | null = null;

    function TestComponent() {
      diagControls = useAdSenseDiagnostics({
        enabled: true,
        expectedPublisherId: "ca-pub-8352691151177209",
      });
      return <div id="test-view">{diagControls.status}</div>;
    }

    renderToString(<TestComponent />);

    expect(diagControls).not.toBeNull();
    const report = diagControls!.runDiagnostics();
    expect(report.timestamp).toBeDefined();
    expect(report.state.publisherId).toBe("ca-pub-8352691151177209");

    // Test dumpReport executes without throwing and writes to console
    diagControls!.dumpReport();
    const hasReportLog = consoleInfoCalls.some((call) =>
      call.some((arg) => typeof arg === "string" && arg.includes("Diagnostics Report")),
    );
    expect(hasReportLog).toBe(true);
  });

  it("handles clearing issues with clearIssues()", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);

    let diagControls: ReturnType<typeof useAdSenseDiagnostics> | null = null;

    function TestComponent() {
      diagControls = useAdSenseDiagnostics({ enabled: true });
      return <div id="test-view">{diagControls.status}</div>;
    }

    renderToString(<TestComponent />);
    expect(diagControls).not.toBeNull();

    // Clear issues
    diagControls!.clearIssues();
    const freshReport = diagControls!.runDiagnostics();
    expect(freshReport.issues.length).toBe(0);
  });

  it("suppresses console logging when enabled is set to false", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);

    function TestComponent() {
      useAdSenseDiagnostics({ enabled: false });
      return <div id="test-view">disabled</div>;
    }

    renderToString(<TestComponent />);

    expect(consoleErrorCalls.length).toBe(0);
    expect(consoleWarnCalls.length).toBe(0);
  });

  it("supports custom logPrefix for specialized log filtering", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);

    function TestComponent() {
      useAdSenseDiagnostics({
        enabled: true,
        logPrefix: "[MyCustomAdSenseLogger]",
      });
      return <div id="test-view">custom-prefix</div>;
    }

    renderToString(<TestComponent />);

    const hasCustomPrefix = consoleWarnCalls.some((call) =>
      call.some((arg) => typeof arg === "string" && arg.includes("[MyCustomAdSenseLogger]")),
    );
    expect(hasCustomPrefix).toBe(true);
  });

  it("exports useAdSenseDiagnostics from useAdSenseDiagnostics.ts and @/components/ads", async () => {
    const camelModule = await import("./useAdSenseDiagnostics");
    const adsModule = await import("@/components/ads");

    expect(camelModule.useAdSenseDiagnostics).toBeDefined();
    expect(typeof camelModule.useAdSenseDiagnostics).toBe("function");

    expect(adsModule.useAdSenseDiagnostics).toBeDefined();
    expect(typeof adsModule.useAdSenseDiagnostics).toBe("function");
  });
});
