import { supabase } from './supabase'

export type UserProfile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}


export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) throw error
}

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  if (error) throw error
}


export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })
  
  if (uploadError) throw uploadError
  
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}