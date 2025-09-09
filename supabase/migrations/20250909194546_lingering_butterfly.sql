/*
  # Créer un compte administrateur de test

  1. Comptes créés
    - Admin de test avec email et mot de passe
    - Profil utilisateur associé
    - Données d'auteur pour les permissions

  2. Sécurité
    - Mot de passe sécurisé
    - Permissions administrateur complètes
    - Email confirmé automatiquement
*/

-- Insérer un utilisateur admin de test dans auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'admin-test-uuid-12345',
  '00000000-0000-0000-0000-000000000000',
  'admin@minjec.gov.dj',
  '$2a$10$8K1p/a0dUrZBvfC4BaOgUOXwHdkcIqoXnOjKjKxkxeQxQxQxQxQxQ', -- Mot de passe: admin123
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Créer le profil utilisateur
INSERT INTO user_profiles (
  id,
  user_type,
  username,
  user_id_or_registration,
  created_at,
  updated_at
) VALUES (
  'admin-test-uuid-12345',
  'admin',
  'admin',
  'ADMIN-001',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  user_type = EXCLUDED.user_type,
  username = EXCLUDED.username,
  user_id_or_registration = EXCLUDED.user_id_or_registration,
  updated_at = NOW();

-- Créer l'entrée auteur pour les permissions complètes
INSERT INTO auteurs (
  id,
  matricule,
  nom_complet,
  email,
  role,
  date_creation
) VALUES (
  'admin-test-uuid-12345',
  'ADMIN-001',
  'Administrateur Test',
  'admin@minjec.gov.dj',
  'admin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  matricule = EXCLUDED.matricule,
  nom_complet = EXCLUDED.nom_complet,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  date_creation = NOW();

-- Créer quelques demandes d'inscription de test
INSERT INTO pending_users (
  email,
  username,
  user_type,
  user_id_or_registration,
  additional_info,
  status,
  created_at
) VALUES 
(
  'ahmed.hassan@example.com',
  'ahmed_hassan',
  'cdc_agent',
  '123456789',
  '{"password": "password123", "region": "Djibouti ville", "commune": "Balbala", "quartierCite": "Quartier 1"}',
  'pending',
  NOW() - INTERVAL '2 hours'
),
(
  'fatima.omar@example.com',
  'fatima_omar',
  'association',
  '987654321',
  '{"password": "password123", "associationName": "Association Femmes Actives", "activitySector": "Droits humains", "address": "Djibouti Centre", "phone": "+253 77 123 456"}',
  'pending',
  NOW() - INTERVAL '1 day'
),
(
  'mohamed.ali@example.com',
  'mohamed_ali',
  'standard_user',
  '456789123',
  '{"password": "password123"}',
  'pending',
  NOW() - INTERVAL '3 hours'
),
(
  'khadija.said@example.com',
  'khadija_said',
  'cdc_agent',
  '789123456',
  '{"password": "password123", "region": "Tadjourah", "commune": "", "quartierCite": ""}',
  'pending',
  NOW() - INTERVAL '6 hours'
) ON CONFLICT (email) DO NOTHING;

-- Créer quelques notifications système
INSERT INTO system_notifications (
  type,
  title,
  message,
  created_by,
  created_at
) VALUES 
(
  'info',
  'Nouvelle demande d''inscription',
  'Ahmed Hassan a soumis une demande d''inscription en tant qu''Agent CDC',
  'admin-test-uuid-12345',
  NOW() - INTERVAL '2 hours'
),
(
  'info',
  'Nouvelle demande d''inscription',
  'Fatima Omar a soumis une demande d''inscription pour son association',
  'admin-test-uuid-12345',
  NOW() - INTERVAL '1 day'
),
(
  'info',
  'Nouvelle demande d''inscription',
  'Mohamed Ali a soumis une demande d''inscription utilisateur standard',
  'admin-test-uuid-12345',
  NOW() - INTERVAL '3 hours'
);

-- Créer quelques logs d'activité
INSERT INTO activity_logs (
  user_id,
  action_type,
  target_type,
  target_id,
  description,
  metadata,
  created_at
) VALUES 
(
  'admin-test-uuid-12345',
  'CREATE',
  'USER_REQUEST',
  NULL,
  'Nouvelle demande d''inscription reçue',
  '{"user_type": "cdc_agent", "username": "ahmed_hassan"}',
  NOW() - INTERVAL '2 hours'
),
(
  'admin-test-uuid-12345',
  'CREATE',
  'USER_REQUEST',
  NULL,
  'Nouvelle demande d''inscription reçue',
  '{"user_type": "association", "username": "fatima_omar"}',
  NOW() - INTERVAL '1 day'
),
(
  'admin-test-uuid-12345',
  'CREATE',
  'USER_REQUEST',
  NULL,
  'Nouvelle demande d''inscription reçue',
  '{"user_type": "standard_user", "username": "mohamed_ali"}',
  NOW() - INTERVAL '3 hours'
);