"use client";

import { Table, SearchInput } from "@/shared/ui";
import { useUsersPage } from "./lib/useUsersPage";

export default function UsersPage() {
  const { heading, searchInputProps, tableProps } = useUsersPage();

  return (
    <section>
      <div className="space-y-3">
        <h1 className="font-semibold text-neutral-500 mt-1">{heading}</h1>
        <div className="w-full sm:w-[325px]">
          <SearchInput {...searchInputProps} />
        </div>
      </div>
      <div className="mt-4">
        <Table {...tableProps} />
      </div>
    </section>
  );
}
