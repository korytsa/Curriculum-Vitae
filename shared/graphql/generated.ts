export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Void: { input: any; output: any; }
};

export type AddCvProjectInput = {
  cvId: Scalars['ID']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  responsibilities: Array<Scalars['String']['input']>;
  roles: Array<Scalars['String']['input']>;
  start_date: Scalars['String']['input'];
};

export type AddCvSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  cvId: Scalars['ID']['input'];
  mastery: Mastery;
  name: Scalars['String']['input'];
};

export type AddProfileLanguageInput = {
  name: Scalars['String']['input'];
  proficiency: Proficiency;
  userId: Scalars['ID']['input'];
};

export type AddProfileSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  mastery: Mastery;
  name: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type AuthInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AuthResult = {
  __typename: 'AuthResult';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
  user: User;
};

export type CreateCvInput = {
  description: Scalars['String']['input'];
  education?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateDepartmentInput = {
  name: Scalars['String']['input'];
};

export type CreateLanguageInput = {
  iso2: Scalars['String']['input'];
  name: Scalars['String']['input'];
  native_name?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePositionInput = {
  name: Scalars['String']['input'];
};

export type CreateProfileInput = {
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  description: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  environment: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  start_date: Scalars['String']['input'];
};

export type CreateSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  auth: AuthInput;
  cvsIds: Array<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  positionId?: InputMaybe<Scalars['ID']['input']>;
  profile: CreateProfileInput;
  role: UserRole;
};

export type Cv = {
  __typename: 'Cv';
  created_at: Scalars['String']['output'];
  description: Scalars['String']['output'];
  education?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  languages: Array<LanguageProficiency>;
  name: Scalars['String']['output'];
  projects?: Maybe<Array<CvProject>>;
  skills: Array<SkillMastery>;
  user?: Maybe<User>;
};

export type CvProject = {
  __typename: 'CvProject';
  description: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  end_date?: Maybe<Scalars['String']['output']>;
  environment: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internal_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
  project: Project;
  responsibilities: Array<Scalars['String']['output']>;
  roles: Array<Scalars['String']['output']>;
  start_date: Scalars['String']['output'];
};

export type DeleteAvatarInput = {
  userId: Scalars['ID']['input'];
};

export type DeleteCvInput = {
  cvId: Scalars['ID']['input'];
};

export type DeleteCvSkillInput = {
  cvId: Scalars['ID']['input'];
  name: Array<Scalars['String']['input']>;
};

export type DeleteDepartmentInput = {
  departmentId: Scalars['ID']['input'];
};

export type DeleteLanguageInput = {
  languageId: Scalars['ID']['input'];
};

export type DeletePositionInput = {
  positionId: Scalars['ID']['input'];
};

export type DeleteProfileInput = {
  userId: Scalars['ID']['input'];
};

export type DeleteProfileLanguageInput = {
  name: Array<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type DeleteProfileSkillInput = {
  name: Array<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type DeleteProjectInput = {
  projectId: Scalars['ID']['input'];
};

export type DeleteResult = {
  __typename: 'DeleteResult';
  affected: Scalars['Int']['output'];
};

export type DeleteSkillInput = {
  skillId: Scalars['ID']['input'];
};

export type Department = {
  __typename: 'Department';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ExportPdfInput = {
  html: Scalars['String']['input'];
  margin?: InputMaybe<MarginInput>;
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type Language = {
  __typename: 'Language';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  name: Scalars['String']['output'];
  native_name?: Maybe<Scalars['String']['output']>;
};

export type LanguageProficiency = {
  __typename: 'LanguageProficiency';
  name: Scalars['String']['output'];
  proficiency: Proficiency;
};

export type LanguageProficiencyInput = {
  name: Scalars['String']['input'];
  proficiency: Proficiency;
};

export type Mail = {
  __typename: 'Mail';
  created_at: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  otp: Scalars['String']['output'];
};

export type MarginInput = {
  bottom: Scalars['String']['input'];
  left: Scalars['String']['input'];
  right: Scalars['String']['input'];
  top: Scalars['String']['input'];
};

export type Mastery =
  | 'Advanced'
  | 'Competent'
  | 'Expert'
  | 'Novice'
  | 'Proficient';

export type Mutation = {
  __typename: 'Mutation';
  addCvProject: Cv;
  addCvSkill: Cv;
  addProfileLanguage: Profile;
  addProfileSkill: Profile;
  createCv: Cv;
  createDepartment: Department;
  createLanguage: Language;
  createPosition: Position;
  createProject: Project;
  createSkill: Skill;
  createUser: User;
  deleteAvatar?: Maybe<Scalars['Void']['output']>;
  deleteCv: DeleteResult;
  deleteCvSkill: Cv;
  deleteDepartment: DeleteResult;
  deleteLanguage: DeleteResult;
  deletePosition: DeleteResult;
  deleteProfileLanguage: Profile;
  deleteProfileSkill: Profile;
  deleteProject: DeleteResult;
  deleteSkill: DeleteResult;
  deleteUser: DeleteResult;
  exportPdf: Scalars['String']['output'];
  forgotPassword?: Maybe<Scalars['Void']['output']>;
  removeCvProject: Cv;
  resetPassword?: Maybe<Scalars['Void']['output']>;
  signup: AuthResult;
  updateCv: Cv;
  updateCvProject: Cv;
  updateCvSkill: Cv;
  updateDepartment: Department;
  updateLanguage: Language;
  updatePosition: Position;
  updateProfile: Profile;
  updateProfileLanguage: Profile;
  updateProfileSkill: Profile;
  updateProject: Project;
  updateSkill: Skill;
  updateToken: UpdateTokenResult;
  updateUser: User;
  uploadAvatar: Scalars['String']['output'];
  verifyMail?: Maybe<Scalars['Void']['output']>;
};


export type MutationAddCvProjectArgs = {
  project: AddCvProjectInput;
};


export type MutationAddCvSkillArgs = {
  skill: AddCvSkillInput;
};


export type MutationAddProfileLanguageArgs = {
  language: AddProfileLanguageInput;
};


export type MutationAddProfileSkillArgs = {
  skill: AddProfileSkillInput;
};


export type MutationCreateCvArgs = {
  cv: CreateCvInput;
};


export type MutationCreateDepartmentArgs = {
  department: CreateDepartmentInput;
};


export type MutationCreateLanguageArgs = {
  language: CreateLanguageInput;
};


export type MutationCreatePositionArgs = {
  position: CreatePositionInput;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateSkillArgs = {
  skill: CreateSkillInput;
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationDeleteAvatarArgs = {
  avatar: DeleteAvatarInput;
};


export type MutationDeleteCvArgs = {
  cv: DeleteCvInput;
};


export type MutationDeleteCvSkillArgs = {
  skill: DeleteCvSkillInput;
};


export type MutationDeleteDepartmentArgs = {
  department: DeleteDepartmentInput;
};


export type MutationDeleteLanguageArgs = {
  language: DeleteLanguageInput;
};


export type MutationDeletePositionArgs = {
  position: DeletePositionInput;
};


export type MutationDeleteProfileLanguageArgs = {
  language: DeleteProfileLanguageInput;
};


export type MutationDeleteProfileSkillArgs = {
  skill: DeleteProfileSkillInput;
};


export type MutationDeleteProjectArgs = {
  project: DeleteProjectInput;
};


export type MutationDeleteSkillArgs = {
  skill: DeleteSkillInput;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationExportPdfArgs = {
  pdf: ExportPdfInput;
};


export type MutationForgotPasswordArgs = {
  auth: ForgotPasswordInput;
};


export type MutationRemoveCvProjectArgs = {
  project: RemoveCvProjectInput;
};


export type MutationResetPasswordArgs = {
  auth: ResetPasswordInput;
};


export type MutationSignupArgs = {
  auth: AuthInput;
};


export type MutationUpdateCvArgs = {
  cv: UpdateCvInput;
};


export type MutationUpdateCvProjectArgs = {
  project: UpdateCvProjectInput;
};


export type MutationUpdateCvSkillArgs = {
  skill: UpdateCvSkillInput;
};


export type MutationUpdateDepartmentArgs = {
  department: UpdateDepartmentInput;
};


export type MutationUpdateLanguageArgs = {
  language: UpdateLanguageInput;
};


export type MutationUpdatePositionArgs = {
  position: UpdatePositionInput;
};


export type MutationUpdateProfileArgs = {
  profile: UpdateProfileInput;
};


export type MutationUpdateProfileLanguageArgs = {
  language: UpdateProfileLanguageInput;
};


export type MutationUpdateProfileSkillArgs = {
  skill: UpdateProfileSkillInput;
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
};


export type MutationUpdateSkillArgs = {
  skill: UpdateSkillInput;
};


export type MutationUpdateUserArgs = {
  user: UpdateUserInput;
};


export type MutationUploadAvatarArgs = {
  avatar: UploadAvatarInput;
};


export type MutationVerifyMailArgs = {
  mail: VerifyMailInput;
};

export type Position = {
  __typename: 'Position';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Proficiency =
  | 'A1'
  | 'A2'
  | 'B1'
  | 'B2'
  | 'C1'
  | 'C2'
  | 'Native';

export type Profile = {
  __typename: 'Profile';
  avatar?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  languages: Array<LanguageProficiency>;
  last_name?: Maybe<Scalars['String']['output']>;
  skills: Array<SkillMastery>;
};

export type Project = {
  __typename: 'Project';
  created_at: Scalars['String']['output'];
  description: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  end_date?: Maybe<Scalars['String']['output']>;
  environment: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internal_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
  start_date: Scalars['String']['output'];
};

export type Query = {
  __typename: 'Query';
  cv: Cv;
  cvs: Array<Cv>;
  departments: Array<Department>;
  languages: Array<Maybe<Language>>;
  login: AuthResult;
  position: Position;
  positions: Array<Position>;
  profile: Profile;
  project: Project;
  projects: Array<Project>;
  skillCategories: Array<SkillCategory>;
  skills: Array<Skill>;
  user: User;
  users: Array<User>;
};


export type QueryCvArgs = {
  cvId: Scalars['ID']['input'];
};


export type QueryLoginArgs = {
  auth: AuthInput;
};


export type QueryPositionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProfileArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  userId: Scalars['ID']['input'];
};

export type RemoveCvProjectInput = {
  cvId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
};

export type Skill = {
  __typename: 'Skill';
  category?: Maybe<SkillCategory>;
  category_name?: Maybe<Scalars['String']['output']>;
  category_parent_name?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SkillCategory = {
  __typename: 'SkillCategory';
  children: Array<SkillCategory>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  parent?: Maybe<SkillCategory>;
};

export type SkillMastery = {
  __typename: 'SkillMastery';
  categoryId?: Maybe<Scalars['ID']['output']>;
  mastery: Mastery;
  name: Scalars['String']['output'];
};

export type SkillMasteryInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  mastery: Mastery;
  name: Scalars['String']['input'];
};

export type UpdateCvInput = {
  cvId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  education?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateCvProjectInput = {
  cvId: Scalars['ID']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  responsibilities: Array<Scalars['String']['input']>;
  roles: Array<Scalars['String']['input']>;
  start_date: Scalars['String']['input'];
};

export type UpdateCvSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  cvId: Scalars['ID']['input'];
  mastery: Mastery;
  name: Scalars['String']['input'];
};

export type UpdateDepartmentInput = {
  departmentId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateLanguageInput = {
  iso2: Scalars['String']['input'];
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  native_name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePositionInput = {
  name: Scalars['String']['input'];
  positionId: Scalars['ID']['input'];
};

export type UpdateProfileInput = {
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type UpdateProfileLanguageInput = {
  name: Scalars['String']['input'];
  proficiency: Proficiency;
  userId: Scalars['ID']['input'];
};

export type UpdateProfileSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  mastery: Mastery;
  name: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type UpdateProjectInput = {
  description: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  environment: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  start_date: Scalars['String']['input'];
};

export type UpdateSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  skillId: Scalars['ID']['input'];
};

export type UpdateTokenResult = {
  __typename: 'UpdateTokenResult';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
};

export type UpdateUserInput = {
  cvsIds?: InputMaybe<Array<Scalars['String']['input']>>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  positionId?: InputMaybe<Scalars['ID']['input']>;
  role?: InputMaybe<UserRole>;
  userId: Scalars['ID']['input'];
};

export type UploadAvatarInput = {
  base64: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type User = {
  __typename: 'User';
  created_at: Scalars['String']['output'];
  cvs?: Maybe<Array<Cv>>;
  department?: Maybe<Department>;
  department_name?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_verified: Scalars['Boolean']['output'];
  position?: Maybe<Position>;
  position_name?: Maybe<Scalars['String']['output']>;
  profile: Profile;
  role: UserRole;
};

export type UserRole =
  | 'Admin'
  | 'Employee';

export type VerifyMailInput = {
  otp: Scalars['String']['input'];
};

export type LoginQueryVariables = Exact<{
  auth: AuthInput;
}>;


export type LoginQuery = { __typename: 'Query', login: { __typename: 'AuthResult', access_token: string } };

export type SignupMutationVariables = Exact<{
  auth: AuthInput;
}>;


export type SignupMutation = { __typename: 'Mutation', signup: { __typename: 'AuthResult', access_token: string } };

export type ForgotPasswordMutationVariables = Exact<{
  auth: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { __typename: 'Mutation', forgotPassword?: any | null };

export type ResetPasswordMutationVariables = Exact<{
  auth: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename: 'Mutation', resetPassword?: any | null };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = { __typename: 'Mutation', createUser: { __typename: 'User', id: string, email: string, role: UserRole } };

export type CvProjectFieldsFragment = { __typename: 'CvProject', id: string, name: string, internal_name: string, domain: string, start_date: string, end_date?: string | null, description: string, environment: Array<string>, responsibilities: Array<string>, roles: Array<string>, project: { __typename: 'Project', id: string, name: string, internal_name: string } };

export type CvsQueryVariables = Exact<{ [key: string]: never; }>;


export type CvsQuery = { __typename: 'Query', cvs: Array<{ __typename: 'Cv', id: string, name: string, education?: string | null, description: string, user?: { __typename: 'User', id: string, email: string } | null }> };

export type CreateCvMutationVariables = Exact<{
  cv: CreateCvInput;
}>;


export type CreateCvMutation = { __typename: 'Mutation', createCv: { __typename: 'Cv', id: string, name: string, education?: string | null, description: string } };

export type CvQueryVariables = Exact<{
  cvId: Scalars['ID']['input'];
}>;


export type CvQuery = { __typename: 'Query', cv: { __typename: 'Cv', id: string, name: string, education?: string | null, description: string, languages: Array<{ __typename: 'LanguageProficiency', name: string, proficiency: Proficiency }>, skills: Array<{ __typename: 'SkillMastery', name: string, mastery: Mastery, categoryId?: string | null }>, projects?: Array<{ __typename: 'CvProject', id: string, name: string, internal_name: string, domain: string, start_date: string, end_date?: string | null, description: string, environment: Array<string>, responsibilities: Array<string>, roles: Array<string>, project: { __typename: 'Project', id: string, name: string, internal_name: string } }> | null, user?: { __typename: 'User', id: string, email: string, position_name?: string | null, department_name?: string | null, profile: { __typename: 'Profile', full_name?: string | null, first_name?: string | null, last_name?: string | null, avatar?: string | null } } | null }, skillCategories: Array<{ __typename: 'SkillCategory', id: string, name: string, order: number, parent?: { __typename: 'SkillCategory', id: string, name: string } | null }> };

export type AddCvProjectMutationVariables = Exact<{
  project: AddCvProjectInput;
}>;


export type AddCvProjectMutation = { __typename: 'Mutation', addCvProject: { __typename: 'Cv', id: string, projects?: Array<{ __typename: 'CvProject', id: string, name: string, internal_name: string, domain: string, start_date: string, end_date?: string | null, description: string, environment: Array<string>, responsibilities: Array<string>, roles: Array<string>, project: { __typename: 'Project', id: string, name: string, internal_name: string } }> | null } };

export type UpdateCvMutationVariables = Exact<{
  cv: UpdateCvInput;
}>;


export type UpdateCvMutation = { __typename: 'Mutation', updateCv: { __typename: 'Cv', id: string, name: string, education?: string | null, description: string } };

export type DeleteCvMutationVariables = Exact<{
  cv: DeleteCvInput;
}>;


export type DeleteCvMutation = { __typename: 'Mutation', deleteCv: { __typename: 'DeleteResult', affected: number } };

export type UpdateCvProjectMutationVariables = Exact<{
  project: UpdateCvProjectInput;
}>;


export type UpdateCvProjectMutation = { __typename: 'Mutation', updateCvProject: { __typename: 'Cv', id: string, projects?: Array<{ __typename: 'CvProject', id: string, name: string, internal_name: string, domain: string, start_date: string, end_date?: string | null, description: string, environment: Array<string>, responsibilities: Array<string>, roles: Array<string>, project: { __typename: 'Project', id: string, name: string, internal_name: string } }> | null } };

export type RemoveCvProjectMutationVariables = Exact<{
  project: RemoveCvProjectInput;
}>;


export type RemoveCvProjectMutation = { __typename: 'Mutation', removeCvProject: { __typename: 'Cv', id: string, projects?: Array<{ __typename: 'CvProject', id: string, name: string, internal_name: string, domain: string, start_date: string, end_date?: string | null, description: string, environment: Array<string>, responsibilities: Array<string>, roles: Array<string>, project: { __typename: 'Project', id: string, name: string, internal_name: string } }> | null } };

export type LanguagesWithProfileQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type LanguagesWithProfileQuery = { __typename: 'Query', languages: Array<{ __typename: 'Language', id: string, name: string } | null>, profile: { __typename: 'Profile', id: string, languages: Array<{ __typename: 'LanguageProficiency', name: string, proficiency: Proficiency }> } };

export type AddProfileLanguageMutationVariables = Exact<{
  language: AddProfileLanguageInput;
}>;


export type AddProfileLanguageMutation = { __typename: 'Mutation', addProfileLanguage: { __typename: 'Profile', id: string, languages: Array<{ __typename: 'LanguageProficiency', name: string, proficiency: Proficiency }> } };

export type DeleteProfileLanguageMutationVariables = Exact<{
  language: DeleteProfileLanguageInput;
}>;


export type DeleteProfileLanguageMutation = { __typename: 'Mutation', deleteProfileLanguage: { __typename: 'Profile', id: string, languages: Array<{ __typename: 'LanguageProficiency', name: string, proficiency: Proficiency }> } };

export type SkillCategoriesForFormQueryVariables = Exact<{ [key: string]: never; }>;


export type SkillCategoriesForFormQuery = { __typename: 'Query', skillCategories: Array<{ __typename: 'SkillCategory', id: string, name: string, order: number, parent?: { __typename: 'SkillCategory', id: string, name: string } | null }> };

export type SkillsWithCategoriesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type SkillsWithCategoriesQuery = { __typename: 'Query', skillCategories: Array<{ __typename: 'SkillCategory', id: string, name: string, order: number, parent?: { __typename: 'SkillCategory', id: string, name: string } | null }>, skills: Array<{ __typename: 'Skill', id: string, name: string, category?: { __typename: 'SkillCategory', id: string, name: string } | null }>, profile: { __typename: 'Profile', id: string, skills: Array<{ __typename: 'SkillMastery', name: string, categoryId?: string | null, mastery: Mastery }> } };

export type AddProfileSkillMutationVariables = Exact<{
  skill: AddProfileSkillInput;
}>;


export type AddProfileSkillMutation = { __typename: 'Mutation', addProfileSkill: { __typename: 'Profile', id: string, skills: Array<{ __typename: 'SkillMastery', name: string, categoryId?: string | null, mastery: Mastery }> } };

export type DeleteProfileSkillMutationVariables = Exact<{
  skill: DeleteProfileSkillInput;
}>;


export type DeleteProfileSkillMutation = { __typename: 'Mutation', deleteProfileSkill: { __typename: 'Profile', id: string, skills: Array<{ __typename: 'SkillMastery', name: string, categoryId?: string | null, mastery: Mastery }> } };

export type UpdateSkillMutationVariables = Exact<{
  skill: UpdateSkillInput;
}>;


export type UpdateSkillMutation = { __typename: 'Mutation', updateSkill: { __typename: 'Skill', id: string, name: string, category?: { __typename: 'SkillCategory', id: string, name: string } | null } };

export type AdminSkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminSkillsQuery = { __typename: 'Query', skills: Array<{ __typename: 'Skill', id: string, name: string, category_name?: string | null, category_parent_name?: string | null, created_at: string, category?: { __typename: 'SkillCategory', id: string, name: string } | null }>, skillCategories: Array<{ __typename: 'SkillCategory', id: string, name: string, order: number, parent?: { __typename: 'SkillCategory', id: string, name: string } | null }> };

export type CreateSkillMutationVariables = Exact<{
  skill: CreateSkillInput;
}>;


export type CreateSkillMutation = { __typename: 'Mutation', createSkill: { __typename: 'Skill', id: string, name: string, category_name?: string | null, category_parent_name?: string | null, created_at: string, category?: { __typename: 'SkillCategory', id: string, name: string } | null } };

export type DeleteSkillMutationVariables = Exact<{
  skill: DeleteSkillInput;
}>;


export type DeleteSkillMutation = { __typename: 'Mutation', deleteSkill: { __typename: 'DeleteResult', affected: number } };

export type AdminUpdateSkillMutationVariables = Exact<{
  skill: UpdateSkillInput;
}>;


export type AdminUpdateSkillMutation = { __typename: 'Mutation', updateSkill: { __typename: 'Skill', id: string, name: string, category_name?: string | null, category_parent_name?: string | null, created_at: string, category?: { __typename: 'SkillCategory', id: string, name: string } | null } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename: 'Query', users: Array<{ __typename: 'User', id: string, email: string, created_at: string, department_name?: string | null, position_name?: string | null, profile: { __typename: 'Profile', id: string, first_name?: string | null, last_name?: string | null, avatar?: string | null }, department?: { __typename: 'Department', id: string, name: string } | null, position?: { __typename: 'Position', id: string, name: string } | null }> };

export type UserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type UserQuery = { __typename: 'Query', user: { __typename: 'User', id: string, email: string, created_at: string, department_name?: string | null, position_name?: string | null, profile: { __typename: 'Profile', id: string, first_name?: string | null, last_name?: string | null, avatar?: string | null }, department?: { __typename: 'Department', id: string, name: string } | null, position?: { __typename: 'Position', id: string, name: string } | null } };

export type UserDirectoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDirectoriesQuery = { __typename: 'Query', departments: Array<{ __typename: 'Department', id: string, name: string }>, positions: Array<{ __typename: 'Position', id: string, name: string }> };

export type UpdateProfileMutationVariables = Exact<{
  profile: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename: 'Mutation', updateProfile: { __typename: 'Profile', id: string, first_name?: string | null, last_name?: string | null, avatar?: string | null } };

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename: 'Mutation', updateUser: { __typename: 'User', id: string, department_name?: string | null, position_name?: string | null, department?: { __typename: 'Department', id: string, name: string } | null, position?: { __typename: 'Position', id: string, name: string } | null } };

export type UploadAvatarMutationVariables = Exact<{
  avatar: UploadAvatarInput;
}>;


export type UploadAvatarMutation = { __typename: 'Mutation', uploadAvatar: string };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename: 'Mutation', deleteUser: { __typename: 'DeleteResult', affected: number } };
