import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  slugifyAthleteName,
  compressCVPayload,
  decompressCVPayload,
  generateShareableCVUrl,
  resolvePublicSportsCV,
  buildSocialShareLinks,
  savePublicCVToRegistry,
  PUBLIC_CVS_STORAGE_KEY,
} from "@/lib/sports-cv-sharing";
import { getDefaultSportsCV } from "@/lib/sports-cv-storage";
import { ShareSportsCVModal } from "./ShareSportsCVModal";
import type { SportsCVData } from "@/types/sports-cv";

describe("Sports CV Shareable Link Feature", () => {
  let sampleCV: SportsCVData;

  beforeEach(() => {
    sampleCV = getDefaultSportsCV("Aarav Sharma");
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
  });

  describe("Slug and URL Generation", () => {
    it("generates a clean slug from athlete name and sport", () => {
      const slug = slugifyAthleteName("Aarav Sharma", "Cricket");
      expect(slug).toBe("aarav-sharma-cricket");
    });

    it("handles athlete names with special characters or whitespace cleanly", () => {
      const slug = slugifyAthleteName("  Mohd. Rizwan #7  ", "Football");
      expect(slug).toBe("mohd-rizwan-7-football");
    });

    it("generates a full shareable URL with slug and portable payload", () => {
      const result = generateShareableCVUrl(sampleCV, "https://www.khelgrid.com");
      expect(result.slug).toBe("aarav-sharma-cricket");
      expect(result.shortUrl).toBe("https://www.khelgrid.com/cv/aarav-sharma-cricket");
      expect(result.url).toContain("https://www.khelgrid.com/cv/aarav-sharma-cricket?data=");
      expect(result.payloadParam.length).toBeGreaterThan(20);
    });
  });

  describe("Payload Compression and Decompression", () => {
    it("compresses and decompresses SportsCVData with zero data loss", () => {
      const customCV: SportsCVData = {
        ...sampleCV,
        athleteName: "Kavya Patel",
        sport: "Badminton",
        position: "Singles Specialist",
        bio: "National ranking top 10 badminton player from Gujarat.",
      };

      const compressed = compressCVPayload(customCV);
      expect(typeof compressed).toBe("string");
      expect(compressed.length).toBeGreaterThan(0);

      const decompressed = decompressCVPayload(compressed);
      expect(decompressed).not.toBeNull();
      expect(decompressed?.athleteName).toBe("Kavya Patel");
      expect(decompressed?.sport).toBe("Badminton");
      expect(decompressed?.position).toBe("Singles Specialist");
      expect(decompressed?.bio).toBe("National ranking top 10 badminton player from Gujarat.");
    });

    it("returns null safely when given invalid or corrupted payload tokens", () => {
      const invalidResult = decompressCVPayload("invalid-non-base64-random-string!!!");
      expect(invalidResult).toBeNull();

      const emptyResult = decompressCVPayload("");
      expect(emptyResult).toBeNull();
    });
  });

  describe("Public CV Resolution", () => {
    it("resolves from payloadParam even if not in registry", () => {
      const customCV: SportsCVData = {
        ...sampleCV,
        athleteName: "Devansh Sen",
        sport: "Table Tennis",
      };
      const token = compressCVPayload(customCV);

      const resolved = resolvePublicSportsCV("devansh-sen-table-tennis", token);
      expect(resolved.athleteName).toBe("Devansh Sen");
      expect(resolved.sport).toBe("Table Tennis");
    });

    it("resolves from public registry when saved", () => {
      const savedCV: SportsCVData = {
        ...sampleCV,
        athleteName: "Tanvi Verma",
        sport: "Basketball",
      };
      savePublicCVToRegistry(savedCV, "tanvi-verma-basketball");

      const resolved = resolvePublicSportsCV("tanvi-verma-basketball");
      expect(resolved.athleteName).toBe("Tanvi Verma");
      expect(resolved.sport).toBe("Basketball");
    });

    it("resolves standard demo sample for aarav-sharma slug", () => {
      const resolved = resolvePublicSportsCV("aarav-sharma-cricket");
      expect(resolved.athleteName).toBe("Aarav Sharma");
      expect(resolved.sport).toBe("Cricket");
      expect(resolved.achievements.length).toBeGreaterThan(0);
    });

    it("resolves football demo sample for rohan-verma slug", () => {
      const resolved = resolvePublicSportsCV("rohan-verma-football");
      expect(resolved.athleteName).toBe("Rohan Verma");
      expect(resolved.sport).toBe("Football");
    });
  });

  describe("Social Share Links Generation", () => {
    it("generates WhatsApp share URL with preformatted bold text, stats, and link", () => {
      const shareUrl = "https://www.khelgrid.com/cv/aarav-sharma-cricket";
      const links = buildSocialShareLinks(sampleCV, shareUrl);

      expect(links.whatsapp).toContain("https://api.whatsapp.com/send?text=");
      const decodedWhatsapp = decodeURIComponent(links.whatsapp);
      expect(decodedWhatsapp).toContain("Aarav Sharma");
      expect(decodedWhatsapp).toContain("Cricket");
      expect(decodedWhatsapp).toContain(shareUrl);
      expect(decodedWhatsapp).toContain("KhelGrid");
    });

    it("generates Twitter / X tweet intent with hashtags and scout URL", () => {
      const shareUrl = "https://www.khelgrid.com/cv/aarav-sharma-cricket";
      const links = buildSocialShareLinks(sampleCV, shareUrl);

      expect(links.twitter).toContain("https://twitter.com/intent/tweet?");
      const decodedTwitter = decodeURIComponent(links.twitter);
      expect(decodedTwitter).toContain("KhelGrid");
      expect(decodedTwitter).toContain(shareUrl);
    });

    it("generates LinkedIn share URL", () => {
      const shareUrl = "https://www.khelgrid.com/cv/aarav-sharma-cricket";
      const links = buildSocialShareLinks(sampleCV, shareUrl);

      expect(links.linkedin).toContain("https://www.linkedin.com/sharing/share-offsite/");
      expect(links.linkedin).toContain(encodeURIComponent(shareUrl));
    });

    it("generates email scout dossier with structured subject and body", () => {
      const shareUrl = "https://www.khelgrid.com/cv/aarav-sharma-cricket";
      const links = buildSocialShareLinks(sampleCV, shareUrl);

      expect(links.email).toContain("mailto:?subject=");
      const decodedEmail = decodeURIComponent(links.email);
      expect(decodedEmail).toContain("Scout Dossier: Aarav Sharma");
      expect(decodedEmail).toContain(shareUrl);
      expect(decodedEmail).toContain(sampleCV.athleteId);
    });

    it("generates clean scout pitch snippet for direct WhatsApp messaging", () => {
      const shareUrl = "https://www.khelgrid.com/cv/aarav-sharma-cricket";
      const links = buildSocialShareLinks(sampleCV, shareUrl);

      expect(links.scoutPitchSnippet).toContain("ATHLETE SCOUT PROFILE");
      expect(links.scoutPitchSnippet).toContain("Aarav Sharma");
      expect(links.scoutPitchSnippet).toContain("Cricket");
      expect(links.scoutPitchSnippet).toContain(shareUrl);
    });
  });

  describe("ShareSportsCVModal Visual Component", () => {
    it("renders modal structure with public URL, social share buttons and tabs", () => {
      const html = renderToString(
        <ShareSportsCVModal open={true} inline={true} onOpenChange={() => {}} data={sampleCV} />,
      );

      expect(html).toContain("Share Public Sports CV");
      expect(html).toContain("Scout Verified");
      expect(html).toContain("Aarav Sharma");
      expect(html).toContain("Cricket");
      expect(html).toContain("Public Link &amp; Socials");
      expect(html).toContain("Scout QR Code");
      expect(html).toContain("Scout Pitch Text");
      expect(html).toContain("WhatsApp");
      expect(html).toContain("Twitter / X");
      expect(html).toContain("LinkedIn");
      expect(html).toContain("Email Scout");
      expect(html).toContain("Download PNG");
    });
  });
});
