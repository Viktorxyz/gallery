import { Role, UserWithRoles } from '@/types/auth'
import { Gallery } from '@/types/gallery'
import createClient from '@/utils/supabase/server'
import { jwtDecode } from 'jwt-decode'

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: UserWithRoles, data: Permissions[Key]['dataType']) => boolean)

type Permissions = {
  galleries: {
    dataType: Gallery
    action: 'create' | 'read' | 'update' | 'delete' // CRUD
  }
}

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]['action']]: PermissionCheck<Key>
    }>
  }>
}

const ROLES = {
  ADMIN: {
    galleries: {
      create: true,
      read: true,
      delete: true,
      update: true
    }
  },
  USER: {
    galleries: {
      create: false,
      read: false,
      delete: false,
      update: false
    }
  }
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
  user: UserWithRoles | null,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) {
  return user?.user_roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
    if (!permission) return false

    if (typeof permission === 'boolean') return permission
    return data != null && permission(user, data)
  })
}

export async function getUserWithRoles() {
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const user: UserWithRoles | null = session
    ? {
        ...session.user,
        user_roles: (jwtDecode(session.access_token) as { user_roles: Role[] })
          .user_roles
      }
    : null

  return user
}
