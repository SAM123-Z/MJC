# 🔐 Microservice OTP - MINJEC

Microservice Node.js pour l'authentification via code OTP à 4 chiffres avec envoi par email.

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install express nodemailer body-parser crypto cors dotenv
```

### 2. Configuration
Copiez le fichier `.env` et configurez vos identifiants Gmail :
```bash
cp .env.example .env
```

Éditez le fichier `.env` :
```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
```

### 3. Configuration Gmail
1. Activez l'authentification à deux facteurs sur votre compte Gmail
2. Générez un "mot de passe d'application" :
   - Allez dans Paramètres Google → Sécurité
   - Sélectionnez "Mots de passe des applications"
   - Générez un mot de passe pour "Autre (nom personnalisé)"
   - Utilisez ce mot de passe dans EMAIL_PASS

### 4. Lancement
```bash
# Mode développement
npm run otp-service

# Mode production
node server.js
```

## 📡 API Endpoints

### POST `/send-otp`
Génère et envoie un code OTP à 4 chiffres par email.

**Paramètres :**
```json
{
  "email": "utilisateur@example.com",
  "username": "Nom Utilisateur" // optionnel
}
```

**Réponse succès :**
```json
{
  "success": true,
  "message": "Code OTP envoyé avec succès !",
  "expiresIn": 300
}
```

### POST `/verify-otp`
Vérifie le code OTP soumis par l'utilisateur.

**Paramètres :**
```json
{
  "email": "utilisateur@example.com",
  "otp": "1234"
}
```

**Réponse succès :**
```json
{
  "success": true,
  "message": "Code OTP validé avec succès !",
  "verified": true
}
```

### GET `/health`
Vérification de l'état du service.

**Réponse :**
```json
{
  "status": "OK",
  "service": "OTP Microservice",
  "version": "1.0.0",
  "timestamp": "2025-01-23T10:30:00.000Z",
  "activeOTPs": 5
}
```

### GET `/stats` (développement uniquement)
Statistiques des OTP actifs.

## 🧪 Tests avec Postman

### 1. Envoyer un OTP
- **Méthode :** POST
- **URL :** `http://localhost:3000/send-otp`
- **Headers :** `Content-Type: application/json`
- **Body :**
```json
{
  "email": "test@gmail.com",
  "username": "Test User"
}
```

### 2. Vérifier un OTP
- **Méthode :** POST
- **URL :** `http://localhost:3000/verify-otp`
- **Headers :** `Content-Type: application/json`
- **Body :**
```json
{
  "email": "test@gmail.com",
  "otp": "1234"
}
```

### 3. Vérifier l'état du service
- **Méthode :** GET
- **URL :** `http://localhost:3000/health`

## 🔒 Sécurité

- **Expiration automatique** : Les OTP expirent après 5 minutes
- **Limitation des tentatives** : Maximum 3 tentatives par OTP
- **Nettoyage automatique** : Les OTP expirés sont supprimés automatiquement
- **Stockage temporaire** : Aucune persistance en base de données

## 🎨 Template Email

Le service utilise un template HTML responsive avec :
- Design aux couleurs MINJEC (rouge, vert, bleu)
- Code OTP mis en évidence
- Instructions de sécurité
- Informations de contact

## 🔧 Intégration avec l'Application

Pour intégrer avec votre application React :

```javascript
// Envoyer un OTP
const sendOTP = async (email, username) => {
  const response = await fetch('http://localhost:3000/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username })
  });
  return response.json();
};

// Vérifier un OTP
const verifyOTP = async (email, otp) => {
  const response = await fetch('http://localhost:3000/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  return response.json();
};
```

## 🐛 Dépannage

### Erreur "Invalid login"
- Vérifiez que vous utilisez un mot de passe d'application Gmail
- Assurez-vous que l'authentification à deux facteurs est activée

### OTP non reçu
- Vérifiez les dossiers spam/indésirables
- Vérifiez la configuration EMAIL_USER et EMAIL_PASS
- Consultez les logs du serveur

### Erreur de connexion
- Vérifiez votre connexion internet
- Assurez-vous que le port 3000 n'est pas utilisé par un autre service

## 📝 Logs

Le service affiche des logs détaillés :
- ✅ Succès d'envoi/vérification
- ❌ Erreurs avec détails
- 🔍 Informations de débogage

## 🏗️ Production

Pour la production, considérez :
- Utiliser une base de données Redis pour le stockage des OTP
- Configurer un reverse proxy (nginx)
- Utiliser des variables d'environnement sécurisées
- Implémenter un rate limiting plus strict
- Ajouter des logs structurés