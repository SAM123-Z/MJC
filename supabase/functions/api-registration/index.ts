import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface RegistrationRequest {
  email: string;
  username: string;
  user_type: 'standard_user' | 'cdc_agent' | 'association' | 'admin';
  user_id_or_registration: string;
  additional_info?: any;
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

    // POST /api-registration - Créer une nouvelle demande d'inscription
    if (req.method === 'POST' && path === '/api-registration') {
      const requestData: RegistrationRequest = await req.json()

      // Validation des données
      if (!requestData.email || !requestData.username || !requestData.user_type) {
        return new Response(
          JSON.stringify({ error: 'Données manquantes: email, username et user_type requis' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabaseAdmin
        .from('pending_users')
        .select('id')
        .eq('email', requestData.email)
        .single()

      if (existingUser) {
        return new Response(
          JSON.stringify({ error: 'Une demande existe déjà pour cet email' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      // Créer la demande
      const { data: pendingUser, error } = await supabaseAdmin
        .from('pending_users')
        .insert({
          email: requestData.email,
          username: requestData.username,
          user_type: requestData.user_type,
          user_id_or_registration: requestData.user_id_or_registration,
          additional_info: requestData.additional_info || {},
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: `Erreur lors de la création: ${error.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Envoyer notification admin
      try {
        await supabaseAdmin.functions.invoke('send-notification-email', {
          body: {
            type: 'admin_notification',
            to: 'admin@minjec.gov.dj',
            data: {
              username: requestData.username,
              email: requestData.email,
              userType: requestData.user_type,
              userIdOrRegistration: requestData.user_id_or_registration,
              submissionDate: new Date().toLocaleDateString('fr-FR'),
              pendingId: pendingUser.id
            }
          }
        })
      } catch (emailError) {
        console.warn('Erreur envoi email admin:', emailError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Demande créée avec succès',
          data: pendingUser
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
      )
    }

    // GET /api-registration - Récupérer les demandes d'inscription
    if (req.method === 'GET' && path === '/api-registration') {
      const status = url.searchParams.get('status')
      const userType = url.searchParams.get('user_type')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      let query = supabaseAdmin
        .from('pending_users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (status) {
        query = query.eq('status', status)
      }
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

    // PUT /api-registration/:id - Mettre à jour une demande
    if (req.method === 'PUT' && path.startsWith('/api-registration/')) {
      const id = path.split('/')[2]
      const updateData = await req.json()

      const { data, error } = await supabaseAdmin
        .from('pending_users')
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

    return new Response(
      JSON.stringify({ error: 'Endpoint non trouvé' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error: any) {
    console.error('Erreur API Registration:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})