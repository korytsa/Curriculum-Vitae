import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useUsers } from "@/features/users";
import { accessTokenVar, setAccessToken } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { type TableProps, type SearchInputProps, Button } from "@/shared/ui";
import { USERS_SEARCH_FIELDS, getUsersTableColumns } from "../config/constants";
import type { User } from "../types";
import { UserRowActions } from "../components/UserRowActions";

interface UsersPageHookResult {
  heading: string;
  searchInputProps: SearchInputProps<User>;
  tableProps: TableProps<User>;
  canCreateUser: boolean;
  createUserLabel: string;
  refreshUsers: () => Promise<void>;
}

export function useUsersPage(): UsersPageHookResult {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : undefined;
  const { users, loading, refetch } = useUsers();
  const columns = getUsersTableColumns(t);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const currentUserId = decodedToken?.sub?.toString() || null;
  const isAdmin = decodedToken?.role === "Admin";

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

    const otherUsers = filteredUsers.filter((user) => user.id !== currentUserId);

    return [currentUser, ...otherUsers];
  })();

  const translate = (key: string) => t(key);

  const searchText = {
    placeholder: translate("users.search.placeholder"),
    reset: translate("users.search.reset"),
    noResultsTitle: translate("users.search.noResults.title"),
    noResultsDescription: translate("users.search.noResults.description"),
    logout: translate("users.search.logout"),
  };

  const emptyState = !isSearchActive ? (
    <div className="py-5 text-center flex justify-center items-center">
      <Button variant="outline" className="px-10" onClick={handleLogout}>
        {searchText.logout}
      </Button>
    </div>
  ) : (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 py-20 text-center">
      <h3 className="text-xl text-white">{searchText.noResultsTitle}</h3>
      <p className="text-white/70">{searchText.noResultsDescription}</p>
      <button
        type="button"
        className="mt-2 rounded-full px-10 py-3 text-sm font-medium uppercase tracking-wide text-neutral-500 transition-colors hover:bg-[#454545]"
        onClick={handleResetSearch}
      >
        {searchText.reset}
      </button>
    </div>
  );

  const refreshUsers = async () => {
    await refetch();
  };

  const renderRowActions = (row: User) => <UserRowActions row={row} currentUserId={currentUserId} onNavigate={navigateToUser} isAdmin={isAdmin} onDeleted={refreshUsers} />;

  const searchInputProps: SearchInputProps<User> = {
    data: users as User[],
    fields: [...USERS_SEARCH_FIELDS],
    onResults: handleSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: isSearchActive && sortedUsers.length === 0,
    placeholder: searchText.placeholder,
  };

  const tableProps: TableProps<User> = {
    data: sortedUsers as User[],
    columns,
    loading,
    keyExtractor: (row: User) => row.id,
    renderActions: renderRowActions,
    emptyState,
  };

  return {
    heading: translate("users.heading"),
    searchInputProps,
    tableProps,
    canCreateUser: isAdmin,
    createUserLabel: t("users.createUser"),
    refreshUsers,
  };
}
