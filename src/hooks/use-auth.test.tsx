import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  AuthProvider,
  useAuth,
  useUser,
  useSession,
  withProtectedRoute,
  ProtectedRoute,
} from "./use-auth";
import { supabaseAuthService } from "@/services/supabase-auth-service";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { pathname: "/dashboard", searchStr: "" } }),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock supabaseAuthService
vi.mock("@/services/supabase-auth-service", () => ({
  supabaseAuthService: {
    isConfigured: vi.fn(() => true),
    getSession: vi.fn(async () => ({ session: null, user: null })),
    getUserProfile: vi.fn(async () => null),
    onAuthStateChange: vi.fn(() => () => {}),
    signInWithPassword: vi.fn(async ({ email }) => ({
      success: true,
      data: {
        user: { id: "test-user-id", email, user_metadata: { full_name: "Test Athlete" } },
        session: { access_token: "mock-token", user: { id: "test-user-id", email } },
        profile: { fullName: "Test Athlete", role: "athlete", primarySport: "Cricket" },
      },
    })),
    signUp: vi.fn(async ({ email, fullName }) => ({
      success: true,
      data: {
        user: { id: "new-user-id", email, user_metadata: { full_name: fullName } },
        session: { access_token: "new-mock-token" },
        profile: { fullName, role: "athlete" },
      },
    })),
    signOut: vi.fn(async () => ({ success: true })),
    resetPasswordForEmail: vi.fn(async () => ({ success: true, data: null })),
  },
}));

describe("use-auth hook and AuthProvider context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides default auth context values when used outside or inside provider", () => {
    let capturedAuth: any;
    function ConsumerComponent() {
      capturedAuth = useAuth();
      return <div id="consumer">{capturedAuth.name}</div>;
    }

    const html = renderToString(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    expect(html).toContain("consumer");
    expect(capturedAuth).toBeDefined();
    // A demo/local-storage identity must not render as a real signed-in user.
    expect(capturedAuth.isAuthenticated).toBe(false);
    expect(typeof capturedAuth.signInWithEmail).toBe("function");
    expect(typeof capturedAuth.signUpWithEmail).toBe("function");
    expect(typeof capturedAuth.signOut).toBe("function");
    expect(typeof capturedAuth.resetPassword).toBe("function");
  });

  it("convenience sub-hooks useUser and useSession return appropriate slices", () => {
    let capturedUser: any;
    let capturedSession: any;

    function UserConsumer() {
      capturedUser = useUser();
      capturedSession = useSession();
      return <div>Sub-hooks tested</div>;
    }

    renderToString(
      <AuthProvider>
        <UserConsumer />
      </AuthProvider>,
    );

    expect(capturedUser).toBeDefined();
    expect(capturedUser.user).toBeDefined();
    expect(capturedSession).toBeDefined();
  });

  it("calls supabaseAuthService.signInWithPassword via signInWithEmail", async () => {
    let capturedAuth: any;
    function ConsumerComponent() {
      capturedAuth = useAuth();
      return null;
    }

    renderToString(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    const result = await capturedAuth.signInWithEmail("athlete@khelgrid.com", "SecretPass123!");
    expect(supabaseAuthService.signInWithPassword).toHaveBeenCalledWith({
      email: "athlete@khelgrid.com",
      password: "SecretPass123!",
    });
    expect(result.success).toBe(true);
  });

  it("calls supabaseAuthService.signUp via signUpWithEmail with metadata", async () => {
    let capturedAuth: any;
    function ConsumerComponent() {
      capturedAuth = useAuth();
      return null;
    }

    renderToString(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    const result = await capturedAuth.signUpWithEmail("newbie@khelgrid.com", "StrongPassword123!", {
      fullName: "Arjun Tendulkar",
      role: "athlete",
      primarySport: "Cricket",
      city: "Mumbai",
    });

    expect(supabaseAuthService.signUp).toHaveBeenCalledWith({
      email: "newbie@khelgrid.com",
      password: "StrongPassword123!",
      fullName: "Arjun Tendulkar",
      role: "athlete",
      phone: undefined,
      primarySport: "Cricket",
      city: "Mumbai",
    });
    expect(result.success).toBe(true);
  });

  it("calls supabaseAuthService.signUp with string shorthand for fullName", async () => {
    let capturedAuth: any;
    function ConsumerComponent() {
      capturedAuth = useAuth();
      return null;
    }

    renderToString(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    const result = await capturedAuth.signUpWithEmail(
      "short@khelgrid.com",
      "Password123!",
      "Short Name",
    );
    expect(supabaseAuthService.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "short@khelgrid.com",
        fullName: "Short Name",
      }),
    );
    expect(result.success).toBe(true);
  });

  it("calls supabaseAuthService.signOut via signOut method", async () => {
    let capturedAuth: any;
    function ConsumerComponent() {
      capturedAuth = useAuth();
      return null;
    }

    renderToString(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>,
    );

    await capturedAuth.signOut();
    expect(supabaseAuthService.signOut).toHaveBeenCalled();
  });

  it("withProtectedRoute HOC blocks sensitive content when unauthenticated", () => {
    const SensitivePage = () => <div id="sensitive-dashboard">Confidential Athlete Analytics</div>;
    const ProtectedPage = withProtectedRoute(SensitivePage);

    const html = renderToString(<ProtectedPage />);
    expect(html).toContain("protected-route-unauthenticated");
    expect(html).toContain("Sign In Required");
    expect(html).not.toContain("sensitive-dashboard");
  });

  it("ProtectedRoute wrapper blocks children when unauthenticated", () => {
    const html = renderToString(
      <ProtectedRoute>
        <div id="protected-inner">Protected Area</div>
      </ProtectedRoute>,
    );

    expect(html).toContain("protected-route-unauthenticated");
    expect(html).toContain("Sign In Required");
    expect(html).not.toContain("protected-inner");
  });
});
