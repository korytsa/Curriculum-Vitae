export type UserProfile = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
};

export type DirectoryInfo = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  created_at?: string;
  department_name?: string | null;
  position_name?: string | null;
  department?: DirectoryInfo | null;
  position?: DirectoryInfo | null;
  profile: UserProfile;
};
