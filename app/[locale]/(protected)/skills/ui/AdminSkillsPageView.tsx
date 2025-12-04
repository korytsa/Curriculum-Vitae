"use client";

import { SearchInput, Button, Table } from "@/shared/ui";
import { Plus } from "lucide-react";
import type { AdminSkillsPageViewProps } from "./types";

export function AdminSkillsPageView({ heading, createButtonLabel, searchInputProps, onOpenCreateForm, tableProps }: AdminSkillsPageViewProps) {
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-semibold text-neutral-500 mt-1">{heading}</h1>
          <div className="w-full sm:w-[325px]">
            <SearchInput {...searchInputProps} />
          </div>
        </div>
        <div className="pr-10 mt-8">
          <Button type="button" variant="dangerText" icon={<Plus className="h-5 w-5" />} iconPosition="left" onClick={onOpenCreateForm}>
            {createButtonLabel}
          </Button>
        </div>
      </div>
      <Table {...tableProps} />
    </section>
  );
}
