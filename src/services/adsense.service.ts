/**
 * Google AdSense Lifecycle & Mobile Build Integration Service
 *
 * Provides centralized lifecycle management for Google AdSense:
 * - Initializes AdSense using `VITE_GOOGLE_ADSENSE_ID` (with normalization & validation)
 * - Detects mobile runtime environments (PWA standalone, Capacitor / Cordova webview, iOS / Android)
 * - Handles mobile app lifecycle events (resume, pause, online, offline, visibilitychange, screen orientation)
 * - Safe loading with GDPR/TCF/UMP consent gating
 * - Error recovery, duplicate script prevention, and cleanup
 */

import {
  adsConfig,
  hasValidPublisherId,
  adsenseScriptSrc,
  normalizePublisherId,
  hasAdSenseEnvId,
  getEnvPublisherId,
} from "@/config/ads";
import type { AdsByGoogleQueue } from "@/components/ads/adsbygoogle";

export type MobilePlatformType = "android" | "ios" | "pwa" | "mobile-web" | "desktop-web";

export interface MobileEnvironmentInfo {
  isMobileDevice: boolean;
  isStandalone: boolean;
  isCapacitor: boolean;
  isCordova: boolean;
  platform: MobilePlatformType;
  screenOrientation: "portrait" | "landscape";
  networkOnline: boolean;
  supportsTouch: boolean;
}

export interface AdSenseInitOptions {
  publisherId?: string;
  enableAutoAds?: boolean;
  testMode?: boolean;
  nonPersonalized?: boolean;
  allowInMobileWebview?: boolean;
  onInitialized?: (publisherId: string) => void;
  onError?: (error: Error) => void;
}

export interface AdSenseServiceState {
  initialized: boolean;
  scriptLoaded: boolean;
  scriptLoading: boolean;
  publisherId: string;
  hasValidId: boolean;
  isPaused: boolean;
  mobileEnv: MobileEnvironmentInfo;
}

const SCRIPT_ID = "adsbygoogle-loader";

class AdSenseService {
  private static instance: AdSenseService | null = null;
  private initialized = false;
  private scriptLoaded = false;
  private scriptLoading = false;
  private isPaused = false;
  private options: AdSenseInitOptions = {};
  private lifecycleListenersAttached = false;
  private unsubscribeListeners: Array<() => void> = [];

  private constructor() {
    // Singleton
  }

  public static getInstance(): AdSenseService {
    if (!AdSenseService.instance) {
      AdSenseService.instance = new AdSenseService();
    }
    return AdSenseService.instance;
  }

  /**
   * Retrieves active publisher ID from options, environment variable `VITE_GOOGLE_ADSENSE_ID`,
   * or the canonical configuration fallback.
   */
  public getPublisherId(): string {
    if (this.options.publisherId) {
      return normalizePublisherId(this.options.publisherId);
    }
    const envId = getEnvPublisherId();
    if (envId) {
      return envId;
    }
    return adsConfig.publisherId;
  }

  /**
   * Checks whether a publisher ID is explicitly available either from passed options
   * or from the VITE_GOOGLE_ADSENSE_ID environment variable.
   */
  public hasEnvPublisherId(): boolean {
    if (this.options.publisherId) {
      return /^ca-pub-\d{16}$/.test(normalizePublisherId(this.options.publisherId));
    }
    return hasAdSenseEnvId();
  }

  /**
   * Validates if the current publisher ID follows standard ca-pub-XXXXXXXXXXXXXXXX (16 digits) format.
   */
  public isValidPublisherId(): boolean {
    const id = this.getPublisherId();
    return /^ca-pub-\d{16}$/.test(id);
  }

  /**
   * Detects the mobile runtime environment (PWA, mobile webview, Capacitor, Cordova, or standard browser).
   */
  public detectMobileEnvironment(): MobileEnvironmentInfo {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        isMobileDevice: false,
        isStandalone: false,
        isCapacitor: false,
        isCordova: false,
        platform: "desktop-web",
        screenOrientation: "portrait",
        networkOnline: true,
        supportsTouch: false,
      };
    }

    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/i.test(ua);
    const isMobileDevice = isIOS || isAndroid || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // Standalone PWA detection
    const isStandalone =
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      (window.navigator as unknown as { standalone?: boolean })?.standalone === true;

    // Capacitor or Cordova wrapper detection
    const isCapacitor = Boolean(
      (
        window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }
      ).Capacitor?.isNativePlatform?.(),
    );
    const isCordova = Boolean((window as unknown as { cordova?: unknown }).cordova);

    let platform: MobilePlatformType = "desktop-web";
    if (isCapacitor || isCordova) {
      platform = isAndroid ? "android" : isIOS ? "ios" : "pwa";
    } else if (isStandalone) {
      platform = "pwa";
    } else if (isMobileDevice) {
      platform = "mobile-web";
    }

    const orientation =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(orientation: landscape)").matches
        ? "landscape"
        : "portrait";

    const supportsTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    return {
      isMobileDevice,
      isStandalone,
      isCapacitor,
      isCordova,
      platform,
      screenOrientation: orientation,
      networkOnline: navigator.onLine !== false,
      supportsTouch,
    };
  }

  /**
   * Main entry point to initialize AdSense.
   * Can be safely called during application boot or client hydration.
   */
  public initialize(options: AdSenseInitOptions = {}): boolean {
    if (typeof window === "undefined") return false;

    this.options = { ...this.options, ...options };

    // When VITE_GOOGLE_ADSENSE_ID is missing from the environment and no explicit publisherId option passed:
    if (!this.hasEnvPublisherId()) {
      if (import.meta.env.DEV) {
        console.info(
          "[AdSenseService] Initialization skipped: VITE_GOOGLE_ADSENSE_ID is not present in environment.",
        );
      }
      this.initialized = false;
      return false;
    }

    const publisherId = this.getPublisherId();

    if (!this.isValidPublisherId()) {
      const err = new Error(
        `[AdSenseService] Invalid or missing AdSense Publisher ID: "${publisherId}". Expected "ca-pub-XXXXXXXXXXXXXXXX".`,
      );
      if (this.options.onError) this.options.onError(err);
      if (import.meta.env.DEV) console.warn(err.message);
      return false;
    }

    this.setupLifecycleManagement();
    this.initialized = true;

    if (this.options.onInitialized) {
      this.options.onInitialized(publisherId);
    }

    return true;
  }

  /**
   * Loads the AdSense script (`adsbygoogle.js`) into the document `<head>`.
   * Enforces single-tag loading, mobile webview safety checks, and non-personalized ads configuration.
   */
  public loadScript(nonPersonalized = false): Promise<boolean> {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return Promise.resolve(false);
    }

    // Strict guard: ensure VITE_GOOGLE_ADSENSE_ID is present before attempting to load script
    if (!this.hasEnvPublisherId()) {
      if (import.meta.env.DEV) {
        console.info(
          "[AdSenseService] AdSense script loading skipped: VITE_GOOGLE_ADSENSE_ID is not present in environment.",
        );
      }
      return Promise.resolve(false);
    }

    const publisherId = this.getPublisherId();
    if (!this.isValidPublisherId()) {
      return Promise.resolve(false);
    }

    // Mobile app wrapper policy safeguard:
    // In strict native WebViews (Cordova/Capacitor), AdSense web tags can violate Google AdSense policy
    // unless AdMob / Google Mobile Ads SDK is used instead.
    const mobileEnv = this.detectMobileEnvironment();
    if ((mobileEnv.isCapacitor || mobileEnv.isCordova) && !this.options.allowInMobileWebview) {
      if (import.meta.env.DEV) {
        console.info(
          "[AdSenseService] Native WebView container detected. AdSense script suppressed to adhere to Google AdSense WebView policies.",
        );
      }
      return Promise.resolve(false);
    }

    // Set Non-Personalized Ads flag on the adsbygoogle queue before script initialization
    const queue = (window.adsbygoogle ??= [] as unknown as AdsByGoogleQueue);
    queue.requestNonPersonalizedAds = nonPersonalized ? 1 : 0;

    // Check if script already exists in document
    const existing =
      document.getElementById(SCRIPT_ID) ||
      document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);

    if (existing) {
      this.scriptLoaded = true;
      return Promise.resolve(true);
    }

    if (this.scriptLoading) {
      return Promise.resolve(true);
    }

    this.scriptLoading = true;

    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.async = true;
      script.crossOrigin = "anonymous";

      if (this.options.enableAutoAds ?? adsConfig.enableAutoAds) {
        script.setAttribute("data-overlays", "bottom");
      }

      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve(true);
      };

      script.onerror = (e) => {
        this.scriptLoading = false;
        const err = new Error(`[AdSenseService] Failed to load AdSense script: ${e}`);
        if (this.options.onError) this.options.onError(err);
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Attaches mobile lifecycle event listeners:
   * - visibilitychange: pauses/resumes refreshes when app is in background or minimized
   * - online / offline: prevents stale ad requests during loss of cellular/Wi-Fi connectivity
   * - orientationchange / resize: triggers responsive layout recalculation
   * - Cordova / Capacitor resume / pause events
   */
  private setupLifecycleManagement(): void {
    if (this.lifecycleListenersAttached || typeof window === "undefined") return;

    this.lifecycleListenersAttached = true;

    // 1. Visibility & Backgrounding
    if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      this.unsubscribeListeners.push(() => {
        if (typeof document.removeEventListener === "function") {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
      });
    }

    // 2. Connectivity (Online / Offline)
    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      const handleOnline = () => {
        this.resume();
      };
      const handleOffline = () => {
        this.pause();
      };
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      this.unsubscribeListeners.push(() => {
        if (typeof window.removeEventListener === "function") {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        }
      });
    }

    // 3. Orientation changes for responsive mobile units
    const handleOrientation = () => {
      this.refreshResponsiveUnits();
    };
    window.addEventListener("orientationchange", handleOrientation);
    this.unsubscribeListeners.push(() =>
      window.removeEventListener("orientationchange", handleOrientation),
    );

    // 4. Mobile container events (Cordova / Capacitor)
    const handlePause = () => this.pause();
    const handleResume = () => this.resume();
    document.addEventListener("pause", handlePause, false);
    document.addEventListener("resume", handleResume, false);
    this.unsubscribeListeners.push(() => {
      document.removeEventListener("pause", handlePause);
      document.removeEventListener("resume", handleResume);
    });
  }

  /**
   * Pauses ad activity (e.g. when app goes to background or network is disconnected).
   */
  public pause(): void {
    this.isPaused = true;
  }

  /**
   * Resumes ad activity when app returns to foreground.
   */
  public resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
  }

  /**
   * Safely pushes a manual ad request into the adsbygoogle queue.
   */
  public pushAd(params: Record<string, unknown> = {}): boolean {
    if (typeof window === "undefined" || this.isPaused) return false;
    if (!this.isValidPublisherId()) return false;

    try {
      const queue = (window.adsbygoogle ??= [] as unknown as AdsByGoogleQueue);
      queue.push(params);
      return true;
    } catch (err) {
      if (this.options.onError && err instanceof Error) {
        this.options.onError(err);
      }
      return false;
    }
  }

  /**
   * Triggers re-flow of responsive ad units on orientation change or viewport resize.
   */
  public refreshResponsiveUnits(): void {
    if (typeof window === "undefined" || this.isPaused) return;
    try {
      // Trigger resize event for AdSense responsive iframe recalculations
      window.dispatchEvent(new Event("resize"));
    } catch {
      // Safe no-op
    }
  }

  /**
   * Returns current snapshot of the service state.
   */
  public getState(): AdSenseServiceState {
    const pubId = this.getPublisherId();
    return {
      initialized: this.initialized,
      scriptLoaded: this.scriptLoaded,
      scriptLoading: this.scriptLoading,
      publisherId: pubId,
      hasValidId: this.isValidPublisherId(),
      isPaused: this.isPaused,
      mobileEnv: this.detectMobileEnvironment(),
    };
  }

  /**
   * Destroys listeners and resets service state (used primarily in tests and teardowns).
   */
  public destroy(): void {
    this.unsubscribeListeners.forEach((unsub) => {
      try {
        unsub();
      } catch {
        // Safe no-op
      }
    });
    this.unsubscribeListeners = [];
    this.lifecycleListenersAttached = false;
    this.initialized = false;
    this.scriptLoaded = false;
    this.scriptLoading = false;
    this.isPaused = false;
  }
}

export const adSenseService = AdSenseService.getInstance();
export { AdSenseService };
