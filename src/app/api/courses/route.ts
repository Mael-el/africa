// ============================================================
// ROUTE API — LISTE DES COURS
// GET /api/courses?domain=<slug>&q=<recherche>
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, domains, users } from "@/db/schema";
import { eq, and, ilike, sql, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const domainSlug = url.searchParams.get("domain");
  const q = url.searchParams.get("q");
  const limit = Math.min(
    Number(url.searchParams.get("limit") ?? 50),
    100
  );

  try {
    const conditions = [eq(courses.status, "published")];

    if (domainSlug) {
      conditions.push(eq(domains.slug, domainSlug));
    }
    if (q && q.trim()) {
      conditions.push(
        ilike(courses.title, `%${q.trim().replace(/[%_]/g, "\\$&")}%`)
      );
    }

    const rows = await db
      .select({
        id: courses.id,
        slug: courses.slug,
        title: courses.title,
        subtitle: courses.subtitle,
        description: courses.description,
        level: courses.level,
        durationHours: courses.durationHours,
        priceXof: courses.priceXof,
        rating: courses.rating,
        studentsCount: courses.studentsCount,
        whatYouLearn: courses.whatYouLearn,
        requirements: courses.requirements,
        domain: {
          slug: domains.slug,
          name: domains.name,
          icon: domains.icon,
          color: domains.color,
        },
        instructorName: users.fullName,
      })
      .from(courses)
      .leftJoin(domains, eq(courses.domainId, domains.id))
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(courses.studentsCount))
      .limit(limit);

    return NextResponse.json({ ok: true, courses: rows });
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
