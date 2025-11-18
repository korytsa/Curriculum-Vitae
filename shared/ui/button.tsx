/**
 * Button Component
 *
 * Features:
 * - Multiple variants: primary, secondary, outline, ghost, danger, dangerGhost
 * - Multiple sizes: default, sm, icon
 * - Icon support with left/right positioning
 * - Badge display for notifications or counts
 * - Extends all standard HTML button attributes
 *
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="default"
 *   onClick={() => handleClick()}
 * >
 *   Click Me
 * </Button>
 * ```
 */

import * as React from "react";
import { cn } from "@/shared/lib";

const baseClasses =
	"inline-flex items-center justify-center gap-2 rounded-full border font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses = {
	primary: "border-transparent bg-red-600 text-white hover:bg-red-500 disabled:bg-red-600/50 disabled:text-white/70",
	secondary: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80 disabled:bg-muted/60",
	outline:
		"border-[#505050] bg-[#2F2F2F] text-[#C7C7C7] hover:bg-[#3A3A3A] hover:text-white disabled:bg-[#2F2F2F]/60 disabled:text-[#7A7A7A] disabled:border-[#3F3F3F]",
	ghost: "border-transparent text-[#A8A8A8] hover:text-[#E0E0E0] hover:bg-[#3A3A3A]/60 disabled:text-[#666666]",
	danger: "border-transparent bg-red-600 text-white hover:bg-red-500 disabled:bg-red-600/50",
	dangerGhost: "border-transparent text-red-500 hover:text-red-400 hover:bg-red-500/10 disabled:text-red-500/40",
};

const sizeClasses = {
  sm: 'h-10 px-6 text-xs',
  md: 'h-11 px-7 text-sm',
  default: 'h-12 px-8 text-sm',
  lg: 'h-14 px-10 text-base',
  icon: 'h-10 w-10 p-0',
}

function getButtonClasses(variant?: keyof typeof variantClasses, size?: keyof typeof sizeClasses, className?: string) {
	const variantClass = variant ? variantClasses[variant] : variantClasses.primary;
	const sizeClass = size ? sizeClasses[size] : sizeClasses.default;
	return cn(baseClasses, variantClass, sizeClass, className);
}

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	badge?: number | string;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
}

export type ButtonConfig = Pick<ButtonProps, "variant" | "size" | "disabled" | "icon" | "iconPosition" | "badge">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, badge, icon, iconPosition = "left", children, ...props }, ref) => {
	const hasOnlyIcon = icon && (!children || children === "") && badge === undefined;

	return (
		<button ref={ref} className={getButtonClasses(variant, size, className)} {...props}>
			{hasOnlyIcon ? (
				<span className="inline-flex items-center justify-center text-current">{icon}</span>
			) : (
				<span className="flex items-center gap-2">
					{icon && iconPosition === "left" ? <span className="inline-flex items-center text-current">{icon}</span> : null}
					<span>{children}</span>
					{icon && iconPosition === "right" ? <span className="inline-flex items-center text-current">{icon}</span> : null}
					{badge !== undefined ? (
						<span className="ml-1 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-white/90 px-1 text-[10px] font-bold text-red-600">
							{badge}
						</span>
					) : null}
				</span>
			)}
		</button>
	);
});
Button.displayName = "Button";

export { Button };
