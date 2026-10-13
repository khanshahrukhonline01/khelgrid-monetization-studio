import { useEffect, useState, useRef, useCallback } from "react";
import { hasAdSenseEnvId, getEnvPublisherId, adsConfig, normalizePublisherId } from "@/config/ads";
import { adSenseService } from "@/services/adsense.service";
import type { AdsByGoogleQueue } from "@/components/ads/adsbygoogle";

export type AdSenseLoadStatus =
  "unconfigured" | "idle" | "loading" | "ready" | "error" | "blocked" | "suppressed";

export type AdSenseIssueSeverity = "error" | "warning" | "info";

export type AdSenseIssueCode =
  | "MISSING_ENV_ID"
  | "INVALID_PUBLISHER_ID_FORMAT"
  | "SCRIPT_LOAD_ERROR"
  | "SCRIPT_LOAD_TIMEOUT"
  | "ADBLOCKER_DETECTED"
  | "QUEUE_PUSH_ERROR"
  | "CSP_VIOLATION"
  | "DUPLICATE_SCRIPT"
  | "WEBVIEW_SUPPRESSED"
  | "UNKNOWN_ERROR";

export interface AdSenseDiagnosticIssue {
  id: string;
  type: AdSenseIssueSeverity;
  code: AdSenseIssueCode;
  message: string;
  details?: unknown;
  timestamp: number;
  recommendation?: string;
}

export interface AdSenseQueueStatus {
  defined: boolean;
  queueLength: number;
  isProcessed: boolean;
  requestNonPersonalizedAds?: number;
}

export interface AdSenseDiagnosticState {
  status: AdSenseLoadStatus;
  isLoaded: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: AdSenseDiagnosticIssue | null;
  issues: AdSenseDiagnosticIssue[];
  publisherId: string | null;
  isValidPublisherId: boolean;
  isScriptInDom: boolean;
  scriptSrc: string | null;
  queueStatus: AdSenseQueueStatus;
  isBlockedByAdBlocker: boolean;
  lastCheckedAt: number;
}

export interface AdSenseDiagnosticOptions {
  /**
   * Whether diagnostic monitoring and console reporting is enabled.
   * Defaults to true.
   */
  enabled?: boolean;

  /**
   * Whether to log detailed diagnostic transitions to the console.
   * Errors and warnings are always reported to the console when enabled is true.
   * Defaults to true in development.
   */
  verbose?: boolean;

  /**
   * Prefix applied to console log entries.
   * Defaults to "[AdSense Diagnostics]"
   */
  logPrefix?: string;

  /**
   * Expected publisher ID override. Defaults to environment VITE_GOOGLE_ADSENSE_ID.
   */
  expectedPublisherId?: string;

  /**
   * Milliseconds before considering a loading script timed out or blocked by an ad-blocker.
   * Default: 8000ms.
   */
  timeoutMs?: number;

  /**
   * Optional callback triggered whenever the diagnostic state changes.
   */
  onStateChange?: (state: AdSenseDiagnosticState) => void;

  /**
   * Optional callback triggered whenever an error or critical issue is captured.
   */
  onError?: (issue: AdSenseDiagnosticIssue) => void;
}

export interface AdSenseDiagnosticReport {
  timestamp: string;
  state: AdSenseDiagnosticState;
  summary: string;
  hasFatalErrors: boolean;
  issues: AdSenseDiagnosticIssue[];
}

export interface UseAdSenseDiagnosticsReturn extends AdSenseDiagnosticState {
  /** Re-evaluates current DOM, environment, and queue state immediately */
  runDiagnostics: () => AdSenseDiagnosticReport;
  /** Logs a formatted full diagnostic breakdown directly to the console */
  dumpReport: () => void;
  /** Clears accumulated diagnostic issue history */
  clearIssues: () => void;
}

const DEFAULT_TIMEOUT_MS = 8000;
const SCRIPT_SELECTOR = 'script[src*="pagead2.googlesyndication.com"], script#adsbygoogle-loader';

/**
 * Directly prints a diagnostic issue to the console with structured formatting.
 */
function logIssueToConsole(issue: AdSenseDiagnosticIssue, logPrefix: string, verbose = false) {
  const formattedTitle = `${logPrefix} [${issue.type.toUpperCase()}] [${issue.code}]: ${issue.message}`;
  const payload: Record<string, unknown> = {
    code: issue.code,
    message: issue.message,
    timestamp: new Date(issue.timestamp).toISOString(),
    details: issue.details,
  };

  if (issue.recommendation) {
    payload.recommendation = issue.recommendation;
  }

  if (issue.type === "error") {
    console.error(formattedTitle, payload);
  } else if (issue.type === "warning") {
    console.warn(formattedTitle, payload);
  } else if (verbose) {
    console.info(formattedTitle, payload);
  }
}

/**
 * Inspects current window.adsbygoogle queue safely.
 */
export function inspectAdSenseQueue(): AdSenseQueueStatus {
  if (typeof window === "undefined") {
    return { defined: false, queueLength: 0, isProcessed: false };
  }

  const w = window as unknown as { adsbygoogle?: AdsByGoogleQueue & { loaded?: boolean } };
  const queue = w.adsbygoogle;

  if (!queue) {
    return { defined: false, queueLength: 0, isProcessed: false };
  }

  const isArray = Array.isArray(queue);
  const queueLength = isArray ? queue.length : 0;
  const isProcessed = Boolean(queue.loaded || (!isArray && typeof queue.push === "function"));

  return {
    defined: true,
    queueLength,
    isProcessed,
    requestNonPersonalizedAds: queue.requestNonPersonalizedAds,
  };
}

/**
 * Pure evaluation function that examines current configuration and DOM
 * without needing React hook lifecycle.
 */
export function checkAdSenseDiagnostics(
  options: AdSenseDiagnosticOptions = {},
): AdSenseDiagnosticReport {
  const {
    enabled = true,
    verbose = typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV),
    logPrefix = "[AdSense Diagnostics]",
    expectedPublisherId,
  } = options;

  const envHasId = hasAdSenseEnvId();
  const effectivePubId =
    expectedPublisherId || (envHasId ? getEnvPublisherId() : adsConfig.publisherId || "");
  const isValidFormat = effectivePubId
    ? /^ca-pub-\d{16}$/.test(normalizePublisherId(effectivePubId))
    : false;

  const issues: AdSenseDiagnosticIssue[] = [];

  if (!envHasId && !expectedPublisherId) {
    issues.push({
      id: "env-missing",
      type: "warning",
      code: "MISSING_ENV_ID",
      message:
        "VITE_GOOGLE_ADSENSE_ID is missing or empty in environment. AdSense script injection is deferred.",
      recommendation:
        "Provide VITE_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX in .env to activate live ad loading.",
      timestamp: Date.now(),
    });
  } else if (!isValidFormat) {
    issues.push({
      id: "env-invalid",
      type: "error",
      code: "INVALID_PUBLISHER_ID_FORMAT",
      message: `Publisher ID "${effectivePubId}" does not conform to standard format "ca-pub-XXXXXXXXXXXXXXXX" (16 digits).`,
      details: { publisherId: effectivePubId },
      recommendation:
        "Verify your Google AdSense publisher ID in AdSense console -> Account Information.",
      timestamp: Date.now(),
    });
  }

  const queue = inspectAdSenseQueue();
  const hasDoc = typeof document !== "undefined";
  const scriptEl = hasDoc ? document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR) : null;
  const isLoaded = Boolean(
    scriptEl?.getAttribute("data-loaded") ||
    queue.isProcessed ||
    adSenseService.getState().scriptLoaded,
  );

  const status: AdSenseLoadStatus =
    !envHasId && !expectedPublisherId
      ? "unconfigured"
      : !isValidFormat
        ? "error"
        : isLoaded
          ? "ready"
          : scriptEl
            ? "loading"
            : "idle";

  const fatalErrors = issues.filter((i) => i.type === "error");

  if (enabled) {
    for (const issue of issues) {
      logIssueToConsole(issue, logPrefix, verbose);
    }
  }

  const state: AdSenseDiagnosticState = {
    status,
    isLoaded,
    isLoading: !isLoaded && status === "loading",
    hasError: fatalErrors.length > 0 || !envHasId,
    error: fatalErrors[0] || null,
    issues,
    publisherId: effectivePubId || null,
    isValidPublisherId: isValidFormat,
    isScriptInDom: Boolean(scriptEl),
    scriptSrc: scriptEl?.getAttribute("src") || null,
    queueStatus: queue,
    isBlockedByAdBlocker: false,
    lastCheckedAt: Date.now(),
  };

  return {
    timestamp: new Date().toISOString(),
    state,
    summary:
      status === "ready"
        ? "AdSense script loaded successfully and initialized."
        : fatalErrors.length > 0
          ? `AdSense initialization encountered ${fatalErrors.length} fatal error(s).`
          : `AdSense status: ${status}`,
    hasFatalErrors: fatalErrors.length > 0,
    issues,
  };
}

/**
 * Specialized diagnostic hook that monitors Google AdSense script load state
 * and reports any initialization errors directly to the console for easier debugging.
 */
export function useAdSenseDiagnostics(
  options: AdSenseDiagnosticOptions = {},
): UseAdSenseDiagnosticsReturn {
  const {
    enabled = true,
    verbose = typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV),
    logPrefix = "[AdSense Diagnostics]",
    expectedPublisherId,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    onStateChange,
    onError,
  } = options;

  // Initialize state with immediate evaluation of environment and publisher format
  const [state, setState] = useState<AdSenseDiagnosticState>(() => {
    const report = checkAdSenseDiagnostics({
      enabled,
      verbose,
      logPrefix,
      expectedPublisherId,
    });

    if (onError && report.state.error) {
      try {
        onError(report.state.error);
      } catch {
        // Safe no-op
      }
    }

    return report.state;
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const reportedIssueKeys = useRef<Set<string>>(
    new Set(state.issues.map((i) => `${i.code}:${i.message}`)),
  );
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Directly reports an issue to the browser console and updates internal state.
   */
  const reportIssue = useCallback(
    (issue: AdSenseDiagnosticIssue) => {
      if (!enabled) return;

      const dedupeKey = `${issue.code}:${issue.message}`;
      if (reportedIssueKeys.current.has(dedupeKey)) return;
      reportedIssueKeys.current.add(dedupeKey);

      logIssueToConsole(issue, logPrefix, verbose);

      if (onError && issue.type === "error") {
        try {
          onError(issue);
        } catch {
          // Ignore callback errors
        }
      }

      setState((prev) => {
        const nextIssues = [...prev.issues, issue];
        const nextState: AdSenseDiagnosticState = {
          ...prev,
          issues: nextIssues,
          hasError: prev.hasError || issue.type === "error",
          error: issue.type === "error" ? issue : prev.error,
          status:
            issue.code === "ADBLOCKER_DETECTED"
              ? "blocked"
              : issue.type === "error"
                ? "error"
                : prev.status,
          isBlockedByAdBlocker: prev.isBlockedByAdBlocker || issue.code === "ADBLOCKER_DETECTED",
          lastCheckedAt: Date.now(),
        };

        if (onStateChange) {
          try {
            onStateChange(nextState);
          } catch {
            // Ignore callback errors
          }
        }
        return nextState;
      });
    },
    [enabled, logPrefix, verbose, onError, onStateChange],
  );

  /**
   * Performs an immediate diagnostic check of DOM, environment, and queue state
   */
  const inspectEnvironmentAndDom = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const envHasId = hasAdSenseEnvId();
    const effectivePubId =
      expectedPublisherId || (envHasId ? getEnvPublisherId() : adsConfig.publisherId || "");
    const isValidFormat = effectivePubId
      ? /^ca-pub-\d{16}$/.test(normalizePublisherId(effectivePubId))
      : false;

    // Check configuration
    if (!envHasId && !expectedPublisherId) {
      reportIssue({
        id: "env-missing",
        type: "warning",
        code: "MISSING_ENV_ID",
        message:
          "VITE_GOOGLE_ADSENSE_ID is missing or empty in environment. AdSense script injection is deferred.",
        recommendation:
          "Provide VITE_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX in .env to activate live ad loading.",
        timestamp: Date.now(),
      });
    } else if (!isValidFormat) {
      reportIssue({
        id: "env-invalid",
        type: "error",
        code: "INVALID_PUBLISHER_ID_FORMAT",
        message: `Publisher ID "${effectivePubId}" does not conform to standard format "ca-pub-XXXXXXXXXXXXXXXX" (16 digits).`,
        details: { publisherId: effectivePubId },
        recommendation:
          "Verify your Google AdSense publisher ID in AdSense console -> Account Information.",
        timestamp: Date.now(),
      });
    }

    // Inspect DOM for AdSense script
    const scriptEl = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR);
    const queue = inspectAdSenseQueue();

    if (scriptEl) {
      const src = scriptEl.getAttribute("src") || "";
      const isAlreadyLoaded =
        Boolean(scriptEl.getAttribute("data-loaded")) ||
        queue.isProcessed ||
        adSenseService.getState().scriptLoaded;

      setState((prev) => {
        const nextStatus: AdSenseLoadStatus = isAlreadyLoaded
          ? "ready"
          : prev.status === "error"
            ? "error"
            : "loading";

        const nextState: AdSenseDiagnosticState = {
          ...prev,
          status: nextStatus,
          isScriptInDom: true,
          scriptSrc: src,
          isLoaded: isAlreadyLoaded,
          isLoading: !isAlreadyLoaded && nextStatus === "loading",
          publisherId: effectivePubId || prev.publisherId,
          isValidPublisherId: isValidFormat,
          queueStatus: queue,
          lastCheckedAt: Date.now(),
        };

        if (verbose && !prev.isScriptInDom) {
          console.info(`${logPrefix} AdSense <script> element detected in DOM:`, {
            src,
            async: scriptEl.async,
            crossOrigin: scriptEl.crossOrigin,
          });
        }

        return nextState;
      });
    } else {
      setState((prev) => ({
        ...prev,
        isScriptInDom: false,
        queueStatus: queue,
        publisherId: effectivePubId || prev.publisherId,
        isValidPublisherId: isValidFormat,
        lastCheckedAt: Date.now(),
      }));
    }
  }, [expectedPublisherId, logPrefix, reportIssue, verbose]);

  // Main monitoring effect
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    inspectEnvironmentAndDom();

    // 1. Attach listeners to any existing or injected script element
    const attachScriptListeners = (script: HTMLScriptElement) => {
      const handleLoad = () => {
        script.setAttribute("data-loaded", "true");
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }

        const currentQueue = inspectAdSenseQueue();
        setState((prev) => ({
          ...prev,
          status: "ready",
          isLoaded: true,
          isLoading: false,
          queueStatus: currentQueue,
          lastCheckedAt: Date.now(),
        }));

        if (verbose) {
          console.info(`${logPrefix} AdSense script successfully loaded and ready.`);
        }
      };

      const handleError = (e: Event) => {
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }

        reportIssue({
          id: `script-error-${Date.now()}`,
          type: "error",
          code: "SCRIPT_LOAD_ERROR",
          message:
            "AdSense script (adsbygoogle.js) failed to load from pagead2.googlesyndication.com.",
          details: {
            src: script.src,
            eventType: e.type,
          },
          recommendation:
            "Verify network connectivity, DNS resolution for pagead2.googlesyndication.com, or check if an ad-blocker / privacy firewall is active.",
          timestamp: Date.now(),
        });
      };

      script.addEventListener("load", handleLoad, { once: true });
      script.addEventListener("error", handleError, { once: true });

      return () => {
        script.removeEventListener("load", handleLoad);
        script.removeEventListener("error", handleError);
      };
    };

    let scriptCleanup: (() => void) | null = null;
    const initialScript = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR);
    if (initialScript) {
      scriptCleanup = attachScriptListeners(initialScript);
    }

    // 2. MutationObserver on document.head to catch dynamic script insertion
    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              if (
                el.tagName === "SCRIPT" &&
                (el.id === "adsbygoogle-loader" ||
                  (el.getAttribute("src") || "").includes("adsbygoogle"))
              ) {
                inspectEnvironmentAndDom();
                if (scriptCleanup) scriptCleanup();
                scriptCleanup = attachScriptListeners(el as HTMLScriptElement);
              }
            }
          }
        }
      });

      const target = document.head || document.documentElement;
      if (target) {
        observer.observe(target, { childList: true, subtree: true });
      }
    }

    // 3. Global window error listener for AdSense runtime exceptions
    const handleWindowError = (event: ErrorEvent) => {
      const message = String(event.message || "");
      const filename = String(event.filename || "");

      const isAdSenseRelated =
        filename.includes("adsbygoogle") ||
        filename.includes("pagead2") ||
        message.includes("adsbygoogle") ||
        message.includes("TagError");

      if (isAdSenseRelated) {
        reportIssue({
          id: `runtime-error-${Date.now()}`,
          type: "error",
          code: message.includes("push") ? "QUEUE_PUSH_ERROR" : "UNKNOWN_ERROR",
          message: `AdSense initialization runtime error: ${message}`,
          details: {
            filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
          },
          recommendation: message.includes("No slot size")
            ? "Ensure container element has a non-zero computed width before rendering AdUnit."
            : "Review AdSense integration guidelines and check console stack trace.",
          timestamp: Date.now(),
        });
      }
    };

    // 4. Content Security Policy violation listener
    const handleCspViolation = (event: Event) => {
      const cspEvent = event as SecurityPolicyViolationEvent;
      const blockedUri = cspEvent.blockedURI || "";
      if (
        blockedUri.includes("pagead2.googlesyndication.com") ||
        blockedUri.includes("doubleclick.net")
      ) {
        reportIssue({
          id: `csp-violation-${Date.now()}`,
          type: "error",
          code: "CSP_VIOLATION",
          message: `AdSense script blocked by Content Security Policy (violated directive: ${cspEvent.violatedDirective}).`,
          details: {
            blockedURI: cspEvent.blockedURI,
            violatedDirective: cspEvent.violatedDirective,
            effectiveDirective: cspEvent.effectiveDirective,
          },
          recommendation:
            "Add 'https://pagead2.googlesyndication.com' to your script-src and connect-src CSP headers.",
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener("error", handleWindowError);
    if ("SecurityPolicyViolationEvent" in window || "securitypolicyviolation" in window) {
      window.addEventListener("securitypolicyviolation", handleCspViolation);
    }

    // 5. Ad-blocker & load timeout detection
    if (hasAdSenseEnvId() || expectedPublisherId) {
      timeoutTimerRef.current = setTimeout(() => {
        const currentQueue = inspectAdSenseQueue();
        const currentScript = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR);

        if (
          currentScript &&
          !currentQueue.isProcessed &&
          !currentScript.getAttribute("data-loaded")
        ) {
          reportIssue({
            id: "load-timeout",
            type: "warning",
            code: "ADBLOCKER_DETECTED",
            message: `AdSense script did not finish loading after ${timeoutMs}ms. An ad blocker (e.g. uBlock Origin, Brave Shields) or strict privacy network may be active.`,
            details: {
              timeoutMs,
              scriptFound: Boolean(currentScript),
              queueDefined: currentQueue.defined,
            },
            recommendation:
              "Disable browser ad-blocking extensions for khelgrid.com during local development to test live ads.",
            timestamp: Date.now(),
          });
        }
      }, timeoutMs);
    }

    return () => {
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }
      if (scriptCleanup) {
        scriptCleanup();
      }
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("securitypolicyviolation", handleCspViolation);
    };
  }, [
    enabled,
    expectedPublisherId,
    timeoutMs,
    inspectEnvironmentAndDom,
    logPrefix,
    reportIssue,
    verbose,
  ]);

  /**
   * Run immediate full diagnostic scan and generate structured report
   */
  const runDiagnostics = useCallback(
    (options: { recheck?: boolean } = {}): AdSenseDiagnosticReport => {
      const { recheck = false } = options;
      if (recheck) {
        inspectEnvironmentAndDom();
      }
      const currentQueue = inspectAdSenseQueue();
      const scriptEl =
        typeof document !== "undefined"
          ? document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR)
          : null;

      const currentState = stateRef.current;
      const fatalErrors = currentState.issues.filter((i) => i.type === "error");

      const report: AdSenseDiagnosticReport = {
        timestamp: new Date().toISOString(),
        state: {
          ...currentState,
          queueStatus: currentQueue,
          isScriptInDom: Boolean(scriptEl),
        },
        summary:
          currentState.status === "ready"
            ? "AdSense script loaded successfully and initialized."
            : fatalErrors.length > 0
              ? `AdSense initialization encountered ${fatalErrors.length} fatal error(s).`
              : currentState.status === "blocked"
                ? "AdSense script appears blocked by client ad-blocker."
                : `AdSense status: ${currentState.status}`,
        hasFatalErrors: fatalErrors.length > 0,
        issues: currentState.issues,
      };

      return report;
    },
    [inspectEnvironmentAndDom],
  );

  /**
   * Logs a comprehensive formatted diagnostic table directly to the console
   */
  const dumpReport = useCallback(() => {
    const report = runDiagnostics({ recheck: true });
    console.info(`${logPrefix} Comprehensive Diagnostics Report:`, {
      status: report.state.status,
      publisherId: report.state.publisherId || "(Not configured)",
      isValidPublisherId: report.state.isValidPublisherId,
      isScriptInDom: report.state.isScriptInDom,
      scriptSrc: report.state.scriptSrc || "None",
      queueInitialized: report.state.queueStatus.defined,
      queueLength: report.state.queueStatus.queueLength,
      isBlockedByAdBlocker: report.state.isBlockedByAdBlocker,
      issuesCount: report.issues.length,
    });

    if (report.issues.length > 0) {
      console.warn(`${logPrefix} Reported Issues (${report.issues.length}):`);
      report.issues.forEach((issue, idx) => {
        console.warn(`  [${idx + 1}] [${issue.code}] ${issue.message}`);
        if (issue.recommendation) {
          console.warn(`      Action: ${issue.recommendation}`);
        }
      });
    } else {
      console.info(`${logPrefix} No errors or warnings recorded.`);
    }
  }, [logPrefix, runDiagnostics]);

  /**
   * Clears reported issues
   */
  const clearIssues = useCallback(() => {
    reportedIssueKeys.current.clear();
    const nextState: AdSenseDiagnosticState = {
      ...stateRef.current,
      issues: [],
      error: null,
      hasError: !stateRef.current.isValidPublisherId,
      isBlockedByAdBlocker: false,
    };
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  return {
    ...state,
    runDiagnostics,
    dumpReport,
    clearIssues,
  };
}
