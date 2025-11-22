import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib";
import {
  useLocale,
  useRippleCleanup,
  createRipple,
  scrollToTab,
} from "./utils";

export interface TabItem {
  id: string;
  label: string;
  href?: string;
}

export interface TabsProps {
  items: TabItem[];
  activeTabId?: string;
  defaultActiveTabId?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs = ({
  items,
  activeTabId,
  defaultActiveTabId,
  className,
  onTabChange,
}: TabsProps) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    activeTabId || defaultActiveTabId || items[0]?.id || ""
  );
  const locale = useLocale();
  const router = useRouter();
  const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const { addRippleTimeout } = useRippleCleanup();

  const currentActiveId = activeTabId ?? internalActiveId;

  const handleTabClick = (
    item: TabItem,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (item.href && item.href !== "#") {
      event.preventDefault();
    } else if (!item.href || item.href === "#") {
      event.preventDefault();
    }

    const timeoutId = createRipple(event.currentTarget, event);
    addRippleTimeout(item.id, timeoutId);

    if (activeTabId === undefined) {
      setInternalActiveId(item.id);
    }
    onTabChange?.(item.id);

    const tabElement = tabRefs.current.get(item.id);
    if (containerRef.current && tabElement) {
      scrollToTab(containerRef.current, tabElement);
    }

    if (item.href && item.href !== "#") {
      setTimeout(() => {
        router.push(`/${locale}${item.href}`);
      }, 300);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex overflow-x-auto", className)}
    >
      {items.map((item) => {
        const isActive = currentActiveId === item.id;
        return (
          <Link
            key={item.id}
            href={`/${locale}${item.href || "#"}`}
            ref={(el) => {
              if (el) tabRefs.current.set(item.id, el);
            }}
            className={cn(
              "relative h-[50px] w-[155px] overflow-hidden inline-flex items-center justify-center px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2",
              isActive ? "text-red-600" : "text-white"
            )}
            onClick={(e) => handleTabClick(item, e)}
          >
            {item.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-red-600 transition-all duration-300 ease-in-out" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

Tabs.displayName = "Tabs";

export { Tabs };
