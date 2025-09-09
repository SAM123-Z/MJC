import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Stockage temporaire des OTP
const otpStore = new Map();

// Config Nodemailer (Gmail)
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Génération OTP 4 chiffres
const generateOtp = () => crypto.randomInt(1000, 9999);

// Fonction pour nettoyer les OTP expirés
const cleanExpiredOtps = () => {
  const now = Date.now();
  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
    }
  }
};

// Nettoyage automatique toutes les minutes
setInterval(cleanExpiredOtps, 60 * 1000);

// Template HTML pour l'email OTP
const getOtpEmailTemplate = (otp, username = '') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Code d'Activation - MINJEC</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #dc2626, #16a34a, #2563eb); padding: 25px; border-radius: 12px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Code d'Activation</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">MINJEC - Ministère de la Jeunesse et de la Culture</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; border: 2px solid #0ea5e9;">
          <h2 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 22px;">Votre code d'activation</h2>
          ${username ? `<p style="color: #0c4a6e; margin: 0 0 15px 0;">Bonjour <strong>${username}</strong>,</p>` : ''}
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="font-size: 48px; font-weight: bold; color: #0c4a6e; letter-spacing: 8px; font-family: monospace; margin: 10px 0;">
              ${otp}
            </div>
          </div>
          <p style="color: #0c4a6e; margin: 15px 0 0 0; font-weight: 500;">
            ⚠️ Ce code expire dans 5 minutes
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🔒 Instructions de sécurité</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Ne partagez jamais ce code avec personne</li>
            <li style="margin-bottom: 8px;">Utilisez ce code uniquement sur le site officiel MINJEC</li>
            <li style="margin-bottom: 8px;">Si vous n'avez pas demandé ce code, ignorez cet email</li>
            <li style="margin-bottom: 8px;">Le code expire automatiquement après 5 minutes</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            📧 admin@minjec.gov.dj | 📞 +253 21 35 26 14<br>
            Ministère de la Jeunesse et de la Culture - République de Djibouti
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// --------- 1. Envoi OTP ----------
app.post("/send-otp", async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "L'adresse email est requise." 
      });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Stocker l'OTP avec les informations supplémentaires
    otpStore.set(email, { 
      otp, 
      expiresAt,
      username: username || '',
      createdAt: Date.now(),
      attempts: 0
    });

    // Envoyer l'email avec le template HTML
    await transporter.sendMail({
      from: `"MINJEC Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 Code d'activation MINJEC - ${otp}`,
      html: getOtpEmailTemplate(otp, username),
    });

    console.log(`✅ OTP envoyé à ${email}: ${otp} (expire dans 5 min)`);

    res.json({ 
      success: true, 
      message: "Code OTP envoyé avec succès !",
      expiresIn: 300 // 5 minutes en secondes
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi OTP:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'envoi du code OTP. Vérifiez votre configuration email." 
    });
  }
});

// --------- 2. Vérification OTP ----------
app.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email et code OTP sont requis." 
      });
    }

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ 
        success: false, 
        message: "Aucun code OTP trouvé pour cet email." 
      });
    }

    // Vérifier l'expiration
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false, 
        message: "Le code OTP a expiré. Demandez un nouveau code." 
      });
    }

    // Incrémenter les tentatives
    record.attempts += 1;

    // Limiter les tentatives (max 3)
    if (record.attempts > 3) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false, 
        message: "Trop de tentatives incorrectes. Demandez un nouveau code." 
      });
    }

    // Vérifier le code OTP
    if (parseInt(otp) !== record.otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Code OTP incorrect.",
        attemptsRemaining: 3 - record.attempts
      });
    }

    // Code correct - supprimer de la mémoire
    otpStore.delete(email);
    
    console.log(`✅ OTP vérifié avec succès pour ${email}`);

    res.json({ 
      success: true, 
      message: "Code OTP validé avec succès !",
      verified: true
    });
  } catch (error) {
    console.error("❌ Erreur lors de la vérification OTP:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la vérification du code OTP." 
    });
  }
});

// --------- 3. Notification Admin pour nouvelles demandes ----------
app.post("/send-admin-notification", async (req, res) => {
  try {
    const { type, adminEmail, userData } = req.body;
    
    if (!adminEmail || !userData) {
      return res.status(400).json({ 
        success: false, 
        message: "Email admin et données utilisateur requis." 
      });
    }

    const subject = `🔔 Nouvelle demande d'inscription - ${userData.userType} - ${userData.username}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle Demande d'Inscription</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #dc2626, #16a34a, #2563eb); padding: 20px; border-radius: 12px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">MINJEC - Nouvelle Demande</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Système de Gestion des Inscriptions</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border-left: 4px solid #2563eb; margin-bottom: 25px;">
            <h2 style="color: #1d4ed8; margin: 0 0 20px 0; font-size: 20px;">📋 Détails de la demande</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 40%;">Nom d'utilisateur:</td>
                <td style="padding: 8px 0; color: #111827;">${userData.username}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #111827;">${userData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Type d'utilisateur:</td>
                <td style="padding: 8px 0; color: #111827;">
                  <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">
                    ${userData.userType}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">CIN National:</td>
                <td style="padding: 8px 0; color: #111827; font-family: monospace;">${userData.userIdOrRegistration}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date de soumission:</td>
                <td style="padding: 8px 0; color: #111827;">${userData.submissionDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; margin: 0 0 15px 0;">
              🔔 <strong>Action requise :</strong> Connectez-vous à l'interface d'administration pour traiter cette demande.
            </p>
            <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:5173'}" 
               style="display: inline-block; background: linear-gradient(135deg, #dc2626, #16a34a, #2563eb); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              🔍 Traiter la demande
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              📧 admin@minjec.gov.dj | 📞 +253 21 35 26 14<br>
              Ministère de la Jeunesse et de la Culture - République de Djibouti
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email de notification
    await transporter.sendMail({
      from: `"MINJEC Admin" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log(`✅ Notification admin envoyée pour: ${userData.username} (${userData.userType})`);

    res.json({ 
      success: true, 
      message: "Notification admin envoyée avec succès !",
      pendingId: userData.pendingId
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la notification admin:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'envoi de la notification admin." 
    });
  }
});

// --------- 4. Endpoint de santé ----------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "OTP Microservice",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    activeOTPs: otpStore.size
  });
});

// --------- 5. Endpoint pour les statistiques (développement) ----------
if (process.env.NODE_ENV !== 'production') {
  app.get("/stats", (req, res) => {
    const stats = {
      activeOTPs: otpStore.size,
      otps: Array.from(otpStore.entries()).map(([email, data]) => ({
        email,
        expiresAt: new Date(data.expiresAt).toISOString(),
        attempts: data.attempts,
        createdAt: new Date(data.createdAt).toISOString()
      }))
    };
    res.json(stats);
  });
}

// --------- 6. Gestion des erreurs ----------
app.use((err, req, res, next) => {
  console.error("❌ Erreur non gérée:", err);
  res.status(500).json({
    success: false,
    message: "Erreur interne du serveur"
  });
});

// --------- 7. Gestion des routes non trouvées ----------
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint non trouvé"
  });
});

// --------- 8. Lancement serveur ----------
app.listen(PORT, () => {
  console.log(`🚀 Microservice OTP lancé sur http://localhost:${PORT}`);
  console.log(`📧 Service email: ${process.env.EMAIL_USER ? 'Configuré' : 'Non configuré'}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du microservice OTP...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du microservice OTP...');
  process.exit(0);
});