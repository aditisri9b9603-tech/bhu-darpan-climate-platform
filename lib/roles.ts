'use server'

import { createServerClient } from '@/lib/supabase/server'

export type UserRole = 'citizen' | 'analyst' | 'admin'

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (profile?.role as UserRole) || null
}

export function canAccessFeature(role: UserRole | null, requiredRole: UserRole): boolean {
  if (!role) return false

  const roleHierarchy: Record<UserRole, number> = {
    citizen: 1,
    analyst: 2,
    admin: 3,
  }

  return roleHierarchy[role] >= roleHierarchy[requiredRole]
}

export function isAdmin(role: UserRole | null): boolean {
  return role === 'admin'
}

export function isAnalyst(role: UserRole | null): boolean {
  return role === 'analyst' || role === 'admin'
}

export function isCitizen(role: UserRole | null): boolean {
  return role === 'citizen' || role === 'analyst' || role === 'admin'
}
