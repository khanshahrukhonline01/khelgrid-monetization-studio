export type SlotPeriod = "all" | "morning" | "afternoon" | "evening" | "night";

export type SlotStatus = "available" | "selected" | "booked" | "fast_filling";

export interface CourtFacility {
  id: string;
  name: string;
  sport: string;
  surface: string;
  isIndoor: boolean;
  hasFloodlights: boolean;
  pricePerHour?: number | null;
  operatingHours?: Record<string, { open?: string; close?: string; closed?: boolean }>;
}

export interface CourtSlot {
  id: string;
  courtId: string;
  courtName: string;
  time: string; // e.g. "06:00 AM"
  endTime: string; // e.g. "07:00 AM"
  period: "morning" | "afternoon" | "evening" | "night";
  basePrice: number;
  finalPrice: number;
  status: SlotStatus;
  isPeak: boolean;
  isDiscounted: boolean;
  discountPercent?: number;
  remainingCapacity: number; // e.g. 1 if fast filling, 2+ if normal
}

export interface BookingAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: "trophy" | "shield" | "sparkles" | "zap" | "coffee";
  category: "equipment" | "service" | "beverage";
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  playerCount: number;
  teamName?: string;
  specialRequests?: string;
}

export interface BookingPriceBreakdown {
  baseRatePerHour: number;
  durationHours: number;
  courtTotal: number;
  peakSurcharge: number;
  offPeakDiscount: number;
  addonsTotal: number;
  subtotal: number;
  taxesAndFees: number;
  grandTotal: number;
}
