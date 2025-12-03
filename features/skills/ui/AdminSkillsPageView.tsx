"use client";

import { SearchInput, Button } from "@/shared/ui";

interface AdminSkillsPageViewProps {
  heading: string;
  createButtonLabel: string;
  searchInputProps: any;
  onOpenCreateForm: () => void;
  children: React.ReactNode;
}

export function AdminSkillsPageView({ heading, createButtonLabel, searchInputProps, onOpenCreateForm, children }: AdminSkillsPageViewProps) {
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-semibold text-neutral-500 mt-1">{heading}</h1>
          <div className="w-full sm:w-[325px]">
            <SearchInput {...searchInputProps} />
          </div>
        </div>
        <div className="pr-10 pt-3">
          <Button variant="dangerGhost" size="sm" className="mt-1" onClick={onOpenCreateForm}>
            <span className="text-xl leading-none">+</span>
            {createButtonLabel}
          </Button>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
