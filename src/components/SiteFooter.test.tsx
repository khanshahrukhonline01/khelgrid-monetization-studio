import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { SiteFooter } from "./SiteFooter";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, search, children, ...props }: any) => {
    const searchStr = search ? `?${new URLSearchParams(search as any).toString()}` : "";
    return (
      <a href={`${to}${searchStr}`} {...props}>
        {children}
      </a>
    );
  },
  useRouterState: () => "/",
  useNavigate: () => vi.fn(),
}));

describe("SiteFooter Directory Section", () => {
  it("renders heading 'Game, Sport & Play Across India' without the old 'Popular Slang & Search Directory'", () => {
    const html = renderToString(<SiteFooter />);

    expect(html).toContain("Game, Sport &amp; Play Across India");
    expect(html).not.toContain("Popular Slang &amp; Search Directory");
  });

  it("contains more than 50 directory links in the Game, Sport & Play Across India section", () => {
    const html = renderToString(<SiteFooter />);

    // Count occurrences of links inside the rendered footer
    const linkMatches = html.match(/<a\b[^>]*href=["'][^"']*["'][^>]*>/g) || [];
    expect(linkMatches.length).toBeGreaterThan(50);

    // Verify key categories are rendered
    expect(html).toContain("Game, Sport &amp; Play Essentials");
    expect(html).toContain("Maidan, Turf &amp; Net Practice");
    expect(html).toContain("Akhada, Dangal &amp; Combat");
    expect(html).toContain("National Trials &amp; SAI NCOE");
    expect(html).toContain("Govt Sports Quota Recruitment");
    expect(html).toContain("Age Categories &amp; Leagues");

    // Verify directory badge
    expect(html).toContain("54+ Verified Directories");
  });
});
