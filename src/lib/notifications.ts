// ============================================================
// NOTIFICATIONS — Création de notifications in-app
// Appelé par les modules métier (gamification, candidatures,
// inscriptions, paiements) pour informer l'utilisateur.
// En phase 3 : relais vers email (Resend) + SMS (AfricasTalking)
// via une file BullMQ.
// ============================================================

import { db } from "@/db";
import { notifications } from "@/db/schema";

export type NotificationType =
  | "badge_earned"
  | "course_completed"
  | "application_status"
  | "enrollment"
  | "payment_success"
  | "system";

export interface NotifyInput {
  type: NotificationType;
  /** Titre court affiché dans la cloche (ex: "🏅 Nouveau badge !") */
  title: string;
  /** Texte descriptif optionnel */
  body?: string;
  /** Lien interne de destination au clic */
  href?: string;
}

/**
 * Crée une notification in-app pour un utilisateur.
 * Ne lève jamais d'erreur : un échec de notification ne doit
 * pas faire échouer l'action métier en cours.
 */
export async function notifyUser(
  userId: string,
  input: NotifyInput
): Promise<void> {
  try {
    await db.insert(notifications).values({
      userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      href: input.href ?? null,
    });
  } catch (error) {
    // On journalise sans propager : la notification est best-effort
    console.error("notifyUser error:", error);
  }
}
