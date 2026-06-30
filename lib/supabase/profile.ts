import { createServerClient } from '@/lib/supabase/server'

export async function createUserProfile(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  role: 'citizen' | 'analyst' | 'admin' = 'citizen'
) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      },
    ])
    .select()

  if (error) {
    console.error('Profile creation error:', error)
    throw error
  }

  return data
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Profile fetch error:', error)
    return null
  }

  return data
}
