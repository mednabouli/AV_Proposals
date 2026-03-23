import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@avproposal.ai";

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Bienvenue sur AVProposal.ai! 🎬",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Bienvenue, ${name}!</h1>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Merci de vous être inscrit sur <strong>AVProposal.ai</strong>, votre assistant IA pour générer des devis audiovisuels professionnels en quelques minutes.
          </p>
          
          <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h2 style="color: #1e293b; margin-top: 0;">Vous avez 5 générations gratuites ce mois-ci</h2>
            <p style="color: #64748b; margin: 0;">
              Démarrez dès maintenant. Accédez à votre tableau de bord pour créer votre premier devis.
            </p>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://avproposal.ai/app" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500;">
              Créer mon premier devis
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #94a3b8; font-size: 14px;">
            Des questions? Répondez simplement à cet email. Notre équipe vous répondra dans les 24h.
          </p>
          
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Équipe AVProposal.ai
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}

export async function sendFirstProposalEmail(email: string, name: string, proposalId: string) {
  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Votre premier devis est prêt! 🎉",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Votre devis est généré!</h1>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Bonjour ${name},
          </p>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Votre devis audiovisuel a été généré avec succès par notre IA. Consultez-le maintenant et modifiez-le selon vos besoins.
          </p>
          
          <div style="background: #f1f5f9; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h2 style="color: #1e293b; margin-top: 0;">Générations restantes: 4/5 ce mois-ci</h2>
            <p style="color: #64748b; margin: 0;">
              Vous avez généré 1 devis. Il vous en reste 4 avant la limite gratuite.
            </p>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://avproposal.ai/app/proposal/${proposalId}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500;">
              Voir mon devis
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #94a3b8; font-size: 14px;">
            Équipe AVProposal.ai
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error("Error sending first proposal email:", error);
    throw error;
  }
}

export async function sendPlanUpgradeEmail(email: string, name: string) {
  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Bienvenue au plan Pro! 🚀",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 10px;">Vous êtes maintenant Pro!</h1>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Merci, ${name}! Votre upgrade vers le plan Pro est confirmé.
          </p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h2 style="color: #1e293b; margin-top: 0;">Accès illimité activé ✓</h2>
            <p style="color: #64748b; margin: 0;">
              Générez autant de devis que vous le souhaitez. Export PDF illimité. Support prioritaire.
            </p>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://avproposal.ai/app" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500;">
              Commencer maintenant
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #94a3b8; font-size: 14px;">
            Équipe AVProposal.ai
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error("Error sending upgrade email:", error);
    throw error;
  }
}
