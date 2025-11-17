"use client";

import * as React from "react";
import { cn } from "@/shared/lib";
import { IoClose } from "react-icons/io5";
import { Button } from "./button";

export interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	primaryAction?: {
		label: string;
		onClick: () => void;
		disabled?: boolean;
		variant?: "primary" | "danger";
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
		disabled?: boolean;
	};
	className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({ open, onClose, title, children, primaryAction, secondaryAction, className }, ref) => {
	const [isMounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		if (open) {
			setIsMounted(true);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	if (!open && !isMounted) return null;

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className={cn(
				"fixed inset-0 z-[9999] flex items-center justify-center",
				open ? "opacity-100" : "opacity-0 pointer-events-none",
				"transition-opacity duration-200",
			)}
			onClick={handleBackdropClick}
		>
			<div onClick={handleBackdropClick} className="absolute inset-0 bg-black/40" />

			<div
				ref={ref}
				className={cn(
					"relative z-10 w-full sm:max-w-[600px] mx-4 bg-[#2F2F2F] rounded-lg shadow-xl overflow-hidden p-5 pb-2",
					"transform transition-all duration-200",
					open ? "scale-100" : "scale-95",
					className,
				)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-white">{title}</h2>
					<button
						onClick={onClose}
						className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#C7C7C7] hover:text-white hover:bg-[#3A3A3A] transition-colors"
						aria-label="Close modal"
					>
						<IoClose className="w-6 h-6" />
					</button>
				</div>

				<div className="mt-8 mb-6">{children}</div>

				{(primaryAction || secondaryAction) && (
					<div className="flex items-center justify-end gap-4">
						{secondaryAction && (
							<Button onClick={secondaryAction.onClick} disabled={secondaryAction.disabled} variant="outline">
								{secondaryAction.label}
							</Button>
						)}
						{primaryAction && (
							<Button onClick={primaryAction.onClick} disabled={primaryAction.disabled} variant={primaryAction.variant === "danger" ? "danger" : "primary"}>
								{primaryAction.label}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

Modal.displayName = "Modal";

export { Modal };
