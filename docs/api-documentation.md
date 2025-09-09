# Documentation des APIs - Système MINJEC

## Vue d'ensemble

Le système MINJEC dispose d'un ensemble complet d'APIs pour gérer toutes les interactions entre les composants. Ces APIs sont implémentées sous forme d'Edge Functions Supabase et d'un microservice OTP externe.

## 🚀 APIs Disponibles

### 1. API Registration (`/functions/v1/api-registration`)

Gère les demandes d'inscription des utilisateurs.

#### Endpoints

**POST /api-registration**
- Créer une nouvelle demande d'inscription
- Body : `{ email, username, user_type, user_id_or_registration, additional_info }`
- Retourne : `{ success: true, data: pendingUser }`

**GET /api-registration**
- Récupérer les demandes d'inscription
- Query params : `status`, `user_type`, `limit`
- Retourne : `{ success: true, data: [pendingUsers] }`

**PUT /api-registration/:id**
- Mettre à jour une demande
- Body : `{ status, approved_by, rejected_reason, ... }`
- Retourne : `{ success: true, data: updatedUser }`

### 2. API Users (`/functions/v1/api-users`)

Gère les utilisateurs approuvés du système.

#### Endpoints

**GET /api-users**
- Récupérer tous les utilisateurs
- Query params : `user_type`, `limit`
- Retourne : `{ success: true, data: [users] }`

**GET /api-users/:id**
- Récupérer un utilisateur spécifique
- Retourne : `{ success: true, data: user }`

**PUT /api-users/:id**
- Mettre à jour un utilisateur
- Body : `{ username, user_type, ... }`
- Retourne : `{ success: true, data: updatedUser }`

**DELETE /api-users/:id**
- Supprimer un utilisateur
- Retourne : `{ success: true, message: "Utilisateur supprimé" }`

### 3. API Stats (`/functions/v1/api-stats`)

Fournit les statistiques du système.

#### Endpoints

**GET /api-stats**
- Récupérer toutes les statistiques
- Retourne :
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "by_type": {
        "standard_user": 100,
        "cdc_agent": 30,
        "association": 15,
        "admin": 5
      }
    },
    "pending_requests": {
      "total": 25,
      "pending": 10,
      "approved": 12,
      "rejected": 3
    },
    "agents": {
      "total": 30,
      "active": 28,
      "inactive": 2
    },
    "associations": {
      "total": 15,
      "approved": 12,
      "pending": 3
    }
  }
}
```

### 4. API Notifications (`/functions/v1/api-notifications`)

Gère l'envoi et la récupération des notifications.

#### Endpoints

**POST /api-notifications**
- Envoyer une notification
- Body : `{ type, recipient, title, message, data }`
- Types : `email`, `system`, `push`
- Retourne : `{ success: true, data: notification }`

**GET /api-notifications**
- Récupérer les notifications
- Query params : `recipient`, `type`, `limit`
- Retourne : `{ success: true, data: [notifications] }`

### 5. API OTP (Microservice externe - Port 3001)

Gère l'authentification par code OTP.

#### Endpoints

**POST http://localhost:3001/send-otp**
- Envoyer un code OTP
- Body : `{ email, username }`
- Retourne : `{ success: true, message: "OTP envoyé" }`

**POST http://localhost:3001/verify-otp**
- Vérifier un code OTP
- Body : `{ email, otp }`
- Retourne : `{ success: true, verified: true }`

**GET http://localhost:3001/health**
- État du service OTP
- Retourne : `{ status: "OK", activeOTPs: 5 }`

## 🛠️ Utilisation des APIs

### Client API TypeScript

```typescript
import { api } from '../lib/api';

// Créer une demande d'inscription
const registration = await api.registration.create({
  email: 'user@example.com',
  username: 'username',
  user_type: 'standard_user',
  user_id_or_registration: '123456789'
});

// Récupérer les statistiques
const stats = await api.stats.get();

// Envoyer une notification
await api.notifications.send({
  type: 'email',
  recipient: 'admin@minjec.gov.dj',
  title: 'Nouvelle demande',
  message: 'Une nouvelle demande nécessite votre attention'
});

// Envoyer un OTP
await api.otp.send('user@example.com', 'John Doe');

// Vérifier un OTP
const result = await api.otp.verify('user@example.com', '1234');
```

### Hooks React

```typescript
import { useStats, useRegistrations, useOtp } from '../hooks/useApi';

function AdminDashboard() {
  const { stats, loading, error } = useStats();
  const { registrations, updateRegistration } = useRegistrations({ status: 'pending' });
  const { sendOtp, verifyOtp } = useOtp();

  // Utiliser les données...
}
```

## 🔒 Sécurité

- **Authentification** : Toutes les APIs utilisent les tokens Supabase
- **Autorisation** : RLS policies pour contrôler l'accès aux données
- **CORS** : Configuré pour permettre les requêtes cross-origin
- **Rate Limiting** : Implémenté sur le microservice OTP

## 📊 Monitoring

- **Health Checks** : Endpoint `/health` sur chaque service
- **Logs** : Logs détaillés pour debugging
- **Métriques** : Statistiques en temps réel via `/api-stats`

## 🚨 Gestion d'Erreurs

Toutes les APIs retournent des erreurs structurées :

```json
{
  "error": "Message d'erreur descriptif",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## 🔄 Intégration

Les APIs sont conçues pour fonctionner ensemble :

1. **Inscription** → API Registration → Notification Admin
2. **Approbation** → API Users → Envoi OTP
3. **Connexion** → Vérification OTP → Accès système
4. **Monitoring** → API Stats → Dashboard Admin

Cette architecture API complète permet une interaction fluide entre tous les composants du système MINJEC ! 🎉