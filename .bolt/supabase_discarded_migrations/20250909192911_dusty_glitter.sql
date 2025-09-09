/*
  # Données de test pour la plateforme MINJEC

  1. Données de test
    - Utilisateurs de test pour chaque type
    - Demandes d'inscription en attente avec noms djiboutiens
    - Agents CDC avec missions et activités
    - Associations avec projets
    - Logs d'activité réalistes
    - Notifications système

  2. Comptes de test
    - Admin: admin@minjec.gov.dj / admin123
    - Agents CDC avec différents statuts
    - Associations diverses
    - Utilisateurs standards

  3. Données réalistes
    - Noms djiboutiens authentiques
    - Secteurs d'activité locaux
    - Régions et communes de Djibouti
    - Activités culturelles et sportives
*/

-- Nettoyer les données existantes (optionnel)
-- DELETE FROM pending_users WHERE email LIKE '%test%' OR email LIKE '%example%';

-- Insérer des demandes d'inscription en attente avec des noms djiboutiens
INSERT INTO pending_users (id, email, username, user_type, user_id_or_registration, additional_info, status, created_at) VALUES
-- Demandes en attente récentes
('a1111111-1111-1111-1111-111111111111', 'ahmed.hassan@gmail.com', 'ahmed_hassan', 'cdc_agent', '123456789', '{"password": "AgentTest123!", "region": "Djibouti ville", "commune": "Balbala", "quartierCite": "Balbala 7"}', 'pending', now() - interval '2 hours'),
('a2222222-2222-2222-2222-222222222222', 'fatima.omar@yahoo.com', 'fatima_omar', 'association', '987654321', '{"password": "AssoTest123!", "associationName": "Association des Femmes de Djibouti", "activitySector": "Droits humains", "address": "Quartier 6, Djibouti", "phone": "+253 77 12 34 56"}', 'pending', now() - interval '1 day'),
('a3333333-3333-3333-3333-333333333333', 'mohamed.ali@hotmail.com', 'mohamed_ali', 'standard_user', '456789123', '{"password": "UserTest123!"}', 'pending', now() - interval '3 hours'),
('a4444444-4444-4444-4444-444444444444', 'khadija.said@gmail.com', 'khadija_said', 'cdc_agent', '789123456', '{"password": "AgentTest123!", "region": "Tadjourah"}', 'pending', now() - interval '30 minutes'),
('a5555555-5555-5555-5555-555555555555', 'ibrahim.moussa@outlook.com', 'ibrahim_moussa', 'association', '321654987', '{"password": "AssoTest123!", "associationName": "Club Sportif Jeunesse Djibouti", "activitySector": "Sport", "address": "Stade du Ville, Djibouti", "phone": "+253 77 98 76 54"}', 'pending', now() - interval '6 hours'),
('a6666666-6666-6666-6666-666666666666', 'amina.abdallah@gmail.com', 'amina_abdallah', 'cdc_agent', '147258369', '{"password": "AgentTest123!", "region": "Arta"}', 'pending', now() - interval '4 hours'),
('a7777777-7777-7777-7777-777777777777', 'omar.farah@yahoo.com', 'omar_farah', 'association', '963852741', '{"password": "AssoTest123!", "associationName": "Association Culturelle Somali", "activitySector": "Culture", "address": "Quartier 2, Djibouti", "phone": "+253 77 55 44 33"}', 'pending', now() - interval '8 hours'),
('a8888888-8888-8888-8888-888888888888', 'zahra.ismael@gmail.com', 'zahra_ismael', 'standard_user', '852741963', '{"password": "UserTest123!"}', 'pending', now() - interval '1 hour'),

-- Demandes approuvées avec codes de passerelle
('b1111111-1111-1111-1111-111111111111', 'agent.boulaos@minjec.gov.dj', 'agent_boulaos', 'cdc_agent', '111222333', '{"password": "AgentCDC123!", "region": "Djibouti ville", "commune": "Boulaos", "quartierCite": "Boulaos Centre"}', 'approved', now() - interval '2 days'),
('b2222222-2222-2222-2222-222222222222', 'asso.culture@minjec.gov.dj', 'asso_culture', 'association', '444555666', '{"password": "AssoTest123!", "associationName": "Association Culturelle Afar", "activitySector": "Culture", "address": "Quartier 4, Djibouti", "phone": "+253 77 11 22 33"}', 'approved', now() - interval '1 day'),
('b3333333-3333-3333-3333-333333333333', 'user.standard@minjec.gov.dj', 'user_standard', 'standard_user', '777888999', '{"password": "UserTest123!"}', 'approved', now() - interval '3 days'),
('b4444444-4444-4444-4444-444444444444', 'agent.tadjourah@minjec.gov.dj', 'agent_tadjourah', 'cdc_agent', '555666777', '{"password": "AgentCDC123!", "region": "Tadjourah"}', 'approved', now() - interval '5 days'),

-- Demandes rejetées avec raisons
('c1111111-1111-1111-1111-111111111111', 'rejected.user1@gmail.com', 'rejected_user1', 'standard_user', '000111222', '{"password": "RejectedTest123!"}', 'rejected', now() - interval '5 days'),
('c2222222-2222-2222-2222-222222222222', 'rejected.agent@gmail.com', 'rejected_agent', 'cdc_agent', '000333444', '{"password": "RejectedTest123!", "region": "Obock"}', 'rejected', now() - interval '3 days');

-- Mettre à jour les demandes approuvées avec des codes de passerelle
UPDATE pending_users SET 
  serial_number = '1234',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '2 days'
WHERE id = 'b1111111-1111-1111-1111-111111111111';

UPDATE pending_users SET 
  serial_number = '5678',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '1 day'
WHERE id = 'b2222222-2222-2222-2222-222222222222';

UPDATE pending_users SET 
  serial_number = '9012',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '3 days'
WHERE id = 'b3333333-3333-3333-3333-333333333333';

UPDATE pending_users SET 
  serial_number = '3456',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '5 days'
WHERE id = 'b4444444-4444-4444-4444-444444444444';

-- Mettre à jour les demandes rejetées avec raisons
UPDATE pending_users SET 
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '5 days',
  rejected_reason = 'Documents incomplets - CIN non valide'
WHERE id = 'c1111111-1111-1111-1111-111111111111';

UPDATE pending_users SET 
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '3 days',
  rejected_reason = 'Région non couverte actuellement'
WHERE id = 'c2222222-2222-2222-2222-222222222222';

-- Insérer des profils utilisateur pour les comptes approuvés
INSERT INTO user_profiles (id, user_type, username, user_id_or_registration, created_at) VALUES
('u1111111-1111-1111-1111-111111111111', 'cdc_agent', 'agent_boulaos', '111222333', now() - interval '2 days'),
('u2222222-2222-2222-2222-222222222222', 'association', 'asso_culture', '444555666', now() - interval '1 day'),
('u3333333-3333-3333-3333-333333333333', 'standard_user', 'user_standard', '777888999', now() - interval '3 days'),
('u4444444-4444-4444-4444-444444444444', 'cdc_agent', 'agent_tadjourah', '555666777', now() - interval '5 days');

-- Insérer des données spécifiques pour les agents CDC
INSERT INTO cdc_agents (id, user_id, matricule, department, status, hire_date, created_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'CDC001234', 'Djibouti ville - Boulaos (Boulaos Centre)', 'active', now() - interval '2 days', now() - interval '2 days'),
('d2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'CDC001235', 'Tadjourah', 'active', now() - interval '5 days', now() - interval '5 days');

-- Insérer des données spécifiques pour l'association
INSERT INTO associations (id, user_id, association_name, registration_number, legal_status, activity_sector, address, phone, status, registration_date, created_at) VALUES
('e1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'Association Culturelle Afar', 'ASS001234', 'Association', 'Culture', 'Quartier 4, Djibouti', '+253 77 11 22 33', 'approved', now() - interval '1 day', now() - interval '1 day');

-- Insérer des missions pour les agents CDC
INSERT INTO cdc_missions (id, agent_id, title, description, status, priority, due_date, assigned_by, created_at) VALUES
-- Missions pour agent Boulaos
('f1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Sensibilisation Jeunesse Quartier Boulaos', 'Organiser une campagne de sensibilisation sur l''entrepreneuriat jeune dans le quartier Boulaos', 'in_progress', 'high', current_date + interval '10 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 day'),
('f2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Formation Informatique Jeunes', 'Mettre en place une formation en informatique de base pour les jeunes', 'assigned', 'medium', current_date + interval '20 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '2 hours'),
('f3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Rapport Mensuel Novembre', 'Rédiger le rapport mensuel d''activités pour novembre', 'completed', 'medium', current_date - interval '5 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '10 days'),

-- Missions pour agent Tadjourah
('f4444444-4444-4444-4444-444444444444', 'd2222222-2222-2222-2222-222222222222', 'Projet Jeunesse Rurale', 'Développer un projet pour les jeunes des zones rurales de Tadjourah', 'assigned', 'high', current_date + interval '30 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '3 days'),
('f5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'Formation Agriculture Moderne', 'Organiser une formation sur les techniques agricoles modernes', 'in_progress', 'medium', current_date + interval '15 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 week');

-- Insérer des activités locales pour les agents CDC
INSERT INTO cdc_activities (id, agent_id, title, description, activity_type, target_audience, location, scheduled_date, status, participants_count, created_at) VALUES
-- Activités agent Boulaos
('g1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Atelier Entrepreneuriat Jeunes', 'Atelier de formation à l''entrepreneuriat pour les jeunes de 18-30 ans', 'formation', 'Jeunes 18-30 ans', 'Centre Communautaire Boulaos', current_date + interval '7 days', 'planned', 0, now() - interval '1 day'),
('g2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Réunion Comité de Quartier', 'Réunion mensuelle avec le comité de quartier pour discuter des projets jeunesse', 'reunion', 'Comité de quartier', 'Mairie de Boulaos', current_date + interval '3 days', 'planned', 0, now() - interval '3 hours'),
('g3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Tournoi de Football Jeunes', 'Organisation d''un tournoi de football pour les jeunes du quartier', 'evenement', 'Jeunes 15-25 ans', 'Terrain de Football Boulaos', current_date - interval '2 days', 'completed', 45, now() - interval '1 week'),
('g4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'Sensibilisation Santé Reproductive', 'Campagne de sensibilisation sur la santé reproductive des jeunes', 'sensibilisation', 'Jeunes 16-25 ans', 'Centre de Santé Boulaos', current_date - interval '1 week', 'completed', 32, now() - interval '2 weeks'),

-- Activités agent Tadjourah
('g5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'Formation Élevage Moderne', 'Formation sur les techniques d''élevage moderne pour les jeunes éleveurs', 'formation', 'Jeunes éleveurs', 'Centre Rural Tadjourah', current_date + interval '12 days', 'planned', 0, now() - interval '2 days'),
('g6666666-6666-6666-6666-666666666666', 'd2222222-2222-2222-2222-222222222222', 'Festival Culturel Afar', 'Organisation du festival culturel annuel de la communauté Afar', 'evenement', 'Communauté Afar', 'Place Centrale Tadjourah', current_date + interval '25 days', 'planned', 0, now() - interval '1 week');

-- Insérer des offres du ministère variées
INSERT INTO ministry_offers (id, title, description, offer_type, requirements, deadline, location, contact_info, is_active, created_by, created_at) VALUES
('h1111111-1111-1111-1111-111111111111', 'Programme de Formation en Leadership Jeunesse', 'Formation intensive de 2 semaines sur le leadership pour les jeunes leaders communautaires', 'formation', 'Âge: 20-35 ans, Expérience associative, Niveau baccalauréat minimum', current_date + interval '30 days', 'Centre de Formation MINJEC, Djibouti', 'leadership@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 week'),
('h2222222-2222-2222-2222-222222222222', 'Bourse d''Études Supérieures France', 'Bourses d''études pour poursuivre des études supérieures en France', 'bourse', 'Excellent dossier académique, Âge maximum: 25 ans, Niveau français B2', current_date + interval '45 days', 'Ambassade de France, Djibouti', 'bourses@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '3 days'),
('h3333333-3333-3333-3333-333333333333', 'Stage au Ministère de la Culture', 'Stage de 6 mois dans les services culturels du ministère', 'stage', 'Étudiant en dernière année, Domaine: Culture/Communication/Arts', current_date + interval '60 days', 'Ministère de la Culture, Djibouti', 'stage.culture@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '5 days'),
('h4444444-4444-4444-4444-444444444444', 'Formation Entrepreneuriat Féminin', 'Programme spécialisé pour l''entrepreneuriat féminin', 'formation', 'Femmes 18-45 ans, Projet d''entreprise défini', current_date + interval '20 days', 'Centre des Femmes, Djibouti', 'femmes@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '2 days'),
('h5555555-5555-5555-5555-555555555555', 'Concours Innovation Technologique', 'Concours d''innovation pour les jeunes développeurs et entrepreneurs tech', 'autre', 'Âge: 18-30 ans, Projet technologique innovant', current_date + interval '40 days', 'Incubateur Tech Djibouti', 'innovation@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 day');

-- Insérer des candidatures soumises par les agents
INSERT INTO offer_applications (id, offer_id, agent_id, applicant_name, applicant_cin, applicant_phone, applicant_email, applicant_gender, applicant_education, status, submitted_at, notes) VALUES
-- Candidatures soumises par agent Boulaos
('i1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Amina Abdallah Mohamed', '123987456', '+253 77 55 44 33', 'amina.abdallah@gmail.com', 'femme', 'Licence en Sociologie', 'submitted', now() - interval '2 days', 'Candidate très motivée avec expérience associative dans le quartier'),
('i2222222-2222-2222-2222-222222222222', 'h2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Omar Farah Hassan', '654321789', '+253 77 66 55 44', 'omar.farah@gmail.com', 'homme', 'Master en Informatique', 'under_review', now() - interval '1 day', 'Excellent dossier académique, projet d''études en IA'),
('i3333333-3333-3333-3333-333333333333', 'h3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Zahra Ismael Ali', '789456123', '+253 77 33 22 11', 'zahra.ismael@gmail.com', 'femme', 'Licence en Arts et Culture', 'accepted', now() - interval '3 days', 'Profil parfait pour le stage culture, très créative'),
('i4444444-4444-4444-4444-444444444444', 'h4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'Maryam Said Omar', '456123789', '+253 77 88 99 00', 'maryam.said@gmail.com', 'femme', 'BTS Commerce', 'submitted', now() - interval '1 day', 'Projet de boutique en ligne pour produits locaux'),

-- Candidatures soumises par agent Tadjourah
('i5555555-5555-5555-5555-555555555555', 'h5555555-5555-5555-5555-555555555555', 'd2222222-2222-2222-2222-222222222222', 'Hassan Ahmed Moussa', '321789654', '+253 77 44 55 66', 'hassan.ahmed@gmail.com', 'homme', 'Licence en Informatique', 'submitted', now() - interval '4 hours', 'Développeur autodidacte avec plusieurs projets personnels'),
('i6666666-6666-6666-6666-666666666666', 'h1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'Faduma Ali Hersi', '987123654', '+253 77 22 33 44', 'faduma.ali@gmail.com', 'femme', 'Licence en Gestion', 'under_review', now() - interval '3 days', 'Leader communautaire reconnue à Tadjourah');

-- Insérer des rapports pour les agents CDC
INSERT INTO cdc_reports (id, agent_id, title, report_type, content, period_start, period_end, status, submitted_at, created_at) VALUES
-- Rapports agent Boulaos
('j1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Rapport Mensuel - Novembre 2024', 'monthly', 'ACTIVITÉS RÉALISÉES EN NOVEMBRE:\n\n1. ÉVÉNEMENTS SPORTIFS\n   - Tournoi de football jeunes: 45 participants (8 équipes)\n   - Formation arbitrage: 12 jeunes formés\n   - Championnat inter-quartiers: en préparation\n\n2. FORMATIONS\n   - Atelier entrepreneuriat: 30 jeunes touchés\n   - Session informatique de base: 25 participants\n   - Formation leadership: 18 jeunes leaders\n\n3. RÉUNIONS COMMUNAUTAIRES\n   - 3 réunions avec le comité de quartier\n   - 2 rencontres avec les associations locales\n   - 1 assemblée générale des jeunes\n\n4. PROJETS EN COURS\n   - Création d''un centre multimédia: 60% avancé\n   - Programme de mentorat: 15 binômes formés\n   - Jardin communautaire: phase de plantation\n\nDÉFIS RENCONTRÉS:\n- Manque de matériel informatique\n- Besoin de formation supplémentaire pour les formateurs\n- Transport difficile pour certaines activités\n\nRECOMMANDATIONS:\n- Augmenter le budget équipement informatique\n- Organiser plus de formations pour les encadreurs\n- Améliorer la coordination avec les transports publics', current_date - interval '1 month', current_date, 'submitted', now() - interval '5 days', now() - interval '5 days'),

('j2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Rapport d''Activité - Tournoi Football', 'activity', 'RAPPORT DÉTAILLÉ DU TOURNOI DE FOOTBALL\n\nDATE: Weekend dernier\nLIEU: Terrain de Football Boulaos\nDURÉE: 2 jours\n\nPARTICIPANTS:\n- 45 jeunes (8 équipes)\n- Âge: 15-25 ans\n- Mixité: 35 garçons, 10 filles\n\nORGANISATION:\n- Phase de groupes: 8 équipes réparties en 2 poules\n- Demi-finales et finale\n- Remise de prix et certificats\n\nRÉSULTATS POSITIFS:\n- Excellent engagement des jeunes\n- Renforcement des liens communautaires\n- Découverte de nouveaux talents sportifs\n- Participation active des familles\n\nSUIVI ET IMPACT:\n- 12 jeunes intéressés par une formation d''arbitrage\n- Demande de création d''un championnat régulier\n- 3 jeunes filles motivées pour rejoindre l''équipe féminine\n- Proposition de partenariat avec le club local\n\nBUDGET UTILISÉ:\n- Matériel sportif: 15,000 DJF\n- Rafraîchissements: 8,000 DJF\n- Prix et certificats: 5,000 DJF\nTOTAL: 28,000 DJF', current_date - interval '1 week', current_date - interval '1 week', 'reviewed', now() - interval '3 days', now() - interval '1 week'),

-- Rapports agent Tadjourah
('j3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 'Rapport Mensuel - Novembre 2024', 'monthly', 'ACTIVITÉS RÉALISÉES À TADJOURAH:\n\n1. AGRICULTURE ET ÉLEVAGE\n   - Formation techniques modernes: 28 jeunes agriculteurs\n   - Distribution de semences améliorées: 15 familles\n   - Suivi des projets d''élevage: 8 projets actifs\n\n2. CULTURE ET TRADITIONS\n   - Préparation festival culturel Afar: comité formé\n   - Collecte de témoignages anciens: 25 entretiens\n   - Atelier artisanat traditionnel: 20 participants\n\n3. DÉVELOPPEMENT COMMUNAUTAIRE\n   - Réhabilitation puits communautaire: 80% terminé\n   - Formation gestion coopérative: 22 membres formés\n   - Projet énergie solaire: étude de faisabilité\n\nPARTENARIATS:\n- Coopération avec l''ONG WaterAid\n- Collaboration avec l''Université de Djibouti\n- Partenariat avec les autorités locales\n\nDÉFIS SPÉCIFIQUES:\n- Distances importantes entre villages\n- Accès limité à l''électricité\n- Besoin de traducteurs pour certaines communautés\n\nPROJETS FUTURS:\n- Extension du réseau de formation\n- Création d''un centre de ressources\n- Programme d''échange inter-régional', current_date - interval '1 month', current_date, 'submitted', now() - interval '3 days', now() - interval '3 days');

-- Insérer des notifications système réalistes
INSERT INTO system_notifications (id, type, recipient, title, message, data, status, created_at) VALUES
('k1111111-1111-1111-1111-111111111111', 'new_registration', 'admin@minjec.gov.dj', 'Nouvelle demande - Agent CDC', 'Ahmed Hassan a soumis une demande d''inscription en tant qu''Agent CDC pour la région de Djibouti ville', '{"username": "ahmed_hassan", "user_type": "cdc_agent", "region": "Djibouti ville", "commune": "Balbala"}', 'sent', now() - interval '2 hours'),
('k2222222-2222-2222-2222-222222222222', 'new_registration', 'admin@minjec.gov.dj', 'Nouvelle demande - Association', 'Fatima Omar a soumis une demande d''inscription pour l''Association des Femmes de Djibouti', '{"username": "fatima_omar", "user_type": "association", "association_name": "Association des Femmes de Djibouti", "sector": "Droits humains"}', 'sent', now() - interval '1 day'),
('k3333333-3333-3333-3333-333333333333', 'new_registration', 'admin@minjec.gov.dj', 'Nouvelle demande - Utilisateur Standard', 'Mohamed Ali a soumis une demande d''inscription en tant qu''utilisateur standard', '{"username": "mohamed_ali", "user_type": "standard_user"}', 'sent', now() - interval '3 hours'),
('k4444444-4444-4444-4444-444444444444', 'system', 'agent.boulaos@minjec.gov.dj', 'Nouvelle mission assignée', 'Une nouvelle mission vous a été assignée: Formation Informatique Jeunes', '{"mission_id": "f2222222-2222-2222-2222-222222222222", "priority": "medium", "due_date": "dans 20 jours"}', 'sent', now() - interval '2 hours'),
('k5555555-5555-5555-5555-555555555555', 'system', 'agent.tadjourah@minjec.gov.dj', 'Rapport en retard', 'Votre rapport mensuel d''octobre est en retard. Merci de le soumettre rapidement.', '{"report_type": "monthly", "period": "octobre 2024"}', 'sent', now() - interval '1 day');

-- Insérer des logs d'activité détaillés
INSERT INTO activity_logs (id, user_id, action_type, target_type, target_id, description, metadata, created_at) VALUES
-- Logs d'approbation
('l1111111-1111-1111-1111-111111111111', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), 'APPROVE', 'USER_REQUEST', 'b1111111-1111-1111-1111-111111111111', 'Demande d''agent CDC approuvée: agent_boulaos (Djibouti ville - Boulaos)', '{"serial_number": "1234", "user_type": "cdc_agent", "region": "Djibouti ville"}', now() - interval '2 days'),
('l2222222-2222-2222-2222-222222222222', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), 'APPROVE', 'USER_REQUEST', 'b2222222-2222-2222-2222-222222222222', 'Demande d''association approuvée: asso_culture (Association Culturelle Afar)', '{"serial_number": "5678", "user_type": "association", "sector": "Culture"}', now() - interval '1 day'),
('l3333333-3333-3333-3333-333333333333', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), 'REJECT', 'USER_REQUEST', 'c1111111-1111-1111-1111-111111111111', 'Demande d''utilisateur rejetée: Documents incomplets - CIN non valide', '{"rejection_reason": "Documents incomplets - CIN non valide", "user_type": "standard_user"}', now() - interval '5 days'),

-- Logs d'activités des agents
('l4444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'CREATE', 'ACTIVITY', 'g3333333-3333-3333-3333-333333333333', 'Activité créée: Tournoi de Football Jeunes (45 participants)', '{"activity_type": "evenement", "participants": 45, "location": "Boulaos"}', now() - interval '1 week'),
('l5555555-5555-5555-5555-555555555555', 'u1111111-1111-1111-1111-111111111111', 'SUBMIT', 'REPORT', 'j1111111-1111-1111-1111-111111111111', 'Rapport mensuel soumis: Novembre 2024 (Boulaos)', '{"report_type": "monthly", "period": "novembre 2024", "location": "Boulaos"}', now() - interval '5 days'),
('l6666666-6666-6666-6666-666666666666', 'u4444444-4444-4444-4444-444444444444', 'CREATE', 'ACTIVITY', 'g5555555-5555-5555-5555-555555555555', 'Activité planifiée: Formation Élevage Moderne (Tadjourah)', '{"activity_type": "formation", "target": "Jeunes éleveurs", "location": "Tadjourah"}', now() - interval '2 days'),

-- Logs de candidatures
('l7777777-7777-7777-7777-777777777777', 'u1111111-1111-1111-1111-111111111111', 'SUBMIT', 'APPLICATION', 'i1111111-1111-1111-1111-111111111111', 'Candidature soumise pour Amina Abdallah - Formation Leadership', '{"applicant": "Amina Abdallah Mohamed", "offer": "Formation Leadership", "agent_location": "Boulaos"}', now() - interval '2 days'),
('l8888888-8888-8888-8888-888888888888', 'u1111111-1111-1111-1111-111111111111', 'SUBMIT', 'APPLICATION', 'i2222222-2222-2222-2222-222222222222', 'Candidature soumise pour Omar Farah - Bourse d''Études France', '{"applicant": "Omar Farah Hassan", "offer": "Bourse France", "education": "Master Informatique"}', now() - interval '1 day');

-- Insérer des notifications CDC pour les agents
INSERT INTO cdc_notifications (id, recipient_id, title, message, type, is_read, created_at) VALUES
-- Notifications agent Boulaos
('m1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'Nouvelle mission assignée', 'Une nouvelle mission vous a été assignée: Formation Informatique Jeunes. Échéance: dans 20 jours.', 'info', false, now() - interval '2 hours'),
('m2222222-2222-2222-2222-222222222222', 'u1111111-1111-1111-1111-111111111111', 'Rapport approuvé', 'Votre rapport mensuel de novembre a été approuvé par l''administration. Excellent travail!', 'success', true, now() - interval '1 day'),
('m3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'Rappel: Mission en cours', 'N''oubliez pas votre mission de sensibilisation dans le quartier Boulaos. Échéance dans 10 jours.', 'warning', false, now() - interval '6 hours'),
('m4444444-4444-4444-4444-444444444444', 'u1111111-1111-1111-1111-111111111111', 'Candidature acceptée', 'La candidature de Zahra Ismael pour le stage culture a été acceptée. Félicitations!', 'success', false, now() - interval '3 days'),

-- Notifications agent Tadjourah
('m5555555-5555-5555-5555-555555555555', 'u4444444-4444-4444-4444-444444444444', 'Nouveau projet approuvé', 'Votre projet "Jeunesse Rurale Tadjourah" a été approuvé. Budget alloué: 500,000 DJF', 'success', false, now() - interval '3 days'),
('m6666666-6666-6666-6666-666666666666', 'u4444444-4444-4444-4444-444444444444', 'Formation requise', 'Une formation sur les nouvelles techniques agricoles est programmée le mois prochain.', 'info', true, now() - interval '1 week'),
('m7777777-7777-7777-7777-777777777777', 'u4444444-4444-4444-4444-444444444444', 'Rappel: Festival culturel', 'Préparation du Festival Culturel Afar - Réunion de coordination prévue demain.', 'warning', false, now() - interval '12 hours');

-- Insérer des codes OTP de test (expirés pour la sécurité)
INSERT INTO otp_codes (id, email, otp_code, type, expires_at, used, verified_at, created_at) VALUES
('n1111111-1111-1111-1111-111111111111', 'agent.boulaos@minjec.gov.dj', '1234', 'approval', now() - interval '1 hour', true, now() - interval '2 days', now() - interval '2 days'),
('n2222222-2222-2222-2222-222222222222', 'asso.culture@minjec.gov.dj', '5678', 'approval', now() - interval '1 hour', true, now() - interval '1 day', now() - interval '1 day'),
('n3333333-3333-3333-3333-333333333333', 'user.standard@minjec.gov.dj', '9012', 'approval', now() - interval '1 hour', true, now() - interval '3 days', now() - interval '3 days'),
('n4444444-4444-4444-4444-444444444444', 'agent.tadjourah@minjec.gov.dj', '3456', 'approval', now() - interval '1 hour', true, now() - interval '5 days', now() - interval '5 days');

-- Insérer des emails de notification dans l'historique
INSERT INTO email_notifications (id, recipient_email, subject, content, email_type, sent_at, status, related_user_id, gateway_code, metadata, created_at) VALUES
('o1111111-1111-1111-1111-111111111111', 'agent.boulaos@minjec.gov.dj', 'Inscription Approuvée - Code de Passerelle MINJEC', 'Votre inscription en tant qu''Agent CDC a été approuvée. Code de passerelle: 1234', 'approval', now() - interval '2 days', 'sent', 'u1111111-1111-1111-1111-111111111111', '1234', '{"username": "agent_boulaos", "user_type": "cdc_agent", "region": "Djibouti ville"}', now() - interval '2 days'),
('o2222222-2222-2222-2222-222222222222', 'asso.culture@minjec.gov.dj', 'Inscription Approuvée - Code de Passerelle MINJEC', 'Votre inscription en tant qu''Association a été approuvée. Code de passerelle: 5678', 'approval', now() - interval '1 day', 'sent', 'u2222222-2222-2222-2222-222222222222', '5678', '{"username": "asso_culture", "user_type": "association", "sector": "Culture"}', now() - interval '1 day'),
('o3333333-3333-3333-3333-333333333333', 'rejected.user1@gmail.com', 'Inscription Non Approuvée - MINJEC', 'Votre demande d''inscription n''a pas pu être approuvée. Raison: Documents incomplets - CIN non valide', 'rejection', now() - interval '5 days', 'sent', null, null, '{"username": "rejected_user1", "rejection_reason": "Documents incomplets - CIN non valide"}', now() - interval '5 days'),
('o4444444-4444-4444-4444-444444444444', 'admin@minjec.gov.dj', 'Nouvelle demande d''inscription - Agent CDC - Ahmed Hassan', 'Ahmed Hassan a soumis une demande d''inscription en tant qu''Agent CDC', 'general', now() - interval '2 hours', 'sent', null, null, '{"notification_type": "admin_alert", "user_type": "cdc_agent"}', now() - interval '2 hours');

-- Ajouter quelques offres supplémentaires pour enrichir les tests
INSERT INTO ministry_offers (id, title, description, offer_type, requirements, deadline, location, contact_info, is_active, created_by, created_at) VALUES
('h6666666-6666-6666-6666-666666666666', 'Programme Volontariat International', 'Opportunité de volontariat dans des organisations internationales', 'autre', 'Âge: 22-28 ans, Langues: Français + Anglais, Expérience associative', current_date + interval '35 days', 'Bureau des Relations Internationales', 'international@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '4 days'),
('h7777777-7777-7777-7777-777777777777', 'Concours Meilleur Projet Jeunesse', 'Concours national pour récompenser les meilleurs projets portés par des jeunes', 'autre', 'Âge: 18-35 ans, Projet innovant, Impact social démontré', current_date + interval '50 days', 'Palais du Peuple, Djibouti', 'concours@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '6 days'),
('h8888888-8888-8888-8888-888888888888', 'Formation Gestion de Projet', 'Formation certifiante en gestion de projet pour les responsables associatifs', 'formation', 'Responsable associatif, Expérience minimum 2 ans', current_date + interval '25 days', 'Centre de Formation Continue', 'formation@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 week');

-- Ajouter plus de candidatures pour tester les différents statuts
INSERT INTO offer_applications (id, offer_id, agent_id, applicant_name, applicant_cin, applicant_phone, applicant_email, applicant_gender, applicant_education, status, submitted_at, reviewed_at, notes) VALUES
('i7777777-7777-7777-7777-777777777777', 'h6666666-6666-6666-6666-666666666666', 'd1111111-1111-1111-1111-111111111111', 'Youssouf Ahmed Dini', '159753486', '+253 77 11 88 99', 'youssouf.ahmed@gmail.com', 'homme', 'Master en Relations Internationales', 'accepted', now() - interval '1 week', now() - interval '2 days', 'Profil excellent pour le volontariat international'),
('i8888888-8888-8888-8888-888888888888', 'h7777777-7777-7777-7777-777777777777', 'd2222222-2222-2222-2222-222222222222', 'Hodan Abdillahi Omar', '753159486', '+253 77 99 88 77', 'hodan.abdillahi@gmail.com', 'femme', 'Licence en Développement Social', 'submitted', now() - interval '2 days', null, 'Projet innovant de jardins communautaires'),
('i9999999-9999-9999-9999-999999999999', 'h8888888-8888-8888-8888-888888888888', 'd1111111-1111-1111-1111-111111111111', 'Abdourahman Said Hassan', '486159753', '+253 77 66 77 88', 'abdourahman.said@gmail.com', 'homme', 'BTS Gestion', 'rejected', now() - interval '1 week', now() - interval '3 days', 'Expérience insuffisante en gestion de projet');