import { z } from 'zod';

// Enum Schemas
export const ProjectStatusEnum = z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']);
export type ProjectStatusEnum = z.infer<typeof ProjectStatusEnum>;

export const TaskStatusEnum = z.enum(['todo', 'in_progress', 'review', 'completed']);
export type TaskStatusEnum = z.infer<typeof TaskStatusEnum>;

export const PriorityLevelEnum = z.enum(['low', 'medium', 'high', 'urgent']);
export type PriorityLevelEnum = z.infer<typeof PriorityLevelEnum>;

export const UserRoleEnum = z.enum(['admin', 'member', 'guest']);
export type UserRoleEnum = z.infer<typeof UserRoleEnum>;

export const SubscriptionTierEnum = z.enum(['free', 'pro', 'enterprise']);
export type SubscriptionTierEnum = z.infer<typeof SubscriptionTierEnum>;

export const SubscriptionStatusEnum = z.enum(['active', 'past_due', 'cancelled', 'trial']);
export type SubscriptionStatusEnum = z.infer<typeof SubscriptionStatusEnum>;

// Table Schemas
export const Projects = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  owner_id: z.number(),
  status: ProjectStatusEnum,
  settings: z.any(),
  metadata: z.any().nullable(),
  is_archived: z.boolean(),
  team_id: z.number(),
});
export type Projects = z.infer<typeof Projects>;

export const ProjectsInsert = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  owner_id: z.number(),
  status: ProjectStatusEnum.optional(),
  settings: z.any().optional(),
  metadata: z.any().optional(),
  is_archived: z.boolean().optional(),
  team_id: z.number(),
});
export type ProjectsInsert = z.infer<typeof ProjectsInsert>;

export const ProjectsUpdate = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  owner_id: z.number().optional(),
  status: ProjectStatusEnum.optional(),
  settings: z.any().optional(),
  metadata: z.any().optional(),
  is_archived: z.boolean().optional(),
  team_id: z.number().optional(),
});
export type ProjectsUpdate = z.infer<typeof ProjectsUpdate>;

export const Tasks = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  due_date: z.string().nullable(),
  assignee_id: z.number().nullable(),
  project_id: z.number(),
  priority: PriorityLevelEnum,
  status: TaskStatusEnum,
  labels: z.array(z.string()),
  metadata: z.any().nullable(),
});
export type Tasks = z.infer<typeof Tasks>;

export const TasksInsert = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  due_date: z.string().optional(),
  assignee_id: z.number().optional(),
  project_id: z.number(),
  priority: PriorityLevelEnum.optional(),
  status: TaskStatusEnum.optional(),
  labels: z.array(z.string()).optional(),
  metadata: z.any().optional(),
});
export type TasksInsert = z.infer<typeof TasksInsert>;

export const TasksUpdate = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  due_date: z.string().optional(),
  assignee_id: z.number().optional(),
  project_id: z.number().optional(),
  priority: PriorityLevelEnum.optional(),
  status: TaskStatusEnum.optional(),
  labels: z.array(z.string()).optional(),
  metadata: z.any().optional(),
});
export type TasksUpdate = z.infer<typeof TasksUpdate>;

export const Teams = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  organization_id: z.number(),
  settings: z.any(),
});
export type Teams = z.infer<typeof Teams>;

export const TeamsInsert = z.object({
  id: z.number().optional(),
  name: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  organization_id: z.number(),
  settings: z.any().optional(),
});
export type TeamsInsert = z.infer<typeof TeamsInsert>;

export const TeamsUpdate = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  organization_id: z.number().optional(),
  settings: z.any().optional(),
});
export type TeamsUpdate = z.infer<typeof TeamsUpdate>;

export const Organizations = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
  subscription_tier: SubscriptionTierEnum,
  settings: z.any(),
  billing_email: z.string(),
  subscription_status: SubscriptionStatusEnum,
});
export type Organizations = z.infer<typeof Organizations>;

export const OrganizationsInsert = z.object({
  id: z.number().optional(),
  name: z.string(),
  created_at: z.string().optional(),
  subscription_tier: SubscriptionTierEnum.optional(),
  settings: z.any().optional(),
  billing_email: z.string(),
  subscription_status: SubscriptionStatusEnum.optional(),
});
export type OrganizationsInsert = z.infer<typeof OrganizationsInsert>;

export const OrganizationsUpdate = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  created_at: z.string().optional(),
  subscription_tier: SubscriptionTierEnum.optional(),
  settings: z.any().optional(),
  billing_email: z.string().optional(),
  subscription_status: SubscriptionStatusEnum.optional(),
});
export type OrganizationsUpdate = z.infer<typeof OrganizationsUpdate>;

export const Users = z.object({
  id: z.number(),
  email: z.string(),
  full_name: z.string().nullable(),
  created_at: z.string(),
  last_login: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: UserRoleEnum,
  preferences: z.any(),
});
export type Users = z.infer<typeof Users>;

export const UsersInsert = z.object({
  id: z.number().optional(),
  email: z.string(),
  full_name: z.string().optional(),
  created_at: z.string().optional(),
  last_login: z.string().optional(),
  avatar_url: z.string().optional(),
  role: UserRoleEnum.optional(),
  preferences: z.any().optional(),
});
export type UsersInsert = z.infer<typeof UsersInsert>;

export const UsersUpdate = z.object({
  id: z.number().optional(),
  email: z.string().optional(),
  full_name: z.string().optional(),
  created_at: z.string().optional(),
  last_login: z.string().optional(),
  avatar_url: z.string().optional(),
  role: UserRoleEnum.optional(),
  preferences: z.any().optional(),
});
export type UsersUpdate = z.infer<typeof UsersUpdate>;

