import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface NotificationRequest {
  type: 'email' | 'system' | 'push';
  recipient: string;
  title: string;
  message: string;
  data?: any;
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

    // POST /api-notifications - Envoyer une notification
    if (req.method === 'POST' && path === '/api-notifications') {
      const notificationData: NotificationRequest = await req.json()

      if (!notificationData.recipient || !notificationData.title || !notificationData.message) {
        return new Response(
          JSON.stringify({ error: 'Données manquantes: recipient, title et message requis' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Envoyer selon le type
      if (notificationData.type === 'email') {
        try {
          await supabaseAdmin.functions.invoke('send-notification-email', {
            body: {
              type: 'general',
              to: notificationData.recipient,
              data: {
                title: notificationData.title,
                message: notificationData.message,
                ...notificationData.data
              }
            }
          })
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError)
          return new Response(
            JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }
      }

      // Enregistrer la notification système
      const { data, error } = await supabaseAdmin
        .from('system_notifications')
        .insert({
          type: notificationData.type,
          recipient: notificationData.recipient,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data || {},
          status: 'sent'
        })
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
      )
    }

    // GET /api-notifications - Récupérer les notifications
    if (req.method === 'GET' && path === '/api-notifications') {
      const recipient = url.searchParams.get('recipient')
      const type = url.searchParams.get('type')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      let query = supabaseAdmin
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (recipient) {
        query = query.eq('recipient', recipient)
      }
      if (type) {
        query = query.eq('type', type)
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

    return new Response(
      JSON.stringify({ error: 'Endpoint non trouvé' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error: any) {
    console.error('Erreur API Notifications:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})