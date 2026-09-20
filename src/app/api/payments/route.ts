// ============================================================
// ROUTE API — PAIEMENT MOBILE MONEY (MOCK)
// En production : intégration FedaPay / KkiaPay / Fedapay API
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, enrollments, users, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, courseSlug, phoneNumber, method } = body as {
      userId?: string;
      courseSlug?: string;
      phoneNumber?: string;
      method?: string;
    };

    if (!courseSlug || !phoneNumber || !method) {
      return NextResponse.json(
        { ok: false, error: "Champs manquants" },
        { status: 400 }
      );
    }

    // Trouver le cours
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, courseSlug))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { ok: false, error: "Cours introuvable" },
        { status: 404 }
      );
    }

    // Trouver ou créer l'utilisateur (démo)
    let [user] = userId
      ? await db.select().from(users).where(eq(users.id, userId)).limit(1)
      : [];

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: `${phoneNumber.replace(/\D/g, "")}@africaskills.demo`,
          fullName: `Étudiant ${phoneNumber}`,
          phone: phoneNumber,
          role: "student",
          country: "Bénin",
        })
        .returning();
    }

    // Simuler l'appel au provider Mobile Money (FedaPay / KkiaPay)
    // En production : fetch vers leur API avec clé secrète
    const providerReference = `MP-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    // Enregistrer le paiement comme réussi (simulation)
    const [payment] = await db
      .insert(payments)
      .values({
        userId: user.id,
        courseId: course.id,
        amountXof: course.priceXof,
        method: method as any,
        status: "success",
        providerReference,
        phoneNumber,
      })
      .returning();

    // Créer l'inscription
    await db
      .insert(enrollments)
      .values({
        userId: user.id,
        courseId: course.id,
        progress: 0,
        status: "active",
      })
      .onConflictDoNothing();

    return NextResponse.json({
      ok: true,
      payment: {
        id: payment.id,
        reference: providerReference,
        status: "success",
        amount: payment.amountXof,
      },
      enrollment: {
        userId: user.id,
        courseId: course.id,
      },
      message: `Paiement reçu via ${method}. Bienvenue dans ${course.title} !`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
