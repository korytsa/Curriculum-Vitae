import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

export const useLocale = (): string => {
	const pathname = usePathname();
	return pathname?.split("/")[1] || "en";
};

export const createRipple = (
	element: HTMLElement,
	event: React.MouseEvent<HTMLElement>
): NodeJS.Timeout => {
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

export const scrollToTab = (
	container: HTMLDivElement,
	tabElement: HTMLElement
): void => {
	const containerRect = container.getBoundingClientRect();
	const tabRect = tabElement.getBoundingClientRect();
	const scrollLeft = container.scrollLeft;
	const targetScroll =
		scrollLeft +
		tabRect.left -
		containerRect.left -
		containerRect.width / 2 +
		tabRect.width / 2;

	container.scrollTo({
		left: targetScroll,
		behavior: "smooth",
	});
};

// Select component utilities
export interface SelectOption {
	value: string;
	label: string;
}

export const findSelectedOption = (options: SelectOption[], value?: string): SelectOption | undefined => {
	return options.find((opt) => opt.value === value);
};

export const isNoPositionValue = (value?: string, selectedOption?: SelectOption): boolean => {
	if (!value) return true;
	if (!selectedOption) return false;
	
	const lowerLabel = selectedOption.label.toLowerCase();
	return lowerLabel === "no position" || lowerLabel.includes("no position");
};

export const getDisplayValue = (selectedOption?: SelectOption, isNoPositionValue?: boolean): string => {
	return selectedOption && !isNoPositionValue ? selectedOption.label : "";
};

export const hasValue = (value?: string, selectedOption?: SelectOption, isNoPositionValue?: boolean): boolean => {
	return Boolean(value && selectedOption && !isNoPositionValue);
};

export const isLabelActive = (isFocused: boolean, hasValue: boolean, isOpen: boolean): boolean => {
	return isFocused || hasValue || isOpen;
};

export const isActive = (isFocused: boolean, isOpen: boolean): boolean => {
	return isFocused || isOpen;
};

export const getLabelColor = (error?: string, isActive?: boolean): string => {
	return error || isActive ? "text-red-500" : "text-[#C7C7C7]";
};

export const getBorderColor = (error?: string, isActive?: boolean): string => {
	return error || isActive ? "border-red-500" : "border-[#656565] hover:border-white/80";
};

export const createCloseSelectHandler = (
	setIsOpen: (value: boolean) => void,
	setIsFocused: (value: boolean) => void,
) => {
	return () => {
		setIsOpen(false);
		setIsFocused(false);
	};
};

export const createClickOutsideHandler = (
	selectRef: { current: HTMLDivElement | null },
	dropdownRef: { current: HTMLDivElement | null },
	closeSelect: () => void,
) => {
	return (event: MouseEvent) => {
		const target = event.target as Node;
		if (
			selectRef.current?.contains(target) ||
			dropdownRef.current?.contains(target)
		) {
			return;
		}
		closeSelect();
	};
};

export const createKeyDownHandler = (closeSelect: () => void) => {
	return (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			closeSelect();
		}
	};
};

