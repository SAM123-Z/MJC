/*
  # Créer un compte Agent CDC de test

  1. Nouveau compte utilisateur
    - Email: agent.cdc@minjec.gov.dj
    - Mot de passe: agent123
    - Type: cdc_agent
    - Matricule auto-généré
    - Département: Djibouti ville - Balbala

  2. Sécurité
    - Compte activé et vérifié
    - Profil utilisateur créé
    - Enregistrement agent CDC avec matricule
*/

-- Insérer dans auth.users (table système Supabase)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  'cdc-agent-test-id-001',
  '00000000-0000-0000-0000-000000000000',
  'agent.cdc@minjec.gov.dj',
  crypt('agent123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated',
  'authenticated'
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
  'cdc-agent-test-id-001',
  'cdc_agent',
  'agent_cdc_test',
  'CDC001789',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  user_type = EXCLUDED.user_type,
  username = EXCLUDED.username,
  user_id_or_registration = EXCLUDED.user_id_or_registration,
  updated_at = now();

-- Créer l'enregistrement agent CDC
INSERT INTO cdc_agents (
  user_id,
  department,
  status,
  hire_date,
  created_at,
  updated_at
) VALUES (
  'cdc-agent-test-id-001',
  'Djibouti ville - Balbala',
  'active',
  CURRENT_DATE,
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  department = EXCLUDED.department,
  status = EXCLUDED.status,
  updated_at = now();

-- Ajouter quelques missions de test pour l'agent
INSERT INTO cdc_missions (
  agent_id,
  title,
  description,
  status,
  priority,
  due_date,
  assigned_by,
  created_at
) 
SELECT 
  ca.id,
  'Mission de sensibilisation - Quartier Balbala',
  'Organiser une campagne de sensibilisation sur l''entrepreneuriat jeune dans le quartier de Balbala',
  'assigned',
  'high',
  CURRENT_DATE + INTERVAL '7 days',
  (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  now()
FROM cdc_agents ca 
WHERE ca.user_id = 'cdc-agent-test-id-001'
ON CONFLICT DO NOTHING;

INSERT INTO cdc_missions (
  agent_id,
  title,
  description,
  status,
  priority,
  due_date,
  assigned_by,
  created_at
) 
SELECT 
  ca.id,
  'Formation entrepreneuriat - Jeunes 18-25 ans',
  'Animer une formation sur les bases de l''entrepreneuriat pour les jeunes de 18 à 25 ans',
  'in_progress',
  'medium',
  CURRENT_DATE + INTERVAL '14 days',
  (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  now() - INTERVAL '3 days'
FROM cdc_agents ca 
WHERE ca.user_id = 'cdc-agent-test-id-001'
ON CONFLICT DO NOTHING;

-- Ajouter quelques activités de test
INSERT INTO cdc_activities (
  agent_id,
  title,
  description,
  activity_type,
  target_audience,
  location,
  scheduled_date,
  status,
  participants_count,
  created_at
) 
SELECT 
  ca.id,
  'Atelier Création d''Entreprise',
  'Atelier pratique sur les démarches de création d''entreprise pour les jeunes entrepreneurs',
  'formation',
  'Jeunes 20-30 ans',
  'Centre Communautaire Balbala',
  CURRENT_DATE + INTERVAL '5 days',
  'planned',
  25,
  now()
FROM cdc_agents ca 
WHERE ca.user_id = 'cdc-agent-test-id-001'
ON CONFLICT DO NOTHING;

INSERT INTO cdc_activities (
  agent_id,
  title,
  description,
  activity_type,
  target_audience,
  location,
  scheduled_date,
  status,
  participants_count,
  created_at
) 
SELECT 
  ca.id,
  'Réunion Comité de Quartier',
  'Réunion mensuelle avec le comité de quartier pour planifier les activités du mois',
  'reunion',
  'Comité de quartier',
  'Mairie de Balbala',
  CURRENT_DATE - INTERVAL '2 days',
  'completed',
  12,
  now() - INTERVAL '2 days'
FROM cdc_agents ca 
WHERE ca.user_id = 'cdc-agent-test-id-001'
ON CONFLICT DO NOTHING;

-- Ajouter un rapport de test
INSERT INTO cdc_reports (
  agent_id,
  title,
  report_type,
  content,
  period_start,
  period_end,
  status,
  created_at
) 
SELECT 
  ca.id,
  'Rapport Mensuel - Janvier 2025',
  'monthly',
  'Rapport d''activité pour le mois de janvier 2025. Activités réalisées: 3 formations, 2 réunions, 1 événement communautaire. Participants total: 87 personnes.',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE,
  'draft',
  now()
FROM cdc_agents ca 
WHERE ca.user_id = 'cdc-agent-test-id-001'
ON CONFLICT DO NOTHING;