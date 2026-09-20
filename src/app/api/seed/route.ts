// ============================================================
// ROUTE API — SEED DE LA BASE DE DONNÉES
// Appelée en POST pour initialiser les données d'AfricaSkills.
// En production, à remplacer par un script CLI.
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  domains,
  courses,
  badges,
  companies,
  jobs,
  users,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  SEED_DOMAINS,
  SEED_COURSES,
  SEED_BADGES,
  SEED_COMPANIES,
  SEED_JOBS,
} from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // On vérifie si la base est déjà peuplée
    const existing = await db.select({ count: sql<number>`count(*)::int` }).from(domains);
    if (existing[0]?.count && existing[0].count > 0) {
      return NextResponse.json({
        ok: true,
        message: "Base déjà initialisée",
        domains: existing[0].count,
      });
    }

    // 1) Insérer les domaines
    const insertedDomains = await db
      .insert(domains)
      .values(SEED_DOMAINS as any)
      .returning();

    const domainMap = new Map(
      insertedDomains.map((d) => [d.slug, d.id])
    );

    // 2) Créer des instructeurs fictifs uniques
    const instructorNames = Array.from(
      new Set(SEED_COURSES.map((c) => c.instructorName))
    );
    const insertedInstructors = await db
      .insert(users)
      .values(
        instructorNames.map((name, i) => ({
          email: `instructor-${i + 1}@africaskills.africa`,
          fullName: name,
          role: "instructor" as const,
          country: "Bénin",
          bio: `Instructeur certifié AfricaSkills — ${name}`,
        }))
      )
      .returning();

    const instructorMap = new Map(
      insertedInstructors.map((u) => [u.fullName, u.id])
    );

    // 3) Insérer les cours
    await db.insert(courses).values(
      SEED_COURSES.map((c) => ({
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        domainId: domainMap.get(c.domainSlug)!,
        instructorId: instructorMap.get(c.instructorName) ?? null,
        level: c.level,
        durationHours: c.durationHours,
        priceXof: c.priceXof,
        rating: c.rating,
        studentsCount: c.studentsCount,
        whatYouLearn: c.whatYouLearn,
        requirements: c.requirements,
        status: "published" as const,
      }))
    );

    // 4) Insérer les badges
    await db.insert(badges).values(
      SEED_BADGES.map((b) => ({
        slug: b.slug,
        name: b.name,
        description: b.description,
        icon: b.icon,
        rarity: b.rarity,
        domainId: b.domainSlug ? (domainMap.get(b.domainSlug) ?? null) : null,
        requiredXp: b.requiredXp,
      }))
    );

    // 5) Insérer les entreprises
    const insertedCompanies = await db
      .insert(companies)
      .values(
        SEED_COMPANIES.map((c) => ({
          slug: c.slug,
          name: c.name,
          country: c.country,
          city: c.city,
          industry: c.industry,
          logoUrl: c.logoEmoji, // on stocke l'emoji dans le champ URL pour la démo
          description: c.description,
          isVerified: true,
        }))
      )
      .returning();

    const companyMap = new Map(
      insertedCompanies.map((c) => [c.slug, c.id])
    );

    // 6) Insérer les offres d'emploi
    await db.insert(jobs).values(
      SEED_JOBS.map((j, i) => ({
        title: j.title,
        slug: `job-${i + 1}-${Date.now()}`,
        companyId: companyMap.get(j.companySlug)!,
        type: j.type,
        location: j.location,
        isRemote: j.isRemote,
        salaryMinXof: j.salaryMinXof,
        salaryMaxXof: j.salaryMaxXof,
        description: j.description,
        requiredBadges: j.requiredBadges,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      }))
    );

    return NextResponse.json({
      ok: true,
      counts: {
        domains: insertedDomains.length,
        instructors: insertedInstructors.length,
        courses: SEED_COURSES.length,
        badges: SEED_BADGES.length,
        companies: insertedCompanies.length,
        jobs: SEED_JOBS.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const counts = {
    domains: await db.select({ count: sql<number>`count(*)::int` }).from(domains).then((r) => r[0]?.count ?? 0),
    courses: await db.select({ count: sql<number>`count(*)::int` }).from(courses).then((r) => r[0]?.count ?? 0),
    badges: await db.select({ count: sql<number>`count(*)::int` }).from(badges).then((r) => r[0]?.count ?? 0),
    companies: await db.select({ count: sql<number>`count(*)::int` }).from(companies).then((r) => r[0]?.count ?? 0),
    jobs: await db.select({ count: sql<number>`count(*)::int` }).from(jobs).then((r) => r[0]?.count ?? 0),
  };
  return NextResponse.json({ ok: true, counts });
}
