import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { SportsLearningHub } from "./SportsLearningHub";
import { LEARNING_RESOURCES, SPORT_OVERVIEWS } from "@/data/sportsLearningHub";

// Mock tanstack router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => {
    return (
      <a href={typeof to === "string" ? to : "#"} {...props}>
        {children}
      </a>
    );
  },
}));

describe("SportsLearningHub Component", () => {
  it("renders the hero banner, badges and unified title", () => {
    const html = renderToString(<SportsLearningHub />);

    expect(html).toContain("Unified Sports &amp; Learning Hub");
    expect(html).toContain("Master Any Sport Through Books, Videos &amp; Guides");
    expect(html).toContain("Books &amp; Text");
    expect(html).toContain("Video Clinics");
  });

  it("renders source type filter tabs for books, videos, text, and quizzes", () => {
    const html = renderToString(<SportsLearningHub />);

    expect(html).toContain("All Sources");
    expect(html).toContain("Books &amp; Literature");
    expect(html).toContain("Video Masterclasses");
    expect(html).toContain("Text Guides &amp; Rules");
    expect(html).toContain("Interactive Quizzes");
  });

  it("renders curated learning materials including book classics and rulebooks", () => {
    const html = renderToString(<SportsLearningHub />);

    // Books
    expect(html).toContain("The Art of Cricket");
    expect(html).toContain("Sir Donald Bradman");
    expect(html).toContain("Inverting the Pyramid: The History of Football Tactics");
    expect(html).toContain("Kabaddi: Modern Techniques &amp; Tactical Formations");

    // Videos
    expect(html).toContain("Batting Masterclass: The Perfect Cover Drive");
    expect(html).toContain("The Positional Rondo Masterclass");

    // Quizzes
    expect(html).toContain("ICC Laws &amp; Match Scenarios: Test Your Umpire Knowledge");
  });

  it("provides comprehensive sport overviews data across multiple disciplines", () => {
    expect(SPORT_OVERVIEWS["Cricket"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Football"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Badminton"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Kabaddi"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Tennis"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Archery"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Shooting"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Volleyball"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Gymnastics"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Handball"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Judo"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Karate"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Taekwondo"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Water Sports"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Weightlifting"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Wushu"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Wrestling"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Yoga"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Table Tennis"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Fencing"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Equestrian"]).toBeDefined();
    expect(SPORT_OVERVIEWS["Cricket"].governingBody).toBe("International Cricket Council (ICC)");
    expect(SPORT_OVERVIEWS["Cricket"].governingBodyIndia).toBe(
      "Board of Control for Cricket in India (BCCI)",
    );
    expect(SPORT_OVERVIEWS["Archery"].governingBodyIndia).toBe(
      "Archery Association of India (AAI)",
    );
    expect(SPORT_OVERVIEWS["Weightlifting"].governingBodyIndia).toBe(
      "Indian Weightlifting Federation (IWLF)",
    );
  });

  it("contains multi-format resources for various skill levels", () => {
    const sourceTypes = new Set(LEARNING_RESOURCES.map((r) => r.sourceType));
    expect(sourceTypes.has("book")).toBe(true);
    expect(sourceTypes.has("video")).toBe(true);
    expect(sourceTypes.has("text")).toBe(true);
    expect(sourceTypes.has("quiz")).toBe(true);
    expect(sourceTypes.has("audio")).toBe(true);
    expect(sourceTypes.has("diagram")).toBe(true);
  });
});
