import { supabase } from './supabase'

export type AdminUser = {
  id: string
  user_id: string
  role: string
  permissions: {
    manage_users?: boolean
    manage_products?: boolean
    site_settings?: boolean
    manage_admins?: boolean
  }
  created_at: string
  updated_at: string
}

export type SiteSetting = {
  id: string
  key: string
  value: any
  description?: string
  updated_by?: string
  created_at: string
  updated_at: string
}

export type UserSession = {
  id: string
  user_id: string
  ip_address?: string
  user_agent?: string
  last_activity: string
  created_at: string
}


export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export const createAdminUser = async (userId: string, permissions: any = {}) => {
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{
      user_id: userId,
      permissions: {
        manage_users: true,
        manage_products: true,
        site_settings: true,
        ...permissions
      }
    }])
    .select()
  
  if (error) throw error
  return data
}

export const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      *,
      user_profiles (
        full_name,
        email,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}


export const getSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key')
  
  if (error) throw error
  return data
}

export const getSiteSetting = async (key: string) => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data?.value || null
}

export const updateSiteSetting = async (key: string, value: any) => {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({
      key,
      value,
      updated_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
  
  if (error) throw error
  return data
}


export const trackUserSession = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('user_sessions')
    .upsert({
      user_id: user.id,
      ip_address: null, 
      user_agent: navigator.userAgent,
      last_activity: new Date().toISOString()
    })
  
  if (error) console.error('Error tracking session:', error)
}

export const getUserSessions = async () => {
  const { data, error } = await supabase
    .from('user_sessions')
    .select(`
      *,
      user_profiles (
        full_name,
        email
      )
    `)
    .order('last_activity', { ascending: false })
  
  if (error) throw error
  return data
}


export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const toggleUserAccess = async (userId: string, blocked: boolean) => {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { blocked }
  })
  
  if (error) throw error
}


export const searchProducts = async (query: string) => {
  if (!query.trim()) {
    return await supabase
      .from('products')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error
        return data
      })
  }


  const { data, error } = await supabase
    .rpc('search_products', { search_query: query })
  
  if (error) throw error
  return data
}