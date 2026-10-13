import { useRef, useCallback, useEffect } from "react";

/**
 * Universal touch-first and mouse-drag horizontal scroll hook.
 * Delivers fluid touch swiping on mobile devices/tablets and smooth mouse drag-to-scroll on desktop/iframes.
 *
 * Features:
 * - Full TouchEvent handling (touchstart, touchmove, touchend, touchcancel) with passive listeners
 * - Full PointerEvent handling (pointerdown, pointermove, pointerup, pointercancel) with pointer capture for mouse/desktop
 * - Smooth flick momentum on fast swipes
 * - Smart tap/click protection: only intercepts clicks if a real drag (> 6px) occurred
 * - Temporary snap disable during active drag to eliminate resistance and rubber-banding
 * - Responsive smooth scroll button helpers
 */
export function useTouchScroll(stepAmount = 300) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      const step = stepAmount || Math.max(220, Math.round(el.clientWidth * 0.75));
      el.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    },
    [stepAmount],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isPointerDragging = false;
    let pointerStartX = 0;
    let pointerScrollStart = 0;
    let hasMoved = false;
    let pointerLastX = 0;
    let pointerLastTime = 0;
    let pointerVelocity = 0;

    // --- 1. MOUSE / DESKTOP POINTER DRAG ---
    const onPointerDown = (e: PointerEvent) => {
      // Touch events are handled separately below for full touch gesture fidelity
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return;

      isPointerDragging = true;
      hasMoved = false;
      pointerStartX = e.clientX;
      pointerLastX = e.clientX;
      pointerScrollStart = el.scrollLeft;
      pointerLastTime = performance.now();
      pointerVelocity = 0;

      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDragging || e.pointerType === "touch") return;

      const deltaX = e.clientX - pointerStartX;
      if (Math.abs(deltaX) > 16) {
        if (!hasMoved) {
          try {
            el.setPointerCapture(e.pointerId);
          } catch {
            // ignore if not supported
          }
        }
        hasMoved = true;
      }

      if (!hasMoved) return;

      const now = performance.now();
      const dt = now - pointerLastTime;
      if (dt > 12) {
        pointerVelocity = (e.clientX - pointerLastX) / dt;
        pointerLastX = e.clientX;
        pointerLastTime = now;
      }

      el.scrollLeft = pointerScrollStart - deltaX;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDragging || e.pointerType === "touch") return;
      isPointerDragging = false;

      const actualDelta = Math.abs(e.clientX - pointerStartX);
      if (actualDelta < 14) {
        hasMoved = false;
      }

      if (hasMoved) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";

      // Momentum glide on release
      if (hasMoved && Math.abs(pointerVelocity) > 0.2) {
        const momentum = pointerVelocity * 220;
        el.scrollBy({
          left: -momentum,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        hasMoved = false;
      }, 50);
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isPointerDragging = false;
      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";
      setTimeout(() => {
        hasMoved = false;
      }, 60);
    };

    // --- 2. MOBILE TOUCH EVENTS (Phones, Tablets, DevTools touch emulation) ---
    let isTouchActive = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchScrollStart = 0;
    let touchLastX = 0;
    let touchLastTime = 0;
    let touchVelocity = 0;
    let isHorizontalGesture = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];

      isTouchActive = true;
      isHorizontalGesture = false;
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchLastX = t.clientX;
      touchScrollStart = el.scrollLeft;
      touchLastTime = performance.now();
      touchVelocity = 0;

      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouchActive || e.touches.length !== 1) return;
      const t = e.touches[0];

      const deltaX = t.clientX - touchStartX;
      const deltaY = t.clientY - touchStartY;

      // Detect if user intended a horizontal swipe vs vertical page scroll
      if (!isHorizontalGesture) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 14) {
          isHorizontalGesture = true;
          hasMoved = true;
        } else if (Math.abs(deltaY) > 10) {
          // It's a vertical page scroll - don't interfere
          isTouchActive = false;
          el.style.scrollSnapType = "";
          el.style.scrollBehavior = "";
          return;
        }
      }

      if (isHorizontalGesture) {
        hasMoved = true;
        const now = performance.now();
        const dt = now - touchLastTime;
        if (dt > 12) {
          touchVelocity = (t.clientX - touchLastX) / dt;
          touchLastX = t.clientX;
          touchLastTime = now;
        }

        // Direct scroll tracking for zero lag
        el.scrollLeft = touchScrollStart - deltaX;
      }
    };

    const onTouchEnd = () => {
      if (!isTouchActive) return;
      isTouchActive = false;

      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";

      // Smooth momentum glide for flick gestures
      if (hasMoved && Math.abs(touchVelocity) > 0.25) {
        const momentum = touchVelocity * 240;
        el.scrollBy({
          left: -momentum,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        hasMoved = false;
      }, 60);
    };

    const onTouchCancel = () => {
      isTouchActive = false;
      el.style.scrollSnapType = "";
      el.style.scrollBehavior = "";
      setTimeout(() => {
        hasMoved = false;
      }, 60);
    };

    // --- 3. CLICK SHIELD (Prevents opening links/cards during swipe, but allows clean taps) ---
    const onClickCapture = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    };

    // Attach pointer listeners
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    // Attach touch listeners with passive: true so browser scrolling is never blocked
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });

    // Intercept click on the container during drag
    el.addEventListener("click", onClickCapture, { capture: true });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);

      el.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);

      el.removeEventListener("click", onClickCapture, { capture: true });
    };
  }, []);

  return { scrollRef, scroll };
}
