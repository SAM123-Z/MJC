import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!')
  console.error('Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env')
  throw new Error('Configuration Supabase manquante')
}

// Validation du format des URLs
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Format d\'URL Supabase invalide:', supabaseUrl)
  throw new Error('URL Supabase invalide - doit être au format https://your-project.supabase.co')
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Log de connexion réussie
console.log('✅ Client Supabase initialisé avec succès')
console.log('🔗 URL:', supabaseUrl)

export type UserType = 'standard_user' | 'cdc_agent' | 'association' | 'admin'

export interface AuthFormData {
  userType: UserType
  username: string
  userIdOrRegistration: string
  email: string
  password: string
}

export interface UserProfile {
  id: string
  user_type: UserType
  username: string
  user_id_or_registration: string
  created_at: string
}

export interface PendingUser {
  id: string
  email: string
  username: string
  user_type: UserType
  user_id_or_registration: string
  additional_info: Record<string, any>
  status: 'pending' | 'approved' | 'rejected'
  serial_number?: string
  approved_by?: string
  approved_at?: string
  rejected_reason?: string
  created_at: string
  updated_at: string
}
export interface CDCAgent {
  id: string
  user_id: string
  matricule: string
  department: string
  status: 'active' | 'inactive' | 'suspended' | 'terminated'
  hire_date: string
  created_at: string
  updated_at: string
}

export interface Association {
  id: string
  user_id: string
  association_name: string
  registration_number: string
  legal_status: string
  activity_sector: string
  address?: string
  phone?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  registration_date: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  action_type: string
  target_type: string
  target_id?: string
  description: string
  metadata: Record<string, any>
  created_at: string
}