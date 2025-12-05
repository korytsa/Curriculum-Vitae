"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

export const useLocale = (): string => {
  const pathname = usePathname();
  return pathname?.split("/")[1] || "en";
};

export const createRipple = (element: HTMLElement, event: React.MouseEvent<HTMLElement>): NodeJS.Timeout => {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.style.cssText = `
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple-animation 900ms cubic-bezier(0.4, 0, 0.2, 1);
		background-color: rgba(220, 38, 38, 0.3);
		pointer-events: none;
		width: ${size}px;
		height: ${size}px;
		left: ${x}px;
		top: ${y}px;
	`;

  element.appendChild(ripple);

  return setTimeout(() => {
    ripple.remove();
  }, 900);
};

export const useRippleCleanup = () => {
  const rippleTimeoutsRef = useRef<Map<string, Set<NodeJS.Timeout>>>(new Map());

  useEffect(() => {
    const timeoutsMap = rippleTimeoutsRef.current;
    return () => {
      timeoutsMap.forEach((timeouts) => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      });
      timeoutsMap.clear();
    };
  }, []);

  const addRippleTimeout = (id: string, timeoutId: NodeJS.Timeout) => {
    if (!rippleTimeoutsRef.current.has(id)) {
      rippleTimeoutsRef.current.set(id, new Set());
    }
    rippleTimeoutsRef.current.get(id)!.add(timeoutId);

    setTimeout(() => {
      const timeouts = rippleTimeoutsRef.current.get(id);
      if (timeouts) {
        timeouts.delete(timeoutId);
        if (timeouts.size === 0) {
          rippleTimeoutsRef.current.delete(id);
        }
      }
    }, 900);
  };

  return { addRippleTimeout };
};

export const scrollToTab = (container: HTMLDivElement, tabElement: HTMLElement): void => {
  const containerRect = container.getBoundingClientRect();
  const tabRect = tabElement.getBoundingClientRect();
  const scrollLeft = container.scrollLeft;
  const targetScroll = scrollLeft + tabRect.left - containerRect.left - containerRect.width / 2 + tabRect.width / 2;

  container.scrollTo({
    left: targetScroll,
    behavior: "smooth",
  });
};
