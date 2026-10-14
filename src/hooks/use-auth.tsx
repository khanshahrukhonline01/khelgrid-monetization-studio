import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ShieldAlert, Loader2, Lock, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { type UserAccount, type UserRole, DEMO_ACCOUNTS, normalizeRole } from "@/types/auth";
import { recordUserLoginInDatabase } from "@/lib/user-profile-service";
import {
  supabaseAuthService,
  type SupabaseSignUpParams,
  type SupabaseSignInParams,
  type AuthResponse,
  type SupabaseUserProfile,
} from "@/services/supabase-auth-service";

export type Plan = "free" | "pro";

export interface SignUpMetadata {
  fullName?: string;
  role?: "athlete" | "coach" | "academy_owner" | "scout" | "user" | "academy";
  phone?: string;
  primarySport?: string;
  city?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAccount;
  session: Session | null;
  name: string;
  email: string;
  phone: string;
  plan: Plan;
  wallet: number;
  applications: string[];
  paidApplications: string[];
  boostedTrials: string[];
  sportsCVUnlocked: boolean;
  role: UserRole;
  lastLoginAt?: string;
  lastSyncedToDb?: boolean;
  isSupabaseAuthActive?: boolean;
}

export interface LoginOptions {
  identifier: string;
  role: "user" | "coach" | "academy";
  name?: string;
  organization?: string;
  otp?: string;
  password?: string;
}

export interface LoginResult {
  success: boolean;
  syncedToDb: boolean;
  user: UserAccount;
  targetRoute: string;
  message?: string;
}

export interface AuthContextValue extends AuthState {
  isLoading: boolean;
  hydrated: boolean;
  freeLimit: number;
  remainingFree: number;
  // Core Supabase Authentication methods requested
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<
    AuthResponse<{ user: unknown; session: unknown; profile?: SupabaseUserProfile | null }>
  >;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata?: SignUpMetadata | string,
  ) => Promise<
    AuthResponse<{ user: unknown; session: unknown; profile?: SupabaseUserProfile | null }>
  >;
  signInWithGoogle: (redirectTo?: string) => Promise<AuthResponse<{ url?: string | null }>>;
  signOut: () => Promise<void>;
  resetPassword: (email: string, redirectTo?: string) => Promise<AuthResponse<void | null>>;
  updatePassword: (newPassword: string) => Promise<AuthResponse<void>>;

  // Supabase aliases
  signUpWithSupabase: (
    params: SupabaseSignUpParams,
  ) => Promise<
    AuthResponse<{ user: unknown; session: unknown; profile?: SupabaseUserProfile | null }>
  >;
  signInWithSupabase: (
    params: SupabaseSignInParams,
  ) => Promise<
    AuthResponse<{ user: unknown; session: unknown; profile?: SupabaseUserProfile | null }>
  >;
  logout: () => Promise<void>;

  // KhelGrid athlete actions & simulator tools
  canApply: (trialId: string) => boolean;
  applyToTrial: (trialId: string) => void;
  deductWallet: (amount: number, description: string) => boolean;
  topUpWallet: (amount: number) => void;
  upgradeToPro: () => void;
  payForApplication: (trialId: string, method: "wallet" | "upi") => boolean;
  boostTrial: (trialId: string, method: "wallet" | "upi") => boolean;
  unlockSportsCV: (method: "wallet" | "upi") => boolean;
  login: (options: LoginOptions) => Promise<LoginResult>;
  switchRole: (role: "user" | "coach" | "academy") => Promise<void>;
  setRole: (r: UserRole) => void;
  reset: () => void;
}

const FREE_LIMIT = 2;
const STORAGE_KEY = "khelgrid-auth-v1";
const defaultUser: UserAccount = DEMO_ACCOUNTS.user;

const defaultState: AuthState = {
  isAuthenticated: true,
  user: defaultUser,
  session: null,
  name: defaultUser.name,
  email: defaultUser.email,
  phone: defaultUser.phone,
  plan: "free",
  wallet: 150,
  applications: [],
  paidApplications: [],
  boostedTrials: ["t-3"],
  sportsCVUnlocked: false,
  role: "user",
  lastLoginAt: new Date().toISOString(),
  lastSyncedToDb: true,
  isSupabaseAuthActive: false,
};

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * React context provider that wraps the application and manages the user session.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // 1. Initial hydration from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const resolvedRole = normalizeRole(parsed.role || parsed.user?.role);
        const baseUser = DEMO_ACCOUNTS[resolvedRole] || defaultUser;
        const resolvedUser: UserAccount = {
          ...baseUser,
          ...(parsed.user || {}),
          name: parsed.name || parsed.user?.name || baseUser.name,
          role: resolvedRole,
        };

        setState({
          ...defaultState,
          ...parsed,
          user: resolvedUser,
          name: resolvedUser.name,
          role: resolvedRole,
        });
      }
    } catch {
      // Ignore localStorage parse errors
    }
    setHydrated(true);
  }, []);

  // 2. Synchronize active Supabase Session & listen to real-time auth changes
  useEffect(() => {
    if (!supabaseAuthService.isConfigured()) return;

    // Check for existing session on startup
    supabaseAuthService.getSession().then(async ({ session, user }) => {
      if (session && user) {
        const profile = await supabaseAuthService.getUserProfile(user.id);
        const role = (
          profile?.role === "coach"
            ? "coach"
            : profile?.role === "academy_owner"
              ? "academy"
              : "user"
        ) as UserRole;

        const userAcc: UserAccount = {
          id: user.id,
          name:
            profile?.fullName ||
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Athlete",
          email: user.email || "",
          phone: profile?.phone || user.user_metadata?.phone || "",
          role,
          avatarUrl: profile?.avatarUrl,
          primarySport: profile?.primarySport || "Cricket",
          city: profile?.city || "Bengaluru",
          verified: true,
          targetRoute:
            role === "coach" ? "/scout-portal" : role === "academy" ? "/academy" : "/profile",
        };

        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isSupabaseAuthActive: true,
          session,
          user: userAcc,
          name: userAcc.name,
          email: userAcc.email,
          phone: userAcc.phone,
          role,
          lastSyncedToDb: true,
        }));
      }
    });

    // Listen to real-time session changes (token refresh, sign-in, sign-out)
    const unsubscribe = supabaseAuthService.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await supabaseAuthService.getUserProfile(session.user.id);
        const role = (
          profile?.role === "coach"
            ? "coach"
            : profile?.role === "academy_owner"
              ? "academy"
              : "user"
        ) as UserRole;

        const userAcc: UserAccount = {
          id: session.user.id,
          name:
            profile?.fullName ||
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "Athlete",
          email: session.user.email || "",
          phone: profile?.phone || session.user.user_metadata?.phone || "",
          role,
          avatarUrl: profile?.avatarUrl,
          primarySport: profile?.primarySport || "Cricket",
          city: profile?.city || "Bengaluru",
          verified: true,
          targetRoute: "/profile",
        };

        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isSupabaseAuthActive: true,
          session,
          user: userAcc,
          name: userAcc.name,
          email: userAcc.email,
          phone: userAcc.phone,
          role,
          lastSyncedToDb: true,
        }));
      } else if (event === "SIGNED_OUT") {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          isSupabaseAuthActive: false,
          session: null,
          name: "Guest User",
          role: "user",
          user: {
            id: "guest-user",
            name: "Guest User",
            email: "guest@khelgrid.com",
            phone: "",
            role: "user",
          },
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 3. Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const remainingFree = Math.max(
    0,
    FREE_LIMIT - state.applications.filter((id) => !state.paidApplications.includes(id)).length,
  );

  const canApply = (trialId: string) => {
    if (state.applications.includes(trialId)) return true;
    if (state.plan === "pro") return true;
    return remainingFree > 0;
  };

  const applyToTrial = (trialId: string) => {
    setState((s) =>
      s.applications.includes(trialId) ? s : { ...s, applications: [...s.applications, trialId] },
    );
  };

  const deductWallet = (amount: number, _description: string) => {
    if (state.wallet < amount) return false;
    setState((s) => ({ ...s, wallet: s.wallet - amount }));
    return true;
  };

  const topUpWallet = (amount: number) => setState((s) => ({ ...s, wallet: s.wallet + amount }));

  const upgradeToPro = () => setState((s) => ({ ...s, plan: "pro" }));

  const payForApplication = (trialId: string, method: "wallet" | "upi") => {
    if (method === "wallet") {
      if (state.wallet < 49) return false;
      setState((s) => ({
        ...s,
        wallet: s.wallet - 49,
        applications: s.applications.includes(trialId)
          ? s.applications
          : [...s.applications, trialId],
        paidApplications: s.paidApplications.includes(trialId)
          ? s.paidApplications
          : [...s.paidApplications, trialId],
      }));
      return true;
    }
    setState((s) => ({
      ...s,
      applications: s.applications.includes(trialId)
        ? s.applications
        : [...s.applications, trialId],
      paidApplications: s.paidApplications.includes(trialId)
        ? s.paidApplications
        : [...s.paidApplications, trialId],
    }));
    return true;
  };

  const boostTrial = (trialId: string, method: "wallet" | "upi") => {
    if (method === "wallet") {
      if (state.wallet < 1500) return false;
      setState((s) => ({
        ...s,
        wallet: s.wallet - 1500,
        boostedTrials: s.boostedTrials.includes(trialId)
          ? s.boostedTrials
          : [...s.boostedTrials, trialId],
      }));
      return true;
    }
    setState((s) => ({
      ...s,
      boostedTrials: s.boostedTrials.includes(trialId)
        ? s.boostedTrials
        : [...s.boostedTrials, trialId],
    }));
    return true;
  };

  const unlockSportsCV = (method: "wallet" | "upi") => {
    if (method === "wallet") {
      if (state.wallet < 199) return false;
      setState((s) => ({ ...s, wallet: s.wallet - 199, sportsCVUnlocked: true }));
      return true;
    }
    setState((s) => ({ ...s, sportsCVUnlocked: true }));
    return true;
  };

  /**
   * Traditional / Demo login
   */
  const login = async (options: LoginOptions): Promise<LoginResult> => {
    const role = options.role;
    const baseDemo = DEMO_ACCOUNTS[role];
    const isEmail = options.identifier.includes("@");

    const account: UserAccount = {
      id: `${role}-${options.identifier.replace(/[^a-zA-Z0-9]/g, "").slice(0, 15) || "demo"}`,
      name: options.name || baseDemo.name,
      email: isEmail
        ? options.identifier
        : options.identifier
          ? `${options.identifier}@khelgrid.com`
          : baseDemo.email,
      phone: !isEmail ? options.identifier : baseDemo.phone,
      role,
      avatarUrl: baseDemo.avatarUrl,
      city: baseDemo.city,
      primarySport: baseDemo.primarySport,
      secondarySports: baseDemo.secondarySports,
      organization: options.organization || baseDemo.organization,
      credentials: baseDemo.credentials,
      licenseNumber: baseDemo.licenseNumber,
      verified: true,
      lastLoginAt: new Date().toISOString(),
      targetRoute: baseDemo.targetRoute,
    };

    const dbResult = await recordUserLoginInDatabase(account);

    setState((s) => ({
      ...s,
      isAuthenticated: true,
      user: account,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role,
      lastLoginAt: dbResult.timestamp,
      lastSyncedToDb: dbResult.syncedToDb,
    }));

    return {
      success: true,
      syncedToDb: dbResult.syncedToDb,
      user: account,
      targetRoute: account.targetRoute || "/dashboard",
      message: `Signed in as ${account.name} (${role})`,
    };
  };

  /**
   * Supabase native email/password Sign Up
   */
  const signUpWithSupabase = async (
    params: SupabaseSignUpParams,
  ): Promise<
    AuthResponse<{ user: unknown; session: unknown; profile?: SupabaseUserProfile | null }>
  > => {
    const res = await supabaseAuthService.signUp(params);
    if (res.success && res.data?.user) {
      const user = res.data.user as User;
      const profile = res.data.profile;
      const role = (
        profile?.role === "coach" ? "coach" : profile?.role === "academy_owner" ? "academy" : "user"
      ) as UserRole;

      if (res.data.session) {
        const session = res.data.session as Session;
        const userAcc: UserAccount = {
          id: user.id,
          name: profile?.fullName || params.fullName,
          email: user.email || params.email,
          phone: profile?.phone || params.phone || "",
          role,
          primarySport: profile?.primarySport || params.primarySport || "Cricket",
          city: profile?.city || params.city || "Bengaluru",
          verified: true,
          targetRoute: "/profile",
        };

        setState((s) => ({
          ...s,
          isAuthenticated: true,
          isSupabaseAuthActive: true,
          session,
          user: userAcc,
          name: userAcc.name,
          email: userAcc.email,
          phone: userAcc.phone,
          role,
          lastSyncedToDb: true,
        }));
      }
    }
    return res;
  };

  /**
   * Supabase native email/password Sign In
   */
  const signInWithSupabase = async (
    params: SupabaseSignInParams,
  ): Promise<
    AuthResponse<{ user: unknown; session: unknown; profile?: SupabaseUserProfile | null }>
  > => {
    const res = await supabaseAuthService.signInWithPassword(params);
    if (res.success && res.data) {
      const user = res.data.user as User;
      const profile = res.data.profile;
      const role = (
        profile?.role === "coach" ? "coach" : profile?.role === "academy_owner" ? "academy" : "user"
      ) as UserRole;

      const userAcc: UserAccount = {
        id: user.id,
        name:
          profile?.fullName ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Athlete",
        email: user.email || params.email,
        phone: profile?.phone || user.user_metadata?.phone || "",
        role,
        avatarUrl: profile?.avatarUrl,
        primarySport: profile?.primarySport || "Cricket",
        city: profile?.city || "Bengaluru",
        verified: true,
        targetRoute: "/profile",
      };

      setState((s) => ({
        ...s,
        isAuthenticated: true,
        isSupabaseAuthActive: true,
        session: (res.data?.session as Session) || null,
        user: userAcc,
        name: userAcc.name,
        email: userAcc.email,
        phone: userAcc.phone,
        role,
        lastSyncedToDb: true,
      }));
    }
    return res;
  };

  /**
   * Direct signInWithEmail helper
   */
  const signInWithEmail = async (email: string, password: string) => {
    return signInWithSupabase({ email, password });
  };

  /**
   * Direct signInWithGoogle helper
   */
  const signInWithGoogle = async (
    redirectTo?: string,
  ): Promise<AuthResponse<{ url?: string | null }>> => {
    if (supabaseAuthService.isConfigured()) {
      return supabaseAuthService.signInWithGoogle(redirectTo);
    }

    // In preview / demo environment without active Supabase OAuth keys:
    // Seamlessly authenticate the user with verified Google identity
    const googleUser: UserAccount = {
      id: "google-athlete",
      name: "Google Athlete",
      email: "khelgrid@gmail.com",
      phone: "+91 98765 43210",
      role: "user",
      avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      city: "Bengaluru",
      primarySport: "Cricket",
      secondarySports: ["Football", "Badminton"],
      organization: "KhelGrid Verified Network",
      verified: true,
      lastLoginAt: new Date().toISOString(),
      targetRoute: "/profile",
    };

    const dbResult = await recordUserLoginInDatabase(googleUser);

    setState((s) => ({
      ...s,
      isAuthenticated: true,
      user: googleUser,
      name: googleUser.name,
      email: googleUser.email,
      phone: googleUser.phone,
      role: "user",
      lastLoginAt: dbResult.timestamp,
      lastSyncedToDb: dbResult.syncedToDb,
    }));

    return {
      success: true,
      data: { url: null },
    };
  };

  /**
   * Direct signUpWithEmail helper
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: SignUpMetadata | string,
  ) => {
    const meta = typeof metadata === "string" ? { fullName: metadata } : metadata || {};
    return signUpWithSupabase({
      email,
      password,
      fullName: meta.fullName || email.split("@")[0] || "Athlete",
      role: meta.role,
      phone: meta.phone,
      primarySport: meta.primarySport || "Cricket",
      city: meta.city || "Bengaluru",
    });
  };

  /**
   * Direct signOut / logout helper
   */
  const logout = async () => {
    try {
      await supabaseAuthService.signOut();
    } catch {
      // ignore
    }

    setState((s) => ({
      ...s,
      isAuthenticated: false,
      isSupabaseAuthActive: false,
      session: null,
      name: "Guest User",
      role: "user",
      user: {
        id: "guest-user",
        name: "Guest User",
        email: "guest@khelgrid.com",
        phone: "",
        role: "user",
      },
    }));

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const signOut = logout;

  const resetPassword = async (email: string, redirectTo?: string) => {
    return supabaseAuthService.resetPasswordForEmail(email, redirectTo);
  };

  const updatePassword = async (newPassword: string) => {
    return supabaseAuthService.updatePassword(newPassword);
  };

  const switchRole = async (targetRole: "user" | "coach" | "academy") => {
    const targetAccount = DEMO_ACCOUNTS[targetRole];
    await login({
      identifier: targetAccount.phone,
      role: targetRole,
      name: targetAccount.name,
    });
  };

  const setRole = (r: UserRole) => {
    const norm = normalizeRole(r);
    setState((s) => ({
      ...s,
      role: r,
      user: s.user ? { ...s.user, role: norm } : null,
    }));
  };

  const reset = () => setState(defaultState);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isLoading: !hydrated,
        hydrated,
        freeLimit: FREE_LIMIT,
        remainingFree,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        canApply,
        applyToTrial,
        deductWallet,
        topUpWallet,
        upgradeToPro,
        payForApplication,
        boostTrial,
        unlockSportsCV,
        login,
        signUpWithSupabase,
        signInWithSupabase,
        logout,
        switchRole,
        setRole,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const fallbackAuthContext: AuthContextValue = {
  ...defaultState,
  isLoading: false,
  hydrated: true,
  freeLimit: FREE_LIMIT,
  remainingFree: FREE_LIMIT,
  signInWithEmail: async () => ({
    success: true,
    data: { user: defaultUser, session: null },
  }),
  signUpWithEmail: async () => ({
    success: true,
    data: { user: defaultUser, session: null },
  }),
  signInWithGoogle: async () => ({
    success: true,
    data: { url: null },
  }),
  signOut: async () => {},
  resetPassword: async () => ({
    success: true,
    data: null,
  }),
  updatePassword: async () => ({
    success: true,
  }),
  canApply: () => true,
  applyToTrial: () => {},
  deductWallet: () => true,
  topUpWallet: () => {},
  upgradeToPro: () => {},
  payForApplication: () => true,
  boostTrial: () => true,
  unlockSportsCV: () => true,
  login: async () => ({
    success: true,
    syncedToDb: true,
    user: defaultUser,
    targetRoute: "/dashboard",
  }),
  signUpWithSupabase: async () => ({
    success: true,
    data: { user: null, session: null },
  }),
  signInWithSupabase: async () => ({
    success: true,
    data: { user: null as unknown as User, session: null as unknown as Session },
  }),
  logout: async () => {},
  switchRole: async () => {},
  setRole: () => {},
  reset: () => {},
};

/**
 * Custom hook to consume the AuthContext session and methods.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  return ctx || fallbackAuthContext;
}

/**
 * Convenience sub-hooks
 */
export function useUser() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
}

export function useSession() {
  const { session, isAuthenticated, isLoading } = useAuth();
  return { session, isAuthenticated, isLoading };
}

/* =========================================================================
 * Protected Route Wrapper Component & HOC for sensitive dashboard pages
 * ========================================================================= */

export interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowedRoles?: string[];
  requiredRole?: string;
  message?: string;
  unauthorizedFallback?: ReactNode;
  showToast?: boolean;
}

/**
 * ProtectedRoute component wrapper for sensitive dashboard pages.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
  requiredRole,
  message,
  unauthorizedFallback,
  showToast = true,
}: ProtectedRouteProps) {
  const auth = useAuth();
  const { isAuthenticated, isLoading, role, user } = auth;
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const currentPath = location.pathname;
  const currentSearch = location.searchStr || "";
  const fullCurrentUrl = `${currentPath}${currentSearch ? `?${currentSearch}` : ""}`;
  const redirectedRef = useRef(false);

  const rolesList = allowedRoles || (requiredRole ? [requiredRole] : undefined);
  const isRoleAuthorized = !rolesList || rolesList.length === 0 || rolesList.includes(role);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      const defaultMsg = message || "Please sign in to access member-only content.";
      if (showToast) {
        toast.info(defaultMsg, { id: "protected-route-redirect" });
      }

      const redirectParam =
        fullCurrentUrl && fullCurrentUrl !== "/" && fullCurrentUrl !== "/login"
          ? fullCurrentUrl
          : undefined;

      navigate({
        to: redirectTo,
        search: redirectParam ? { redirect: redirectParam } : undefined,
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, fullCurrentUrl, message, showToast]);

  if (isLoading) {
    return (
      <main
        id="protected-route-loading"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Verifying member credentials...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    const redirectParam =
      fullCurrentUrl && fullCurrentUrl !== "/" && fullCurrentUrl !== "/login"
        ? fullCurrentUrl
        : undefined;

    return (
      <main
        id="protected-route-unauthenticated"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center"
      >
        <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>

          <Badge
            variant="outline"
            className="mt-4 border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary"
          >
            Member-Only Area
          </Badge>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Sign In Required
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {message ||
              "This section contains member-exclusive content and services. Please sign in to continue."}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              id="protected-route-login-btn"
              asChild
              className="rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Link
                to={redirectTo}
                search={redirectParam ? { redirect: redirectParam } : undefined}
              >
                Log In to Continue
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border text-foreground hover:bg-secondary"
            >
              <Link to="/">Explore KhelGrid</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!isRoleAuthorized) {
    if (unauthorizedFallback) {
      return <>{unauthorizedFallback}</>;
    }

    return (
      <main
        id="protected-route-unauthorized-role"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center"
      >
        <div className="rounded-2xl border border-amber-500/30 bg-card p-6 shadow-sm sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <Badge
            variant="outline"
            className="mt-4 border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
          >
            Role Restricted
          </Badge>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Specialized Access Required
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This section requires {rolesList.map((r) => `"${r}"`).join(" or ")} privileges. You are
            currently signed in as{" "}
            <span className="font-semibold text-foreground">
              {user?.name || "Athlete"} ({role})
            </span>
            .
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Link to="/login">
                <UserCheck className="mr-1.5 h-4 w-4" />
                Switch Account
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border text-foreground hover:bg-secondary"
            >
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

export const RequireAuth = ProtectedRoute;

/**
 * Higher-Order Component (HOC) wrapper to protect sensitive dashboard pages.
 *
 * @example
 * export const ProtectedDashboard = withProtectedRoute(DashboardPage, {
 *   message: "Sign in required to view your athlete dashboard",
 *   allowedRoles: ["user", "coach"]
 * });
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, "children">,
): React.FC<P> {
  const AuthenticatedRouteWrapper: React.FC<P> = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  const displayName = Component.displayName || Component.name || "Component";
  AuthenticatedRouteWrapper.displayName = `withProtectedRoute(${displayName})`;

  return AuthenticatedRouteWrapper;
}

export default useAuth;
