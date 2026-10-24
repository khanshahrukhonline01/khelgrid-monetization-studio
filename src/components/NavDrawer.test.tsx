import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { NavDrawer } from "./NavDrawer";
import { useRouterState } from "@tanstack/react-router";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
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

function findPlayAnchors(html: string): Array<{ anchorClass: string; iconClass: string }> {
  const anchorRe = /<a\b(?=[^>]*\bhref="\/play")(?=[^>]*\bclass="([^"]*)")[^>]*>(.*?)<\/a>/g;
  return [...html.matchAll(anchorRe)].map((match) => {
    const inner = match[2];
    const iconMatch = inner.match(/<svg\b[^>]*\bclass="([^"]*)"/);
    return { anchorClass: match[1], iconClass: iconMatch?.[1] ?? "" };
  });
}

function hasToken(className: string, token: string) {
  return className.trim().split(/\s+/).includes(token);
}

describe("NavDrawer /play active styling", () => {
  it("applies active styling to the /play entry on the /play route", () => {
    (useRouterState as any).mockReturnValue("/play");

    const html = renderToString(<NavDrawer />);
    const links = findPlayAnchors(html);

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(hasToken(link.anchorClass, "bg-emerald-100")).toBe(true);
      expect(hasToken(link.anchorClass, "text-slate-900")).toBe(true);
      expect(hasToken(link.iconClass, "text-emerald-700")).toBe(true);
    }
  });

  it("does not apply active styling to /play on unrelated routes", () => {
    (useRouterState as any).mockReturnValue("/dashboard");

    const html = renderToString(<NavDrawer />);
    const links = findPlayAnchors(html);

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(hasToken(link.anchorClass, "bg-emerald-100")).toBe(false);
      expect(hasToken(link.iconClass, "text-emerald-700")).toBe(false);
    }
  });
});
