import { User } from '@supabase/supabase-js'

export type Role = 'ADMIN' | 'USER'

export type UserWithRoles = User & { user_roles: Role[] }
