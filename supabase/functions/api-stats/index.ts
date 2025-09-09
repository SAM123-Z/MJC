import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // GET /api-stats - Récupérer les statistiques du système
    if (req.method === 'GET') {
      // Statistiques des utilisateurs
      const { data: userProfiles } = await supabaseAdmin
        .from('user_profiles')
        .select('user_type')

      const { data: pendingUsers } = await supabaseAdmin
        .from('pending_users')
        .select('status, user_type, created_at')

      const { data: agents } = await supabaseAdmin
        .from('cdc_agents')
        .select('status')

      const { data: associations } = await supabaseAdmin
        .from('associations')
        .select('status')

      const { data: recentActivities } = await supabaseAdmin
        .from('activity_logs')
        .select('id, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Calculer les statistiques
      const stats = {
        users: {
          total: userProfiles?.length || 0,
          by_type: {
            standard_user: userProfiles?.filter(u => u.user_type === 'standard_user').length || 0,
            cdc_agent: userProfiles?.filter(u => u.user_type === 'cdc_agent').length || 0,
            association: userProfiles?.filter(u => u.user_type === 'association').length || 0,
            admin: userProfiles?.filter(u => u.user_type === 'admin').length || 0,
          }
        },
        pending_requests: {
          total: pendingUsers?.length || 0,
          pending: pendingUsers?.filter(u => u.status === 'pending').length || 0,
          approved: pendingUsers?.filter(u => u.status === 'approved').length || 0,
          rejected: pendingUsers?.filter(u => u.status === 'rejected').length || 0,
          by_type: {
            standard_user: pendingUsers?.filter(u => u.user_type === 'standard_user').length || 0,
            cdc_agent: pendingUsers?.filter(u => u.user_type === 'cdc_agent').length || 0,
            association: pendingUsers?.filter(u => u.user_type === 'association').length || 0,
            admin: pendingUsers?.filter(u => u.user_type === 'admin').length || 0,
          }
        },
        agents: {
          total: agents?.length || 0,
          active: agents?.filter(a => a.status === 'active').length || 0,
          inactive: agents?.filter(a => a.status === 'inactive').length || 0,
        },
        associations: {
          total: associations?.length || 0,
          approved: associations?.filter(a => a.status === 'approved').length || 0,
          pending: associations?.filter(a => a.status === 'pending').length || 0,
        },
        activity: {
          recent_activities: recentActivities?.length || 0,
          last_7_days: recentActivities?.length || 0,
        },
        system: {
          timestamp: new Date().toISOString(),
          uptime: Date.now(),
        }
      }

      return new Response(
        JSON.stringify({ success: true, data: stats }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Méthode non autorisée' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error: any) {
    console.error('Erreur API Stats:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})