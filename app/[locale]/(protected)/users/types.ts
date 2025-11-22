export type UserProfile = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
};

export type User = {
  id: string;
  email: string;
  department_name?: string | null;
  position_name?: string | null;
  profile: UserProfile;
};
