import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import LoginPage, { Route } from "@/routes/login";
import { DEMO_ACCOUNTS, ROLE_DEFINITIONS, normalizeRole } from "@/types/auth";
import { recordUserLoginInDatabase } from "@/lib/user-profile-service";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
    useSearch: () => ({ redirect: undefined }),
  }),
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock AuthContext
let mockAuthState: any = {
  isAuthenticated: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  role: "user",
};

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

describe("Login Portal, Role Switching & Database Sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = {
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      role: "user",
    };
  });

  describe("Deferred account access metadata", () => {
    it("marks the coming-soon login route as non-indexable until account access is ready", () => {
      const headFn = (Route as any).head;
      expect(headFn).toBeDefined();
      const headResult = headFn();

      const titleEntry = headResult.meta?.find((m: any) => m.title);
      expect(titleEntry?.title).toBe("Login Coming Soon | KhelGrid");

      const descEntry = headResult.meta?.find((m: any) => m.name === "description");
      expect(descEntry?.content).toContain("login and registration are coming soon");

      const robotsTag = headResult.meta?.find((m: any) => m.name === "robots");
      expect(robotsTag?.content).toContain("noindex");

      const canonical = headResult.links?.find((l: any) => l.rel === "canonical");
      expect(canonical).toBeDefined();
      expect(canonical?.href).toContain("/login");
    });
  });

  describe("Role Definitions & Presets", () => {
    it("defines distinct configurations for user, coach, and academy", () => {
      expect(ROLE_DEFINITIONS.user.label).toContain("Athlete");
      expect(ROLE_DEFINITIONS.coach.label).toContain("Coach");
      expect(ROLE_DEFINITIONS.academy.label).toContain("Academy");

      expect(DEMO_ACCOUNTS.user.name).toBe("Arjun Mehta");
      expect(DEMO_ACCOUNTS.coach.name).toBe("Coach Rajesh Sharma");
      expect(DEMO_ACCOUNTS.academy.name).toBe("Apex Sports Arena & Academy");

      expect(normalizeRole("athlete")).toBe("user");
      expect(normalizeRole("recruiter")).toBe("coach");
      expect(normalizeRole("organizer")).toBe("academy");
    });
  });

  describe("Database Login Sync Service", () => {
    it("successfully records login in database/local storage and marks synced", async () => {
      const result = await recordUserLoginInDatabase({
        id: "coach-rajesh-sharma",
        name: "Coach Rajesh Sharma",
        email: "coach.rajesh@khelgrid.com",
        role: "coach",
        city: "Delhi NCR",
        primarySport: "Cricket & Athletics",
      });

      expect(result.success).toBe(true);
      expect(result.profile.fullName).toBe("Coach Rajesh Sharma");
      expect(result.profile.skillLevel).toBe("Certified Coach");
      expect(result.profile.membershipTier).toBe("Coach Pro Pass");
    });
  });

  describe("Deferred account access rendering", () => {
    it("clearly tells visitors that login and registration are temporarily unavailable", () => {
      const html = renderToString(<LoginPage />);

      expect(html).toContain("ACCOUNT ACCESS COMING SOON");
      expect(html).toContain("Your KhelGrid account is on the way");
      expect(html).toContain("Login and registration are temporarily unavailable");
      expect(html).toContain("Explore KhelGrid");
      expect(html).toContain("Explore sports opportunities");
      expect(html).not.toContain("Mobile OTP");
      expect(html).not.toContain("Password");
    });

    it("keeps account access deferred even when a mocked session is present", () => {
      mockAuthState = {
        isAuthenticated: true,
        user: {
          id: "coach-rajesh",
          name: "Coach Rajesh Sharma",
          email: "coach.rajesh@khelgrid.com",
          role: "coach",
          targetRoute: "/scout-portal",
        },
        login: vi.fn(),
        logout: vi.fn(),
        role: "coach",
      };

      const html = renderToString(<LoginPage />);
      expect(html).toContain("ACCOUNT ACCESS COMING SOON");
      expect(html).toContain("Your KhelGrid account is on the way");
      expect(html).not.toContain("Currently signed in");
      expect(html).not.toContain("Go to Portal");
    });
  });
});
