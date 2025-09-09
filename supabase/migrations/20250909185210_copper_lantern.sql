/*
  # Table des notifications système

  1. Nouvelles Tables
    - `system_notifications` - Notifications système
      - `id` (uuid, primary key)
      - `type` (text, type de notification)
      - `recipient` (text, destinataire)
      - `title` (text, titre)
      - `message` (text, message)
      - `data` (jsonb, données supplémentaires)
      - `status` (text, statut)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur system_notifications
    - Politiques pour admins et utilisateurs concernés
*/

-- Table des notifications système
CREATE TABLE IF NOT EXISTS system_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('email', 'system', 'push', 'new_registration')),
  recipient text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_system_notifications_recipient ON system_notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_system_notifications_type ON system_notifications(type);
CREATE INDEX IF NOT EXISTS idx_system_notifications_created_at ON system_notifications(created_at);

-- Politiques RLS
CREATE POLICY "Admins can manage all notifications"
  ON system_notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Users can read their notifications"
  ON system_notifications
  FOR SELECT
  TO authenticated
  USING (
    recipient IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Fonction pour nettoyer les anciennes notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM system_notifications 
  WHERE created_at < now() - interval '30 days';
END;
$$;