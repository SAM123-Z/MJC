import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

    const url = new URL(req.url)
    const path = url.pathname

    // GET /api-users - Récupérer tous les utilisateurs
    if (req.method === 'GET' && path === '/api-users') {
      const userType = url.searchParams.get('user_type')
      const limit = parseInt(url.searchParams.get('limit') || '100')

      let query = supabaseAdmin
        .from('user_profiles')
        .select(`
          *,
          cdc_agents (matricule, department, status, hire_date),
          associations (association_name, registration_number, status, activity_sector)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (userType) {
        query = query.eq('user_type', userType)
      }

      const { data, error } = await query

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // GET /api-users/:id - Récupérer un utilisateur spécifique
    if (req.method === 'GET' && path.startsWith('/api-users/')) {
      const id = path.split('/')[2]

      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select(`
          *,
          cdc_agents (*),
          associations (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // PUT /api-users/:id - Mettre à jour un utilisateur
    if (req.method === 'PUT' && path.startsWith('/api-users/')) {
      const id = path.split('/')[2]
      const updateData = await req.json()

      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // DELETE /api-users/:id - Supprimer un utilisateur
    if (req.method === 'DELETE' && path.startsWith('/api-users/')) {
      const id = path.split('/')[2]

      // Supprimer d'abord de Supabase Auth
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)
      if (authError) {
        console.warn('Erreur suppression auth:', authError)
      }

      // Supprimer le profil (cascade supprimera les données liées)
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('id', id)

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Utilisateur supprimé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint non trouvé' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error: any) {
    console.error('Erreur API Users:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})