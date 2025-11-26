"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, forwardRef } from "react";
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
    variant?:
      | "primary"
      | "secondary"
      | "outline"
      | "ghost"
      | "danger"
      | "dangerGhost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
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
            "absolute inset-0 bg-black/50",
            open ? "opacity-100" : "opacity-0",
            "transition-opacity duration-200"
          )}
        />

        <div
          ref={ref}
          className={cn(
            "relative z-10 w-full max-w-xl mx-4 bg-[var(--color-surface)] rounded-[5px] shadow-xl overflow-hidden",
            "transform transition-all duration-200",
            open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 pt-4 mb-8">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              aria-label="Close modal"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-6">{children}</div>

          {(primaryAction || secondaryAction) && (
            <div className="flex items-center justify-end gap-4 px-3 pb-3">
              {secondaryAction && (
                <Button
                  variant="outline"
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                  className="w-[200px] font-normal"
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button
                  type="submit"
                  variant={primaryAction.variant ?? "danger"}
                  onClick={primaryAction.onClick}
                  className="w-[200px] font-normal"
                  disabled={primaryAction.disabled}
                >
                  {primaryAction.label}
                </Button>
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
