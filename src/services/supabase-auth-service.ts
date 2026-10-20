import { supabase, isSupabaseConfigured, supabaseUrl } from "@/lib/supabase";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import type { Database, AppRole } from "@/types/database";

export interface SupabaseSignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: "athlete" | "coach" | "academy_owner" | "scout" | "user" | "academy";
  primarySport?: string;
  city?: string;
}

export interface SupabaseSignInParams {
  email: string;
  password: string;
}

export interface SupabaseUserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AppRole;
  primarySport: string;
  secondarySports?: string[];
  city: string;
  avatarUrl?: string;
  bio?: string;
  membershipTier?: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | null;
  requiresEmailConfirmation?: boolean;
}

/**
 * Normalizes app roles to PostgreSQL app_role enum
 */
function normalizeAppRole(role?: string): AppRole {
  if (role === "coach") return "coach";
  if (role === "academy" || role === "academy_owner") return "academy_owner";
  if (role === "scout") return "scout";
  if (role === "admin") return "admin";
  return "athlete";
}

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

function metadataString(metadata: ProfileRow["metadata"], key: string): string | undefined {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const value = metadata[key];
  return typeof value === "string" ? value : undefined;
}

function mapProfile(row: ProfileRow): SupabaseUserProfile {
  return {
    id: row.id,
    userId: row.id,
    fullName: row.full_name || "",
    email: row.email || "",
    phone: row.phone || undefined,
    role: normalizeAppRole(row.role),
    primarySport: metadataString(row.metadata, "primary_sport") || "Cricket",
    secondarySports: [],
    city: row.city || "",
    avatarUrl: row.avatar_url || undefined,
    bio: row.bio || undefined,
    membershipTier: row.plan || "free",
  };
}

/**
 * Service encapsulating Supabase Authentication, user profile synchronization, and session management.
 */
export class SupabaseAuthService {
  /**
   * Whether the client has a working Supabase configuration.
   */
  public isConfigured(): boolean {
    return isSupabaseConfigured;
  }

  /**
   * Retrieves the current active Supabase session.
   */
  public async getSession(): Promise<{ session: Session | null; user: User | null }> {
    if (!this.isConfigured()) {
      return { session: null, user: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        return { session: null, user: null };
      }
      return { session: data.session, user: data.session.user };
    } catch (err) {
      console.warn("Failed to get Supabase session:", err);
      return { session: null, user: null };
    }
  }

  /**
   * Retrieves the current Supabase user.
   */
  public async getUser(): Promise<User | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return data.user;
    } catch {
      return null;
    }
  }

  /**
   * Registers a new user with email and password, and automatically provisions their user profile.
   */
  public async signUp(params: SupabaseSignUpParams): Promise<
    AuthResponse<{
      user: User | null;
      session: Session | null;
      profile?: SupabaseUserProfile | null;
    }>
  > {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "Supabase authentication is not configured. Please ensure VITE_SUPABASE_ANON_KEY is provided in your environment.",
      };
    }

    try {
      const appRole = normalizeAppRole(params.role);
      const cleanEmail = params.email.trim().toLowerCase();

      // 1. Call Supabase Auth API
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone: params.phone?.trim() || "",
            role: appRole,
            primary_sport: params.primarySport || "Cricket",
            city: params.city || "Bengaluru",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to create account",
        };
      }

      const createdUser = data.user;
      if (!createdUser) {
        return {
          success: false,
          error: "Sign-up did not return a valid user object.",
        };
      }

      // Check if email confirmation is required by project settings
      const requiresEmailConfirmation = !data.session && createdUser.identities?.length !== 0;

      // The database trigger provisions public.profiles for every Auth user.
      // Never write role/plan/verification fields from the browser.
      let profile: SupabaseUserProfile | null = null;
      if (data.session) {
        const { data: profileRow, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", createdUser.id)
          .maybeSingle();

        if (profileError) {
          console.warn("Could not read provisioned profile after sign up:", profileError);
        } else if (profileRow) {
          profile = mapProfile(profileRow);
        }
      }

      return {
        success: true,
        data: {
          user: createdUser,
          session: data.session,
          profile,
        },
        requiresEmailConfirmation,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected sign-up error occurred.";
      return { success: false, error: message };
    }
  }

  /**
   * Authenticates an existing user with email and password.
   */
  public async signInWithPassword(params: SupabaseSignInParams): Promise<
    AuthResponse<{
      user: User;
      session: Session;
      profile?: SupabaseUserProfile | null;
    }>
  > {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "Supabase authentication is not configured. Please ensure VITE_SUPABASE_ANON_KEY is set.",
      };
    }

    try {
      const cleanEmail = params.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: params.password,
      });

      if (error || !data.user || !data.session) {
        return {
          success: false,
          error: error?.message || "Invalid email or password.",
        };
      }

      // Read the profile keyed by the Auth user UUID.
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      const profile = !profileError && profileRow ? mapProfile(profileRow) : null;
      if (profileError) {
        console.warn("Could not fetch profile on sign in:", profileError);
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
          profile,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in.";
      return { success: false, error: message };
    }
  }

  /**
   * Initiates Google OAuth Sign-In or Sign-Up via Supabase.
   */
  public async signInWithGoogle(
    redirectTo?: string,
  ): Promise<AuthResponse<{ url?: string | null }>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Supabase authentication is not configured in this environment.",
      };
    }

    try {
      const targetRedirect =
        redirectTo ||
        (typeof window !== "undefined" ? `${window.location.origin}/login` : undefined);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: targetRedirect,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: { url: data.url },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate Google sign-in.";
      return { success: false, error: message };
    }
  }

  /**
   * Signs out the current user and invalidates their session.
   */
  public async signOut(): Promise<AuthResponse<void>> {
    if (!this.isConfigured()) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign out.";
      return { success: false, error: message };
    }
  }

  /**
   * Sends a password reset email via Supabase Auth.
   */
  public async resetPasswordForEmail(
    email: string,
    redirectTo?: string,
  ): Promise<AuthResponse<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Supabase is not configured." };
    }

    try {
      const targetRedirect =
        redirectTo ||
        (typeof window !== "undefined"
          ? `${window.location.origin}/forgot-password?mode=reset`
          : undefined);

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: targetRedirect,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Password reset request failed.";
      return { success: false, error: message };
    }
  }

  /**
   * Updates user's password once authorized via recovery token/session.
   */
  public async updatePassword(newPassword: string): Promise<AuthResponse<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Supabase is not configured." };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      return { success: false, error: message };
    }
  }

  /**
   * Subscribes to Supabase authentication state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
   */
  public onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void {
    if (!this.isConfigured()) {
      return () => {};
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  /**
   * Retrieves or creates profile data for a specific user ID.
   */
  public async getUserProfile(userId: string): Promise<SupabaseUserProfile | null> {
    if (!this.isConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) return null;
      return mapProfile(data);
    } catch {
      return null;
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
export default supabaseAuthService;
