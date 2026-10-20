import { supabase, isSupabaseConfigured } from "./supabase";

export interface UserProfileData {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  primarySport: string;
  secondarySports: string[];
  city: string;
  ageCategory: string;
  playingPosition: string;
  bio: string;
  skillLevel: string;
  membershipTier: string;
  syncedToDb?: boolean;
}

export interface SportsAchievement {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  title: string;
  sport: string;
  category: "tournament" | "selection" | "award" | "milestone" | "certification";
  level: "Club" | "District" | "State" | "Zonal" | "National";
  organization: string;
  year: number;
  positionRank?: string;
  description?: string;
  verified: boolean;
  verificationBadge?: string;
  certificateUrl?: string;
  createdAt: string;
  syncedToDb?: boolean;
}

export interface EnrolledProgram {
  id: string;
  programId: string;
  studentName: string;
  studentAge: number;
  contactPhone: string;
  status: "pending" | "active" | "paused" | "completed" | "cancelled";
  createdAt: string;
  programTitle: string;
  coachName: string;
  sport: string;
  city: string;
  area: string;
  level: string;
  pricePerMonth: number;
  imageUrl?: string;
  rating: number;
  schedule: string;
  syncedToDb?: boolean;
}

export interface UserMembershipStatus {
  id: string;
  planName: string;
  tier: "free" | "pro" | "elite" | "academy";
  status: "active" | "renewed" | "expired" | "paused";
  sport: string;
  venueName?: string;
  validFrom: string;
  validUntil: string;
  autoRenew: boolean;
  perks: string[];
  allocatedHoursPerMonth: number;
  usedHoursThisMonth: number;
  pricePaid: number;
  remainingHours: number;
  daysRemaining: number;
  syncedToDb?: boolean;
}

const PROFILE_STORAGE_KEY = "khelgrid_user_profile_v1";
const ACHIEVEMENTS_STORAGE_KEY = "khelgrid_user_achievements_v1";
const MEMBERSHIP_STORAGE_KEY = "khelgrid_user_membership_v1";
const ENROLLMENTS_STORAGE_KEY = "khelgrid_user_enrollments_v1";

export const DEFAULT_USER_PROFILE: UserProfileData = {
  id: "profile-arjun-01",
  userId: "user-arjun-mehta",
  fullName: "Arjun Mehta",
  email: "arjun.mehta@khelgrid.com",
  phone: "+91 98765 43210",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  primarySport: "Cricket",
  secondarySports: ["Badminton", "Football"],
  city: "Bengaluru",
  ageCategory: "U-19",
  playingPosition: "Top-Order Batsman & Right-Arm Off-Break",
  bio: "Passionate top-order batsman & athletic fielder. Represented Karnataka Zonal U-17 team. Aiming for Ranji Trophy state trials and BCCI junior screening.",
  skillLevel: "State Level",
  membershipTier: "Pro Athlete Pass",
  syncedToDb: false,
};

export const DEFAULT_ACHIEVEMENTS: SportsAchievement[] = [
  {
    id: "ach-1",
    title: "Gold Medal · Karnataka State Inter-District U-19 Championship",
    sport: "Cricket",
    category: "tournament",
    level: "State",
    organization: "Karnataka State Cricket Association (KSCA)",
    year: 2025,
    positionRank: "Champions · 1st Place",
    description:
      "Scored 114* off 82 balls in the final against Mysuru Zone at M. Chinnaswamy auxiliary grounds.",
    verified: true,
    verificationBadge: "KSCA Verified Official",
    certificateUrl: "https://www.khelgrid.com/verify/cert/ksca-u19-2025-098",
    createdAt: "2025-11-20T10:00:00.000Z",
    syncedToDb: false,
  },
  {
    id: "ach-2",
    title: "Player of the Tournament · Bengaluru Super League T20",
    sport: "Cricket",
    category: "award",
    level: "District",
    organization: "Bengaluru District Cricket Foundation",
    year: 2025,
    positionRank: "MVP Award & Orange Cap",
    description:
      "Amassed 342 runs across 6 innings at a strike rate of 148.6 with 4 half-centuries.",
    verified: true,
    verificationBadge: "Tournament Scorer Verified",
    createdAt: "2025-07-15T14:30:00.000Z",
    syncedToDb: false,
  },
  {
    id: "ach-3",
    title: "State Selection Camp Finalist · Karnataka Colts Academy",
    sport: "Cricket",
    category: "selection",
    level: "State",
    organization: "National Cricket Academy (NCA) / KSCA",
    year: 2024,
    positionRank: "Top 30 Finalist Shortlist",
    description:
      "Cleared beep test baseline (Level 19.8) and specialized power-hitting metrics over 4 intensive evaluation rounds.",
    verified: true,
    verificationBadge: "Camp Accredited",
    certificateUrl: "https://www.khelgrid.com/verify/cert/nca-camp-2024-411",
    createdAt: "2024-09-08T09:15:00.000Z",
    syncedToDb: false,
  },
  {
    id: "ach-4",
    title: "Runners-Up · All-Bengaluru Inter-Academy Shuttle Open",
    sport: "Badminton",
    category: "tournament",
    level: "Club",
    organization: "Smash Point Badminton Club",
    year: 2024,
    positionRank: "Silver Medal · Men's Doubles",
    description:
      "Reached finals with straight-set victories through quarter and semifinal stages in open tier.",
    verified: false,
    verificationBadge: "Community Logged",
    createdAt: "2024-03-12T16:00:00.000Z",
    syncedToDb: false,
  },
];

export const DEFAULT_MEMBERSHIP: UserMembershipStatus = {
  id: "mem-arjun-pro",
  planName: "KhelGrid Pro Athlete Annual Pass",
  tier: "pro",
  status: "active",
  sport: "Cricket & Multi-Sport",
  venueName: "All Partner Venues Across Bengaluru",
  validFrom: "2026-01-01T00:00:00.000Z",
  validUntil: "2026-12-31T23:59:59.000Z",
  autoRenew: true,
  perks: [
    "Unlimited verified trial applications across India",
    "12 complimentary floodlit court hours every month",
    "Priority instant confirmation at 40+ partner sports hubs",
    "Direct recruiter profile showcasing with verified scout badges",
    "15% concession on official tournament entries & gear",
  ],
  allocatedHoursPerMonth: 12,
  usedHoursThisMonth: 4,
  pricePaid: 4999,
  remainingHours: 8,
  daysRemaining: 198,
  syncedToDb: false,
};

export const DEFAULT_ENROLLED_PROGRAMS: EnrolledProgram[] = [
  {
    id: "enr-01",
    programId: "33333333-3333-3333-3333-333333333333",
    studentName: "Arjun Mehta",
    studentAge: 18,
    contactPhone: "+91 98765 43210",
    status: "active",
    createdAt: "2026-01-10T10:00:00.000Z",
    programTitle: "Elite High-Performance Batting & Match Craft Batch",
    coachName: "Coach Rajesh Nair (BCCI Level 2 / Ex-Ranji)",
    sport: "Cricket",
    city: "Bengaluru",
    area: "Indiranagar",
    level: "Advanced / Competitive",
    pricePerMonth: 4500,
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    schedule: "Tue, Thu, Sat · 6:30 AM – 8:30 AM (Turf Nets & Video Analysis)",
    syncedToDb: false,
  },
  {
    id: "enr-02",
    programId: "44444444-4444-4444-4444-444444444444",
    studentName: "Arjun Mehta",
    studentAge: 18,
    contactPhone: "+91 98765 43210",
    status: "active",
    createdAt: "2026-02-01T14:00:00.000Z",
    programTitle: "Speed, Agility & Core Conditioning for Athletes",
    coachName: "Coach Sunita Verma (CSCS Certified Strength Coach)",
    sport: "Athletics",
    city: "Bengaluru",
    area: "Koramangala",
    level: "All Levels",
    pricePerMonth: 3200,
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    schedule: "Mon, Wed, Fri · 5:00 PM – 6:15 PM (Track & High Intensity Drills)",
    syncedToDb: false,
  },
];

// Helper: Calculate days between now and validUntil
function calculateDaysRemaining(validUntil: string): number {
  try {
    const end = new Date(validUntil).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  } catch {
    return 0;
  }
}

/**
 * Fetch User Profile with live Supabase query and local fallback
 */
export async function getUserProfile(email: string = "arjun.mehta@khelgrid.com"): Promise<{
  profile: UserProfileData;
  isSupabaseLive: boolean;
}> {
  let isSupabaseLive = false;
  let cached: UserProfileData = DEFAULT_USER_PROFILE;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) cached = { ...DEFAULT_USER_PROFILE, ...JSON.parse(stored) };
    } catch (e) {
      console.warn("Failed reading profile from localStorage", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      // 1. First attempt to query 'profiles' table in Supabase
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`email.eq.${email},full_name.ilike.%${cached.fullName}%`)
        .limit(1);

      // 2. If 'profiles' returned nothing or error, fall back to 'user_profiles'
      if (error || !data || data.length === 0) {
        const fallbackRes = await supabase
          .from("user_profiles")
          .select("*")
          .or(`email.eq.${email},full_name.ilike.%${cached.fullName}%`)
          .limit(1);
        if (!fallbackRes.error && fallbackRes.data && fallbackRes.data.length > 0) {
          data = fallbackRes.data;
          error = null;
        }
      }

      if (!error && data && data.length > 0) {
        const row = data[0];
        isSupabaseLive = true;
        const profile: UserProfileData = {
          id: row.id,
          userId: row.user_id,
          fullName: row.full_name,
          email: row.email || email,
          phone: row.phone || cached.phone,
          avatarUrl: row.avatar_url || cached.avatarUrl,
          primarySport: row.primary_sport || cached.primarySport,
          secondarySports: row.secondary_sports || cached.secondarySports,
          city: row.city || cached.city,
          ageCategory: row.age_category || cached.ageCategory,
          playingPosition: row.playing_position || cached.playingPosition,
          bio: row.bio || cached.bio,
          skillLevel: row.skill_level || cached.skillLevel,
          membershipTier: row.membership_tier || cached.membershipTier,
          syncedToDb: true,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        }
        return { profile, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Supabase profiles table query failed, falling back to local state", err);
    }
  }

  return { profile: cached, isSupabaseLive };
}

/**
 * Fetch Sports Achievements with live Supabase query and local fallback
 */
export async function getSportsAchievements(): Promise<{
  achievements: SportsAchievement[];
  isSupabaseLive: boolean;
}> {
  let localList: SportsAchievement[] = [];
  let isSupabaseLive = false;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        localList = JSON.parse(stored);
      } else {
        localList = DEFAULT_ACHIEVEMENTS;
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(localList));
      }
    } catch (e) {
      console.warn("Failed reading achievements from localStorage", e);
      localList = DEFAULT_ACHIEVEMENTS;
    }
  } else {
    localList = DEFAULT_ACHIEVEMENTS;
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("sports_achievements")
        .select("*")
        .order("year", { ascending: false });

      if (!error && data && data.length > 0) {
        isSupabaseLive = true;
        const dbItems: SportsAchievement[] = data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          userEmail: row.user_email,
          title: row.title,
          sport: row.sport,
          category: row.category as SportsAchievement["category"],
          level: row.level as SportsAchievement["level"],
          organization: row.organization,
          year: row.year,
          positionRank: row.position_rank || undefined,
          description: row.description || undefined,
          verified: Boolean(row.verified),
          verificationBadge:
            row.verification_badge || (row.verified ? "Verified Official" : undefined),
          certificateUrl: row.certificate_url || undefined,
          createdAt: row.created_at,
          syncedToDb: true,
        }));

        // Merge: DB items take precedence, plus any local ones created recently that are not yet in DB
        const dbIds = new Set(dbItems.map((item) => item.id));
        const merged = [...dbItems];
        for (const local of localList) {
          if (!dbIds.has(local.id)) {
            merged.push(local);
          }
        }
        merged.sort((a, b) => b.year - a.year);
        return { achievements: merged, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Supabase sports_achievements table query failed, returning cached list", err);
    }
  }

  return { achievements: localList, isSupabaseLive };
}

/**
 * Fetch Enrolled Coaching Programs
 */
export async function getEnrolledPrograms(): Promise<{
  programs: EnrolledProgram[];
  isSupabaseLive: boolean;
}> {
  let localList: EnrolledProgram[] = [];
  let isSupabaseLive = false;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
      if (stored) {
        localList = JSON.parse(stored);
      } else {
        localList = DEFAULT_ENROLLED_PROGRAMS;
        localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(localList));
      }
    } catch (e) {
      console.warn("Failed reading enrollments from localStorage", e);
      localList = DEFAULT_ENROLLED_PROGRAMS;
    }
  } else {
    localList = DEFAULT_ENROLLED_PROGRAMS;
  }

  if (isSupabaseConfigured) {
    try {
      // Query coaching_enrollments joined with coaching_programs
      const { data, error } = await supabase
        .from("coaching_enrollments")
        .select("*, coaching_programs(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        isSupabaseLive = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbItems: EnrolledProgram[] = data.map((item: any) => {
          const prog = item.coaching_programs;
          return {
            id: item.id,
            programId: item.program_id,
            studentName: item.student_name,
            studentAge: item.student_age || 18,
            contactPhone: item.contact_phone,
            status: item.status,
            createdAt: item.created_at,
            programTitle: prog?.title || "Coaching Development Program",
            coachName: prog?.coach_name || "Head Coach",
            sport: prog?.sport || "Sports Training",
            city: prog?.city || "Bengaluru",
            area: prog?.area || "Sports Complex",
            level: prog?.level || "All Levels",
            pricePerMonth: Number(prog?.price_per_month || 3500),
            imageUrl: prog?.image_url || undefined,
            rating: Number(prog?.rating || 4.8),
            schedule: "Weekly Scheduled Sessions",
            syncedToDb: true,
          };
        });

        // Merge with local items if needed
        const dbIds = new Set(dbItems.map((p) => p.id));
        const merged = [...dbItems];
        for (const local of localList) {
          if (!dbIds.has(local.id)) merged.push(local);
        }
        return { programs: merged, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Supabase coaching_enrollments query failed, using fallback enrollments", err);
    }
  }

  return { programs: localList, isSupabaseLive };
}

/**
 * Fetch User Membership Status
 */
export async function getUserMembership(): Promise<{
  membership: UserMembershipStatus;
  isSupabaseLive: boolean;
}> {
  let isSupabaseLive = false;
  let cached: UserMembershipStatus = DEFAULT_MEMBERSHIP;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(MEMBERSHIP_STORAGE_KEY);
      if (stored) cached = { ...DEFAULT_MEMBERSHIP, ...JSON.parse(stored) };
    } catch (e) {
      console.warn("Failed reading membership from localStorage", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("user_memberships")
        .select("*")
        .eq("status", "active")
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        isSupabaseLive = true;
        const remaining = Math.max(0, row.allocated_hours_per_month - row.used_hours_this_month);
        const days = calculateDaysRemaining(row.valid_until);

        const membership: UserMembershipStatus = {
          id: row.id,
          planName: row.plan_name,
          tier: row.tier as UserMembershipStatus["tier"],
          status: row.status as UserMembershipStatus["status"],
          sport: row.sport,
          venueName: row.venue_name || undefined,
          validFrom: row.valid_from,
          validUntil: row.valid_until,
          autoRenew: Boolean(row.auto_renew),
          perks: row.perks && row.perks.length > 0 ? row.perks : DEFAULT_MEMBERSHIP.perks,
          allocatedHoursPerMonth: row.allocated_hours_per_month,
          usedHoursThisMonth: row.used_hours_this_month,
          pricePaid: Number(row.price_paid),
          remainingHours: remaining,
          daysRemaining: days,
          syncedToDb: true,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(membership));
        }
        return { membership, isSupabaseLive: true };
      }
    } catch (err) {
      console.warn("Supabase user_memberships query failed, using fallback membership", err);
    }
  }

  cached.daysRemaining = calculateDaysRemaining(cached.validUntil);
  cached.remainingHours = Math.max(0, cached.allocatedHoursPerMonth - cached.usedHoursThisMonth);
  return { membership: cached, isSupabaseLive };
}

/**
 * Save / Create Sports Achievement in Supabase and local cache
 */
export async function addSportsAchievement(
  achievementInput: Omit<SportsAchievement, "id" | "createdAt" | "syncedToDb">,
): Promise<{ achievement: SportsAchievement; syncedToDb: boolean }> {
  const newId = `ach-${Date.now()}`;
  const now = new Date().toISOString();
  let synced = false;

  const item: SportsAchievement = {
    ...achievementInput,
    id: newId,
    createdAt: now,
    syncedToDb: false,
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("sports_achievements")
        .insert({
          title: achievementInput.title,
          sport: achievementInput.sport,
          category: achievementInput.category,
          level: achievementInput.level,
          organization: achievementInput.organization,
          year: achievementInput.year,
          position_rank: achievementInput.positionRank || null,
          description: achievementInput.description || null,
          verified: achievementInput.verified,
          verification_badge: achievementInput.verificationBadge || null,
          certificate_url: achievementInput.certificateUrl || null,
        })
        .select()
        .single();

      if (!error && data) {
        item.id = data.id;
        item.createdAt = data.created_at;
        item.syncedToDb = true;
        synced = true;
      }
    } catch (err) {
      console.warn("Supabase sports_achievements insert failed, stored locally", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      const list: SportsAchievement[] = stored ? JSON.parse(stored) : [...DEFAULT_ACHIEVEMENTS];
      list.unshift(item);
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("khelgrid_achievement_added", { detail: item }));
    } catch (e) {
      console.warn("Failed saving achievement to localStorage", e);
    }
  }

  return { achievement: item, syncedToDb: synced };
}

/**
 * Update Membership Auto-Renew setting
 */
export async function toggleMembershipAutoRenew(
  membershipId: string,
  autoRenew: boolean,
): Promise<boolean> {
  let synced = false;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from("user_memberships")
        .update({ auto_renew: autoRenew })
        .eq("id", membershipId);

      if (!error) synced = true;
    } catch (err) {
      console.warn("Failed updating auto_renew in Supabase", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(MEMBERSHIP_STORAGE_KEY);
      const membership = stored ? JSON.parse(stored) : { ...DEFAULT_MEMBERSHIP };
      membership.autoRenew = autoRenew;
      localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(membership));
    } catch (e) {
      console.warn("Failed updating membership auto_renew in localStorage", e);
    }
  }

  return synced;
}

/**
 * Update Profile Details
 */
export async function updateUserProfile(
  updated: Partial<UserProfileData>,
): Promise<{ profile: UserProfileData; syncedToDb: boolean }> {
  let synced = false;
  let current = { ...DEFAULT_USER_PROFILE, ...updated };

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) current = { ...JSON.parse(stored), ...updated };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn("Failed updating profile in localStorage", e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        full_name: current.fullName,
        email: current.email,
        phone: current.phone,
        avatar_url: current.avatarUrl,
        primary_sport: current.primarySport,
        secondary_sports: current.secondarySports,
        city: current.city,
        age_category: current.ageCategory,
        playing_position: current.playingPosition,
        bio: current.bio,
        skill_level: current.skillLevel,
        membership_tier: current.membershipTier,
      });
      if (!error) synced = true;
    } catch (err) {
      console.warn("Supabase user_profiles upsert failed", err);
    }
  }

  current.syncedToDb = synced;
  return { profile: current, syncedToDb: synced };
}

/**
 * Record and sync user login state to Supabase database and local session
 */
export async function recordUserLoginInDatabase(account: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "user" | "coach" | "academy" | string;
  city?: string;
  primarySport?: string;
  avatarUrl?: string;
  organization?: string;
  credentials?: string;
}): Promise<{
  success: boolean;
  syncedToDb: boolean;
  timestamp: string;
  profile: UserProfileData;
}> {
  const timestamp = new Date().toISOString();
  let syncedToDb = false;

  const roleLabel =
    account.role === "coach"
      ? "Certified Coach"
      : account.role === "academy"
        ? "Verified Academy"
        : "Athlete / Player";

  const tier =
    account.role === "academy"
      ? "Academy Partner Pass"
      : account.role === "coach"
        ? "Coach Pro Pass"
        : "Pro Athlete Pass";

  const profileData: UserProfileData = {
    id: `profile-${account.id}`,
    userId: account.id,
    fullName: account.name,
    email: account.email || `${account.id}@khelgrid.com`,
    phone: account.phone || "+91 98765 43210",
    avatarUrl:
      account.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    primarySport: account.primarySport || (account.role === "academy" ? "Multi-Sport" : "Cricket"),
    secondarySports:
      account.role === "academy" ? ["Turf Football", "Badminton"] : ["Badminton", "Football"],
    city: account.city || "Bengaluru",
    ageCategory: account.role === "user" ? "Senior / U-23" : "Senior / Professional",
    playingPosition:
      account.role === "coach"
        ? account.credentials || "Head Coach & High-Performance Director"
        : account.role === "academy"
          ? account.organization || "Official Sports Training Academy"
          : "Top-Order Batsman & All-Rounder",
    bio:
      account.role === "coach"
        ? `Verified Coach on KhelGrid. Specializing in ${account.primarySport || "Cricket"}. Mentoring aspiring talent for state and national selections.`
        : account.role === "academy"
          ? `Official partner academy on KhelGrid. Hosting sanctioned trials, tournament qualifiers, and turf bookings in ${account.city || "India"}.`
          : "Active athlete on KhelGrid preparing for state selection trials and competitive tournaments.",
    skillLevel: roleLabel,
    membershipTier: tier,
    syncedToDb: false,
  };

  // 1. Sync to Supabase `user_profiles` database table
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        full_name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        avatar_url: profileData.avatarUrl,
        primary_sport: profileData.primarySport,
        secondary_sports: profileData.secondarySports,
        city: profileData.city,
        age_category: profileData.ageCategory,
        playing_position: profileData.playingPosition,
        bio: profileData.bio,
        skill_level: profileData.skillLevel,
        membership_tier: profileData.membershipTier,
      });

      if (!error) {
        syncedToDb = true;
      } else {
        console.warn("Supabase user_profiles login upsert returned error:", error);
      }
    } catch (err) {
      console.warn("Supabase user_profiles login sync connection failed:", err);
    }
  }

  profileData.syncedToDb = syncedToDb;

  // 2. Persist in local storage table cache
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      localStorage.setItem(
        "khelgrid_last_login_sync",
        JSON.stringify({
          userId: account.id,
          role: account.role,
          timestamp,
          syncedToDb,
        }),
      );
      // Dispatch custom event to notify all components
      window.dispatchEvent(
        new CustomEvent("khelgrid_user_logged_in", {
          detail: { profile: profileData, syncedToDb, timestamp },
        }),
      );
    } catch (e) {
      console.warn("Failed saving login session to localStorage:", e);
    }
  }

  return {
    success: true,
    syncedToDb,
    timestamp,
    profile: profileData,
  };
}
