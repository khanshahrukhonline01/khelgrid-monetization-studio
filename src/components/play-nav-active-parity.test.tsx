import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { useRouterState } from "@tanstack/react-router";
import { FeaturesSidebar } from "./FeaturesSidebar";
import { NavDrawer } from "./NavDrawer";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, "aria-current": ariaCurrent, ...props }: any) => (
    <a href={to} aria-current={ariaCurrent} {...props}>
      {children}
    </a>
  ),
  useRouterState: vi.fn(),
  useNavigate: () => vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ plan: "free", wallet: 0 }),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ asChild, size, variant, children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <>{children}</>,
  SheetContent: ({ children }: any) => <div>{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
  SheetTrigger: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/components/ads", () => ({
  SidebarAd: () => null,
}));

function extractPlayAnchor(html: string) {
  const anchorRe = /<a\b(?=[^>]*\bhref="\/play")(?=[^>]*\bclass="([^"]*)")[^>]*>(.*?)<\/a>/;
  const match = html.match(anchorRe);
  if (!match) return null;
  const inner = match[2];
  const iconMatch = inner.match(/<svg\b[^>]*\bclass="([^"]*)"/);
  return {
    anchorClass: match[1],
    iconClass: iconMatch?.[1] ?? "",
  };
}

function hasToken(className: string, token: string) {
  return className.trim().split(/\s+/).includes(token);
}

const ACTIVE_TOKENS = {
  anchor: ["bg-emerald-100", "text-slate-900"],
  icon: ["text-emerald-700"],
};

describe("/play active styling parity between desktop sidebar and mobile drawer", () => {
  it("applies the same active styling to /play in both surfaces on the /play route", () => {
    (useRouterState as any).mockImplementation(({ select }: any) =>
      select({ location: { pathname: "/play" } }),
    );

    const desktopHtml = renderToString(<FeaturesSidebar />);
    const mobileHtml = renderToString(<NavDrawer />);

    const desktopPlay = extractPlayAnchor(desktopHtml);
    const mobilePlay = extractPlayAnchor(mobileHtml);

    expect(desktopPlay).not.toBeNull();
    expect(mobilePlay).not.toBeNull();

    for (const token of ACTIVE_TOKENS.anchor) {
      expect(hasToken(desktopPlay!.anchorClass, token)).toBe(true);
      expect(hasToken(mobilePlay!.anchorClass, token)).toBe(true);
    }

    for (const token of ACTIVE_TOKENS.icon) {
      expect(hasToken(desktopPlay!.iconClass, token)).toBe(true);
      expect(hasToken(mobilePlay!.iconClass, token)).toBe(true);
    }
  });

  it("does not apply active styling to /play in either surface on an unrelated route", () => {
    (useRouterState as any).mockImplementation(({ select }: any) =>
      select({ location: { pathname: "/dashboard" } }),
    );

    const desktopHtml = renderToString(<FeaturesSidebar />);
    const mobileHtml = renderToString(<NavDrawer />);

    const desktopPlay = extractPlayAnchor(desktopHtml);
    const mobilePlay = extractPlayAnchor(mobileHtml);

    expect(desktopPlay).not.toBeNull();
    expect(mobilePlay).not.toBeNull();

    for (const token of ACTIVE_TOKENS.anchor) {
      expect(hasToken(desktopPlay!.anchorClass, token)).toBe(false);
      expect(hasToken(mobilePlay!.anchorClass, token)).toBe(false);
    }

    for (const token of ACTIVE_TOKENS.icon) {
      expect(hasToken(desktopPlay!.iconClass, token)).toBe(false);
      expect(hasToken(mobilePlay!.iconClass, token)).toBe(false);
    }
  });
});
