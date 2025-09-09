/*
  # Données de test pour la plateforme MINJEC

  1. Données de test
    - Utilisateurs de test pour chaque type
    - Demandes d'inscription en attente
    - Agents CDC avec missions et activités
    - Associations avec projets
    - Logs d'activité
    - Notifications système

  2. Comptes de test
    - Admin: admin@minjec.gov.dj / admin123
    - Agent CDC: agent.test@minjec.gov.dj / AgentCDC123!
    - Association: asso.test@minjec.gov.dj / AssoTest123!
    - Utilisateur: user.test@minjec.gov.dj / UserTest123!

  3. Données réalistes
    - Noms djiboutiens authentiques
    - Secteurs d'activité locaux
    - Régions et communes de Djibouti
*/

-- Insérer des demandes d'inscription en attente
INSERT INTO pending_users (id, email, username, user_type, user_id_or_registration, additional_info, status, created_at) VALUES
-- Demandes en attente
('11111111-1111-1111-1111-111111111111', 'ahmed.hassan@gmail.com', 'ahmed_hassan', 'cdc_agent', '123456789', '{"password": "AgentTest123!", "region": "Djibouti ville", "commune": "Balbala", "quartierCite": "Balbala 7"}', 'pending', now() - interval '2 hours'),
('22222222-2222-2222-2222-222222222222', 'fatima.omar@yahoo.com', 'fatima_omar', 'association', '987654321', '{"password": "AssoTest123!", "associationName": "Association des Femmes de Djibouti", "activitySector": "Droits humains", "address": "Quartier 6, Djibouti", "phone": "+253 77 12 34 56"}', 'pending', now() - interval '1 day'),
('33333333-3333-3333-3333-333333333333', 'mohamed.ali@hotmail.com', 'mohamed_ali', 'standard_user', '456789123', '{"password": "UserTest123!"}', 'pending', now() - interval '3 hours'),
('44444444-4444-4444-4444-444444444444', 'khadija.said@gmail.com', 'khadija_said', 'cdc_agent', '789123456', '{"password": "AgentTest123!", "region": "Tadjourah", "commune": "", "quartierCite": ""}', 'pending', now() - interval '30 minutes'),
('55555555-5555-5555-5555-555555555555', 'ibrahim.moussa@outlook.com', 'ibrahim_moussa', 'association', '321654987', '{"password": "AssoTest123!", "associationName": "Club Sportif Jeunesse", "activitySector": "Sport", "address": "Stade du Ville, Djibouti", "phone": "+253 77 98 76 54"}', 'pending', now() - interval '6 hours'),

-- Demandes approuvées (avec codes de passerelle)
('66666666-6666-6666-6666-666666666666', 'agent.test@minjec.gov.dj', 'agent_test', 'cdc_agent', '111222333', '{"password": "AgentCDC123!", "region": "Djibouti ville", "commune": "Boulaos", "quartierCite": "Boulaos Centre"}', 'approved', now() - interval '2 days'),
('77777777-7777-7777-7777-777777777777', 'asso.test@minjec.gov.dj', 'asso_test', 'association', '444555666', '{"password": "AssoTest123!", "associationName": "Association Culturelle Afar", "activitySector": "Culture", "address": "Quartier 4, Djibouti", "phone": "+253 77 11 22 33"}', 'approved', now() - interval '1 day'),
('88888888-8888-8888-8888-888888888888', 'user.test@minjec.gov.dj', 'user_test', 'standard_user', '777888999', '{"password": "UserTest123!"}', 'approved', now() - interval '3 days'),

-- Demandes rejetées
('99999999-9999-9999-9999-999999999999', 'rejected.user@gmail.com', 'rejected_user', 'standard_user', '000111222', '{"password": "RejectedTest123!"}', 'rejected', now() - interval '5 days');

-- Mettre à jour les demandes approuvées avec des codes de passerelle et des informations d'approbation
UPDATE pending_users SET 
  serial_number = '1234',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '2 days'
WHERE id = '66666666-6666-6666-6666-666666666666';

UPDATE pending_users SET 
  serial_number = '5678',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '1 day'
WHERE id = '77777777-7777-7777-7777-777777777777';

UPDATE pending_users SET 
  serial_number = '9012',
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '3 days'
WHERE id = '88888888-8888-8888-8888-888888888888';

-- Mettre à jour la demande rejetée
UPDATE pending_users SET 
  approved_by = (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1),
  approved_at = now() - interval '5 days',
  rejected_reason = 'Documents incomplets - CIN non valide'
WHERE id = '99999999-9999-9999-9999-999999999999';

-- Insérer des profils utilisateur pour les comptes approuvés
INSERT INTO user_profiles (id, user_type, username, user_id_or_registration, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cdc_agent', 'agent_test', '111222333', now() - interval '2 days'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'association', 'asso_test', '444555666', now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'standard_user', 'user_test', '777888999', now() - interval '3 days');

-- Insérer des données spécifiques pour l'agent CDC
INSERT INTO cdc_agents (id, user_id, matricule, department, status, hire_date, created_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CDC001234', 'Djibouti ville - Boulaos (Boulaos Centre)', 'active', now() - interval '2 days', now() - interval '2 days');

-- Insérer des données spécifiques pour l'association
INSERT INTO associations (id, user_id, association_name, registration_number, legal_status, activity_sector, address, phone, status, registration_date, created_at) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Association Culturelle Afar', 'ASS001234', 'Association', 'Culture', 'Quartier 4, Djibouti', '+253 77 11 22 33', 'approved', now() - interval '1 day', now() - interval '1 day');

-- Insérer des missions pour l'agent CDC
INSERT INTO cdc_missions (id, agent_id, title, description, status, priority, due_date, assigned_by, created_at) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sensibilisation Jeunesse Quartier Boulaos', 'Organiser une campagne de sensibilisation sur l''entrepreneuriat jeune dans le quartier Boulaos', 'in_progress', 'high', current_date + interval '10 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 day'),
('10101010-1010-1010-1010-101010101010', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Formation Informatique', 'Mettre en place une formation en informatique de base pour les jeunes', 'assigned', 'medium', current_date + interval '20 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '2 hours'),
('11111111-1111-1111-1111-111111111112', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rapport Mensuel Octobre', 'Rédiger le rapport mensuel d''activités pour octobre', 'completed', 'medium', current_date - interval '5 days', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '10 days');

-- Insérer des activités locales pour l'agent CDC
INSERT INTO cdc_activities (id, agent_id, title, description, activity_type, target_audience, location, scheduled_date, status, participants_count, created_at) VALUES
('12121212-1212-1212-1212-121212121212', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Atelier Entrepreneuriat Jeunes', 'Atelier de formation à l''entrepreneuriat pour les jeunes de 18-30 ans', 'formation', 'Jeunes 18-30 ans', 'Centre Communautaire Boulaos', current_date + interval '7 days', 'planned', 0, now() - interval '1 day'),
('13131313-1313-1313-1313-131313131313', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Réunion Comité de Quartier', 'Réunion mensuelle avec le comité de quartier pour discuter des projets jeunesse', 'reunion', 'Comité de quartier', 'Mairie de Boulaos', current_date + interval '3 days', 'planned', 0, now() - interval '3 hours'),
('14141414-1414-1414-1414-141414141414', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Tournoi de Football Jeunes', 'Organisation d''un tournoi de football pour les jeunes du quartier', 'evenement', 'Jeunes 15-25 ans', 'Terrain de Football Boulaos', current_date - interval '2 days', 'completed', 45, now() - interval '1 week');

-- Insérer des offres du ministère
INSERT INTO ministry_offers (id, title, description, offer_type, requirements, deadline, location, contact_info, is_active, created_by, created_at) VALUES
('15151515-1515-1515-1515-151515151515', 'Programme de Formation en Leadership', 'Formation intensive de 2 semaines sur le leadership pour les jeunes leaders communautaires', 'formation', 'Âge: 20-35 ans, Expérience associative, Niveau baccalauréat minimum', current_date + interval '30 days', 'Centre de Formation MINJEC, Djibouti', 'leadership@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '1 week'),
('16161616-1616-1616-1616-161616161616', 'Bourse d''Études Supérieures', 'Bourses d''études pour poursuivre des études supérieures à l''étranger', 'bourse', 'Excellent dossier académique, Âge maximum: 25 ans, Projet d''études défini', current_date + interval '45 days', 'Université de Djibouti', 'bourses@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '3 days'),
('17171717-1717-1717-1717-171717171717', 'Stage au Ministère de la Culture', 'Stage de 6 mois dans les services culturels du ministère', 'stage', 'Étudiant en dernière année, Domaine: Culture/Communication/Arts', current_date + interval '60 days', 'Ministère de la Culture, Djibouti', 'stage.culture@minjec.gov.dj', true, (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), now() - interval '5 days');

-- Insérer des candidatures soumises par l'agent
INSERT INTO offer_applications (id, offer_id, agent_id, applicant_name, applicant_cin, applicant_phone, applicant_email, applicant_gender, applicant_education, status, submitted_at, notes) VALUES
('18181818-1818-1818-1818-181818181818', '15151515-1515-1515-1515-151515151515', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Amina Abdallah', '123987456', '+253 77 55 44 33', 'amina.abdallah@gmail.com', 'femme', 'Licence en Sociologie', 'submitted', now() - interval '2 days', 'Candidate très motivée avec expérience associative'),
('19191919-1919-1919-1919-191919191919', '16161616-1616-1616-1616-161616161616', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Omar Farah', '654321789', '+253 77 66 55 44', 'omar.farah@gmail.com', 'homme', 'Master en Informatique', 'under_review', now() - interval '1 day', 'Excellent dossier académique, projet d''études en IA'),
('20202020-2020-2020-2020-202020202020', '17171717-1717-1717-1717-171717171717', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Zahra Ismael', '789456123', '+253 77 33 22 11', 'zahra.ismael@gmail.com', 'femme', 'Licence en Arts et Culture', 'accepted', now() - interval '3 days', 'Profil parfait pour le stage culture');

-- Insérer des rapports pour l'agent CDC
INSERT INTO cdc_reports (id, agent_id, title, report_type, content, period_start, period_end, status, submitted_at, created_at) VALUES
('21212121-2121-2121-2121-212121212121', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rapport Mensuel - Octobre 2024', 'monthly', 'Activités réalisées en octobre:\n\n1. Tournoi de football jeunes - 45 participants\n2. 3 réunions avec le comité de quartier\n3. Sensibilisation sur l''entrepreneuriat - 30 jeunes touchés\n4. Suivi de 5 projets jeunesse\n\nDéfis rencontrés:\n- Manque de matériel sportif\n- Besoin de formation supplémentaire\n\nRecommandations:\n- Augmenter le budget équipement\n- Organiser plus de formations', current_date - interval '1 month', current_date, 'submitted', now() - interval '5 days', now() - interval '5 days'),
('22222222-2222-2222-2222-222222222223', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rapport d''Activité - Tournoi Football', 'activity', 'Rapport détaillé du tournoi de football organisé le weekend dernier:\n\nParticipants: 45 jeunes (8 équipes)\nÂge: 15-25 ans\nDurée: 2 jours\n\nRésultats:\n- Excellent engagement des jeunes\n- Renforcement des liens communautaires\n- Découverte de nouveaux talents\n\nSuivi:\n- 12 jeunes intéressés par une formation d''arbitrage\n- Demande de création d''un championnat régulier', current_date - interval '1 week', current_date - interval '1 week', 'reviewed', now() - interval '3 days', now() - interval '1 week');

-- Insérer des notifications système
INSERT INTO system_notifications (id, type, recipient, title, message, data, status, created_at) VALUES
('23232323-2323-2323-2323-232323232323', 'new_registration', 'admin@minjec.gov.dj', 'Nouvelle demande d''inscription - Agent CDC', 'Ahmed Hassan a soumis une demande d''inscription en tant qu''Agent CDC', '{"username": "ahmed_hassan", "user_type": "cdc_agent", "region": "Djibouti ville"}', 'sent', now() - interval '2 hours'),
('24242424-2424-2424-2424-242424242424', 'new_registration', 'admin@minjec.gov.dj', 'Nouvelle demande d''inscription - Association', 'Fatima Omar a soumis une demande d''inscription pour une association', '{"username": "fatima_omar", "user_type": "association", "association_name": "Association des Femmes de Djibouti"}', 'sent', now() - interval '1 day'),
('25252525-2525-2525-2525-252525252525', 'system', 'agent.test@minjec.gov.dj', 'Nouvelle mission assignée', 'Une nouvelle mission vous a été assignée: Formation Informatique', '{"mission_id": "10101010-1010-1010-1010-101010101010", "priority": "medium"}', 'sent', now() - interval '2 hours');

-- Insérer des logs d'activité
INSERT INTO activity_logs (id, user_id, action_type, target_type, target_id, description, metadata, created_at) VALUES
('26262626-2626-2626-2626-262626262626', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), 'APPROVE', 'USER_REQUEST', '66666666-6666-6666-6666-666666666666', 'Demande d''utilisateur approuvée: agent_test (cdc_agent)', '{"serial_number": "1234", "user_type": "cdc_agent"}', now() - interval '2 days'),
('27272727-2727-2727-2727-272727272727', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), 'APPROVE', 'USER_REQUEST', '77777777-7777-7777-7777-777777777777', 'Demande d''utilisateur approuvée: asso_test (association)', '{"serial_number": "5678", "user_type": "association"}', now() - interval '1 day'),
('28282828-2828-2828-2828-282828282828', (SELECT id FROM user_profiles WHERE user_type = 'admin' LIMIT 1), 'REJECT', 'USER_REQUEST', '99999999-9999-9999-9999-999999999999', 'Demande d''utilisateur rejetée: Documents incomplets', '{"rejection_reason": "Documents incomplets - CIN non valide"}', now() - interval '5 days'),
('29292929-2929-2929-2929-292929292929', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CREATE', 'ACTIVITY', '14141414-1414-1414-1414-141414141414', 'Activité créée: Tournoi de Football Jeunes', '{"activity_type": "evenement", "participants": 45}', now() - interval '1 week'),
('30303030-3030-3030-3030-303030303030', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SUBMIT', 'REPORT', '21212121-2121-2121-2121-212121212121', 'Rapport soumis: Rapport Mensuel - Octobre 2024', '{"report_type": "monthly"}', now() - interval '5 days');

-- Insérer des notifications CDC pour l'agent
INSERT INTO cdc_notifications (id, recipient_id, title, message, type, is_read, created_at) VALUES
('31313131-3131-3131-3131-313131313131', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nouvelle mission assignée', 'Une nouvelle mission vous a été assignée: Formation Informatique. Échéance: dans 20 jours.', 'info', false, now() - interval '2 hours'),
('32323232-3232-3232-3232-323232323232', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rapport approuvé', 'Votre rapport mensuel d''octobre a été approuvé par l''administration.', 'success', true, now() - interval '1 day'),
('33333333-3333-3333-3333-333333333334', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rappel: Mission en cours', 'N''oubliez pas votre mission de sensibilisation dans le quartier Boulaos. Échéance dans 10 jours.', 'warning', false, now() - interval '6 hours');

-- Insérer des codes OTP de test (expirés pour la sécurité)
INSERT INTO otp_codes (id, email, otp_code, type, expires_at, used, created_at) VALUES
('34343434-3434-3434-3434-343434343434', 'agent.test@minjec.gov.dj', '1234', 'approval', now() - interval '1 hour', true, now() - interval '2 days'),
('35353535-3535-3535-3535-353535353535', 'asso.test@minjec.gov.dj', '5678', 'approval', now() - interval '1 hour', true, now() - interval '1 day'),
('36363636-3636-3636-3636-363636363636', 'user.test@minjec.gov.dj', '9012', 'approval', now() - interval '1 hour', true, now() - interval '3 days');

-- Insérer des emails de notification dans l'historique
INSERT INTO email_notifications (id, recipient_email, subject, content, email_type, sent_at, status, related_user_id, gateway_code, metadata, created_at) VALUES
('37373737-3737-3737-3737-373737373737', 'agent.test@minjec.gov.dj', 'Inscription Approuvée - Code de Passerelle MINJEC', 'Votre inscription en tant qu''Agent CDC a été approuvée. Code de passerelle: 1234', 'approval', now() - interval '2 days', 'sent', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1234', '{"username": "agent_test", "user_type": "cdc_agent"}', now() - interval '2 days'),
('38383838-3838-3838-3838-383838383838', 'asso.test@minjec.gov.dj', 'Inscription Approuvée - Code de Passerelle MINJEC', 'Votre inscription en tant qu''Association a été approuvée. Code de passerelle: 5678', 'approval', now() - interval '1 day', 'sent', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '5678', '{"username": "asso_test", "user_type": "association"}', now() - interval '1 day'),
('39393939-3939-3939-3939-393939393939', 'rejected.user@gmail.com', 'Inscription Non Approuvée - MINJEC', 'Votre demande d''inscription n''a pas pu être approuvée. Raison: Documents incomplets', 'rejection', now() - interval '5 days', 'sent', null, null, '{"username": "rejected_user", "rejection_reason": "Documents incomplets - CIN non valide"}', now() - interval '5 days');