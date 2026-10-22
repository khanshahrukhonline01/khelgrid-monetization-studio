import { afterEach, describe, expect, it } from "vitest";
import {
  SPORTS_CV_LANGUAGES,
  SPORTS_CV_LANGUAGE_KEY,
  getSportsCVLanguage,
  setSportsCVLanguage,
  tSportsCV,
  type SportsCVKey,
} from "@/lib/sports-cv-i18n";

const coreKeys: SportsCVKey[] = [
  "language", "title", "subtitle", "freeNote", "step1", "step2", "step3",
  "step4", "step5", "step6", "athleteName", "sport", "position",
  "ageCategory", "age", "city", "state", "academy", "height", "weight",
  "bio", "bioHelp", "performance", "metricName", "metricValue", "metricUnit",
  "addMetric", "achievements", "achievementTitle", "competition", "year",
  "level", "award", "addAchievement", "athleteReported", "video", "socialLinks",
  "goals", "availability", "theme", "preview", "review", "reviewHelp", "next",
  "back", "save", "downloadPdf", "downloadPng", "share", "optional", "required",
  "requiredName", "requiredAchievement", "requiredMetric", "saved", "pdfDisclaimer",
  "profile", "performanceHeading", "achievementsHeading", "academyHeading",
  "highlightsHeading", "privacy", "privacyHelp", "noAchievements", "noMetrics",
];

afterEach(() => {
  window.localStorage.removeItem(SPORTS_CV_LANGUAGE_KEY);
});

describe("Sports CV localization", () => {
  it("offers only languages with complete wizard dictionary coverage", () => {
    expect(SPORTS_CV_LANGUAGES.map(({ code }) => code)).toEqual(["en", "hi"]);
    for (const key of coreKeys) {
      expect(tSportsCV(key, "en"), `English translation missing: ${key}`).toBeTruthy();
      expect(tSportsCV(key, "hi"), `Hindi translation missing: ${key}`).toBeTruthy();
      expect(tSportsCV(key, "hi"), `Hindi falls back to English: ${key}`).not.toBe(tSportsCV(key, "en"));
    }
  });

  it("persists the selected language and defaults to English", () => {
    expect(getSportsCVLanguage()).toBe("en");
    setSportsCVLanguage("hi");
    expect(getSportsCVLanguage()).toBe("hi");
  });
});
