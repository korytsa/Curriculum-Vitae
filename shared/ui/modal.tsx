"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib";
import { IoClose } from "react-icons/io5";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      primaryAction,
      secondaryAction,
      className,
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    if (!isMounted) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const modalContent = (
      <div
        className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
          "transition-opacity duration-200"
        )}
      >
        <div
          onClick={handleBackdropClick}
          className={cn(
            "absolute inset-0 bg-[#1F1F1F]/80",
            open ? "opacity-100" : "opacity-0",
            "transition-opacity duration-200"
          )}
        />

        <div
          ref={ref}
          className={cn(
            "relative z-10 w-full max-w-xl mx-4 bg-[#353535] rounded-lg shadow-xl overflow-hidden",
            "transform transition-all duration-200",
            open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#C7C7C7] hover:text-white hover:bg-[#3A3A3A] transition-colors"
              aria-label="Close modal"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-6">{children}</div>

          {(primaryAction || secondaryAction) && (
            <div className="flex items-center justify-end gap-4 px-6 pb-6 border-t border-white/10 pt-4">
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                  className="px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white/70 bg-[#2F2F2F] border border-white/20 rounded-lg hover:bg-[#3A3A3A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {secondaryAction.label}
                </button>
              )}
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  className="px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {primaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";

export { Modal };
