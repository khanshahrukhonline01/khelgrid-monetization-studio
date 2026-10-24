import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { NavLink } from "./NavLink";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, "aria-current": ariaCurrent, ...props }: any) => (
    <a href={to} aria-current={ariaCurrent} {...props}>
      {children}
    </a>
  ),
}));

const MockIcon = ({ className }: { className?: string }) => <svg className={className} />;

const playItem = {
  to: "/play",
  label: "Play · Find games",
  icon: MockIcon,
  surfaces: ["primary", "features"] as Array<"primary" | "features">,
};

function classesOf(source: "sidebar_desktop" | "sidebar_mobile", active: boolean) {
  const html = renderToString(<NavLink item={playItem} active={active} source={source} />);
  const className = html.match(/class="([^"]+)"/)?.[1] ?? "";
  return className.trim().split(/\s+/);
}

const FOCUS_TOKENS = [
  "outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",
];

describe("NavLink focus-visible + hover parity", () => {
  it("exposes the same focus-visible styles on desktop and mobile", () => {
    const desktop = classesOf("sidebar_desktop", false);
    const mobile = classesOf("sidebar_mobile", false);
    for (const token of FOCUS_TOKENS) {
      expect(desktop).toContain(token);
      expect(mobile).toContain(token);
    }
  });

  it("applies identical hover styles for the inactive /play link on both surfaces", () => {
    const desktop = classesOf("sidebar_desktop", false);
    const mobile = classesOf("sidebar_mobile", false);
    expect(desktop).toContain("hover:bg-emerald-50");
    expect(desktop).toContain("hover:text-slate-950");
    expect(mobile.filter((c) => c.startsWith("hover:"))).toEqual(
      desktop.filter((c) => c.startsWith("hover:")),
    );
  });

  it("keeps focus-visible styles when /play is the active route", () => {
    const active = classesOf("sidebar_mobile", true);
    for (const token of FOCUS_TOKENS) {
      expect(active).toContain(token);
    }
    expect(active).toContain("hover:bg-emerald-100");
  });
});
