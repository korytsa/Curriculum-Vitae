import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import { useEffect, useState, useRef, forwardRef, useId, type HTMLAttributes } from "react";
import {
	findSelectedOption,
	isNoPositionValue as checkIsNoPositionValue,
	getDisplayValue,
	hasValue as checkHasValue,
	isLabelActive,
	isActive,
	getLabelColor,
	getBorderColor,
	createCloseSelectHandler,
	createClickOutsideHandler,
	createKeyDownHandler,
	type SelectOption,
} from "./utils";

export type { SelectOption };

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	options: SelectOption[];
	value?: string;
	onChange?: (value: string) => void;
	error?: string;
	label?: string;
	disabled?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
	({ className, options, value, onChange, error, label, disabled, ...props }, ref) => {
		const [isOpen, setIsOpen] = useState(false);
		const [isFocused, setIsFocused] = useState(false);
		const selectRef = useRef<HTMLDivElement>(null);
		const dropdownRef = useRef<HTMLDivElement>(null);
		const listboxId = useId();

		const selectedOption = findSelectedOption(options, value);
		const isNoPosition = checkIsNoPositionValue(value, selectedOption);
		const displayValue = getDisplayValue(selectedOption, isNoPosition);
		const hasValue = checkHasValue(value, selectedOption, isNoPosition);
		const isLabelActiveState = isLabelActive(isFocused, hasValue, isOpen);
		const isActiveState = isActive(isFocused, isOpen);

		const labelColor = getLabelColor(error, isActiveState);
		const borderColor = getBorderColor(error, isActiveState);

		useEffect(() => {
			if (!isOpen) return;

			const closeSelect = createCloseSelectHandler(setIsOpen, setIsFocused);
			const handleClickOutside = createClickOutsideHandler(selectRef, dropdownRef, closeSelect);
			const handleKeyDown = createKeyDownHandler(closeSelect);

			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleKeyDown);

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
				document.removeEventListener("keydown", handleKeyDown);
			};
		}, [isOpen]);

		const handleSelect = (optionValue: string) => {
			onChange?.(optionValue);
			const closeSelect = createCloseSelectHandler(setIsOpen, setIsFocused);
			closeSelect();
		};

		const handleToggle = () => {
			if (disabled) return;
			const newIsOpen = !isOpen;
			setIsOpen(newIsOpen);
			setIsFocused(newIsOpen);
		};

		return (
			<div className={cn("relative select-none", className)} ref={ref} {...props}>
				<div className="relative" ref={selectRef}>
					<div
						className={cn(
							"w-full h-12 rounded-md border bg-transparent px-3 py-3 text-[#C7C7C7] transition-all cursor-pointer",
							"focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
							"flex items-center justify-between",
							borderColor,
							disabled && "opacity-50 cursor-not-allowed",
						)}
						onClick={handleToggle}
						onFocus={() => setIsFocused(true)}
						onBlur={() => {
							if (!isOpen) {
								setIsFocused(false);
							}
						}}
						tabIndex={disabled ? -1 : 0}
						role="combobox"
						aria-expanded={isOpen}
						aria-controls={listboxId}
						aria-haspopup="listbox"
						aria-disabled={disabled}
					>
						<span className={cn("flex-1 text-left text-[#C7C7C7]")}>
							{displayValue}
						</span>
						<ChevronDown
							className={cn(
								"h-4 w-4 text-white transition-transform duration-200 flex-shrink-0",
								isOpen && "transform rotate-180",
							)}
						/>
					</div>

					{label && (
						<label
							className={cn(
								"absolute left-3 transition-all duration-200 pointer-events-none px-2 z-10",
								isLabelActiveState ? "top-0 -translate-y-1/2 text-xs bg-[#353535]" : "top-1/2 -translate-y-1/2 text-sm",
								labelColor,
							)}
						>
							{label}
						</label>
					)}

					{isOpen && (
						<div
							ref={dropdownRef}
							id={listboxId}
							className="absolute z-50 w-full mt-1 bg-[#2F2F2F] border-none shadow-lg max-h-80 overflow-auto [&::-webkit-scrollbar]:hidden"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
							role="listbox"
						>
							{options.map((option) => {
								const isSelected = option.value === value;

								return (
									<div
										key={option.value}
										className={cn(
											"px-3 py-2 cursor-pointer transition-colors",
											isSelected 
												? "bg-[#652727] text-white" 
												: "text-[#C7C7C7] hover:bg-[#3e3e3e] hover:text-white",
										)}
										onClick={() => handleSelect(option.value)}
										role="option"
										aria-selected={isSelected}
									>
										{option.label}
									</div>
								);
							})}
						</div>
					)}
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
			</div>
		);
	},
);

Select.displayName = "Select";

export { Select };

