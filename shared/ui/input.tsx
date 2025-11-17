import * as React from "react";
import { cn } from "@/shared/lib";
import { Button } from "./button";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
	label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", placeholder, error, value, label, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
	const [isFocused, setIsFocused] = React.useState(false);
	const isPassword = type === "password";
	const hasValue = Boolean(value);
	const isLabelActive = isFocused || hasValue;
	const inputType = isPassword ? (showPassword ? "text" : "password") : type;
	const labelColor = error ? "text-red-500" : isFocused ? "text-red-500" : "text-[#C7C7C7]";
	const borderColor = error ? "border-red-500" : isFocused ? "border-red-500" : "border-[#656565]";
  const baseClasses =
    "w-full rounded-md border bg-transparent px-3 py-3 text-[#C7C7C7] placeholder:font-medium transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

	const inputElement = (
		<div className="relative">
			<input
				type={inputType}
				className={cn(
					baseClasses,
					borderColor,
					isPassword && "pr-10",
					label && isLabelActive ? "placeholder:text-[#bdbdbd]" : label ? "placeholder:text-transparent" : "placeholder:text-[#c4c4c4]",
					className,
				)}
				ref={ref}
				placeholder={placeholder}
				value={value}
				onFocus={(e) => {
					setIsFocused(true);
					props.onFocus?.(e);
				}}
				onBlur={(e) => {
					setIsFocused(false);
					props.onBlur?.(e);
				}}
				{...props}
			/>
			{label && (
				<label
					className={cn(
						"absolute left-3 transition-all duration-200 pointer-events-none px-1",
						isLabelActive ? "top-0 -translate-y-1/2 text-xs bg-[#353535]" : "top-1/2 -translate-y-1/2 text-sm",
						labelColor,
					)}
				>
					{label}
				</label>
			)}
			{isPassword && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-1 top-1/2 -translate-y-1/2 text-white hover:text-white/80 z-10"
					aria-label={showPassword ? "Hide password" : "Show password"}
					icon={showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
				/>
			)}
		</div>
	);

	return (
		<div className="space-y-1.5">
			{inputElement}
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
});
Input.displayName = "Input";

export { Input };
