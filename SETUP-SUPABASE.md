# 🚀 Configuration Supabase pour MINJEC

## 📋 Étapes de Configuration

### 1. **Créer un projet Supabase**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Nommez votre projet : `minjec-platform`
6. Choisissez une région proche (Europe West par exemple)
7. Créez un mot de passe fort pour la base de données
8. Cliquez sur "Create new project"

### 2. **Récupérer les clés de configuration**
Une fois le projet créé :
1. Allez dans **Settings** → **API**
2. Copiez les informations suivantes :
   - **Project URL** : `https://your-project-ref.supabase.co`
   - **Anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Configurer les variables d'environnement**
Modifiez le fichier `.env` avec vos vraies valeurs :

```env
# Remplacez ces valeurs par les vôtres
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Configuration email (optionnel pour les tests)
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
```

### 4. **Appliquer les migrations**
1. Dans Supabase Dashboard, allez dans **SQL Editor**
2. Copiez et exécutez le contenu du fichier `supabase/migrations/create_test_data.sql`
3. Cliquez sur "Run" pour créer toutes les tables et données de test

### 5. **Configurer l'authentification**
1. Dans Supabase Dashboard, allez dans **Authentication** → **Settings**
2. Désactivez "Enable email confirmations" pour les tests
3. Dans **URL Configuration**, ajoutez :
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/**`

### 6. **Tester la connexion**
1. Redémarrez votre serveur de développement : `npm run dev`
2. Ouvrez `http://localhost:5173`
3. Vous devriez voir la page de connexion sans erreurs
4. Testez avec le compte admin : `admin@minjec.gov.dj` / `admin123`

## 🔧 **Configuration Email (Optionnel)**

### Gmail SMTP
1. Activez l'authentification à 2 facteurs sur Gmail
2. Générez un mot de passe d'application :
   - Google Account → Sécurité → Mots de passe des applications
   - Sélectionnez "Autre" et nommez-le "MINJEC"
   - Copiez le mot de passe généré dans `MAIL_PASSWORD`

### Services alternatifs
- **SMTP2GO** : Créez un compte sur smtp2go.com
- **Brevo** : Créez un compte sur brevo.com (ex-SendinBlue)

## 🎯 **Comptes de Test Disponibles**

Après avoir appliqué les migrations, vous aurez :

### **Admin**
- Email: `admin@minjec.gov.dj`
- Mot de passe: `admin123`

### **Utilisateurs avec codes OTP**
- `agent.boulaos@minjec.gov.dj` (Code: 1234)
- `association.culture@minjec.gov.dj` (Code: 5678)
- `user.standard@minjec.gov.dj` (Code: 9012)

### **Demandes en attente**
- 8 demandes d'inscription à approuver
- Différents types : agents CDC, associations, utilisateurs

## 🚨 **Dépannage**

### Erreur "Configuration Supabase manquante"
- Vérifiez que le fichier `.env` existe à la racine
- Vérifiez que les variables commencent par `VITE_`
- Redémarrez le serveur après modification

### Erreur "URL Supabase invalide"
- L'URL doit être au format `https://xxx.supabase.co`
- Pas d'espace ou caractère spécial

### Erreur de connexion
- Vérifiez que le projet Supabase est actif
- Vérifiez votre connexion internet
- Vérifiez les clés API dans le dashboard Supabase

## 📞 **Support**
Si vous rencontrez des problèmes, vérifiez :
1. Les logs de la console du navigateur (F12)
2. Les logs du serveur de développement
3. Le statut de votre projet Supabase

La plateforme est maintenant prête à être utilisée ! 🎉