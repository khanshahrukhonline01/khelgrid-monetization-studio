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

describe("NavLink aria-current", () => {
  it("renders aria-current=page for the active /play link", () => {
    const html = renderToString(<NavLink item={playItem} active source="sidebar_desktop" />);
    expect(html).toContain('aria-current="page"');
  });

  it("omits aria-current when the link is not active", () => {
    const html = renderToString(
      <NavLink item={playItem} active={false} source="sidebar_desktop" />,
    );
    expect(html).not.toContain('aria-current="page"');
  });
});

function hasToken(className: string, token: string) {
  return className.trim().split(/\s+/).includes(token);
}

describe("NavLink tap target", () => {
  it("uses mobile padding that yields at least a 48px tap target for /play", () => {
    const html = renderToString(<NavLink item={playItem} active={false} source="sidebar_mobile" />);
    const classMatch = html.match(/class="([^"]+)"/);
    expect(classMatch).toBeTruthy();
    const className = classMatch?.[1] ?? "";
    // Ensure a 48px minimum mobile tap target while keeping the desktop sidebar compact.
    expect(hasToken(className, "min-h-12")).toBe(true);
    expect(hasToken(className, "py-3.5")).toBe(true);
    expect(hasToken(className, "sm:min-h-10")).toBe(true);
    expect(hasToken(className, "sm:py-2.5")).toBe(true);
  });
});
