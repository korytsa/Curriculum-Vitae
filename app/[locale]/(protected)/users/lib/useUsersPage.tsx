import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useUsers } from "@/features/users";
import { accessTokenVar, setAccessToken } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { type TableProps, type SearchInputProps, Button } from "@/shared/ui";
import { USERS_TABLE_COLUMNS, USERS_SEARCH_FIELDS } from "../config/constants";
import type { User } from "../types";
import { UserRowActions } from "../components/UserRowActions";

interface UsersPageHookResult {
  heading: string;
  searchInputProps: SearchInputProps<User>;
  tableProps: TableProps<User>;
}

export function useUsersPage(): UsersPageHookResult {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : undefined;
  const { users, loading } = useUsers();

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const currentUserId = decodedToken?.sub?.toString() || null;

  const localePrefix = locale ? `/${locale}` : "";

  const navigateToUser = (userId: string) => {
    router.push(`${localePrefix}/users/${userId}`);
  };

  const handleLogout = () => {
    setAccessToken(null);
    window.location.href = `${localePrefix}/login`;
  };

  const handleSearchResults = (results: User[]) => {
    setFilteredUsers(results);
  };

  const handleResetSearch = () => {
    setSearchResetKey((prev) => prev + 1);
    setFilteredUsers(users);
    setSearchQuery("");
  };

  const isSearchActive = searchQuery.trim().length > 0;

  const sortedUsers = (() => {
    if (!currentUserId) return filteredUsers;

    const currentUser = filteredUsers.find((user) => user.id === currentUserId);
    if (!currentUser) return filteredUsers;

    const otherUsers = filteredUsers.filter(
      (user) => user.id !== currentUserId
    );

    return [currentUser, ...otherUsers];
  })();

  const emptyState = !isSearchActive ? (
    <div className="py-5 text-center flex justify-center items-center">
      <Button variant="outline" className="px-10" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  ) : (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 py-20 text-center">
      <h3 className="text-xl text-white">No results found</h3>
      <p>Try another search, check the spelling or use a broader term</p>
      <button
        type="button"
        className="mt-2 rounded-full px-10 py-3 text-sm font-medium uppercase tracking-wide text-neutral-500 transition-colors hover:bg-[#454545]"
        onClick={handleResetSearch}
      >
        Reset search
      </button>
    </div>
  );

  const renderRowActions = (row: User) => (
    <UserRowActions
      row={row}
      currentUserId={currentUserId}
      onNavigate={navigateToUser}
    />
  );

  const searchInputProps: SearchInputProps<User> = {
    data: users as User[],
    fields: [...USERS_SEARCH_FIELDS],
    onResults: handleSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: isSearchActive && sortedUsers.length === 0,
    placeholder: "Search",
  };

  const tableProps: TableProps<User> = {
    data: sortedUsers as User[],
    columns: USERS_TABLE_COLUMNS,
    loading,
    keyExtractor: (row: User) => row.id,
    renderActions: renderRowActions,
    emptyState,
  };

  return {
    heading: t("users.heading") || "Employees",
    searchInputProps,
    tableProps,
  };
}
