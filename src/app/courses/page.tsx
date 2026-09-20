// ============================================================
// PAGE — TOUTES LES FORMATIONS
// Filtres par domaine, recherche, tri
// ============================================================

import Link from "next/link";
import { db } from "@/db";
import { domains, courses, users } from "@/db/schema";
import { eq, and, ilike, desc, sql } from "drizzle-orm";
import { CourseCard } from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const domainSlug = sp.domain;
  const q = sp.q?.trim();

  // Récupérer les domaines avec compte de cours
  const allDomains = await db
    .select({
      slug: domains.slug,
      name: domains.name,
      icon: domains.icon,
      coursesCount: sql<number>`count(${courses.id})::int`,
    })
    .from(domains)
    .leftJoin(courses, eq(courses.domainId, domains.id))
    .groupBy(domains.slug, domains.name, domains.icon)
    .orderBy(domains.name);

  // Construire la requête des cours
  const baseConditions = [eq(courses.status, "published")];
  if (q) {
    baseConditions.push(ilike(courses.title, `%${q.replace(/[%_]/g, "\\$&")}%`));
  }
  if (domainSlug) {
    baseConditions.push(eq(domains.slug, domainSlug));
  }

  const filteredCourses = await db
    .select({
      slug: courses.slug,
      title: courses.title,
      subtitle: courses.subtitle,
      level: courses.level,
      durationHours: courses.durationHours,
      priceXof: courses.priceXof,
      rating: courses.rating,
      studentsCount: courses.studentsCount,
      instructorName: users.fullName,
      domain: {
        slug: domains.slug,
        name: domains.name,
        icon: domains.icon,
        color: domains.color,
      },
    })
    .from(courses)
    .innerJoin(domains, eq(courses.domainId, domains.id))
    .leftJoin(users, eq(courses.instructorId, users.id))
    .where(and(...baseConditions))
    .orderBy(desc(courses.studentsCount));

  const currentDomain = allDomains.find((d) => d.slug === domainSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
          Catalogue
        </div>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl lg:text-5xl">
          {currentDomain
            ? `${currentDomain.icon} Formations ${currentDomain.name}`
            : "Toutes les formations"}
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          {filteredCourses.length} formation
          {filteredCourses.length > 1 ? "s" : ""} disponible
          {filteredCourses.length > 1 ? "s" : ""}. Apprends à ton rythme, paie
          en Mobile Money, décroche ton badge.
        </p>
      </div>

      {/* Barre de filtres */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !domainSlug
              ? "bg-orange-500 text-black"
              : "border border-neutral-800 text-neutral-400 hover:border-orange-500/50 hover:text-white"
          }`}
        >
          Tous
        </Link>
        {allDomains.map((d) => (
          <Link
            key={d.slug}
            href={`/courses?domain=${d.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              domainSlug === d.slug
                ? "bg-orange-500 text-black"
                : "border border-neutral-800 text-neutral-400 hover:border-orange-500/50 hover:text-white"
            }`}
          >
            {d.icon} {d.name}
            <span className="ml-1 text-xs opacity-60">({d.coursesCount})</span>
          </Link>
        ))}
      </div>

      {/* Recherche */}
      <form className="mb-8">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="🔍 Rechercher une formation..."
          className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-orange-500"
        />
      </form>

      {/* Grille */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-16 text-center">
          <div className="text-5xl">📭</div>
          <h3 className="mt-4 text-xl font-bold text-white">
            Aucune formation trouvée
          </h3>
          <p className="mt-2 text-neutral-400">
            Essaie un autre filtre ou reviens bientôt, on ajoute de nouveaux
            cours chaque semaine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c) => (
            <CourseCard
              key={c.slug}
              slug={c.slug}
              title={c.title}
              subtitle={c.subtitle}
              level={c.level as "beginner" | "intermediate" | "advanced" | "expert"}
              durationHours={Number(c.durationHours ?? 0)}
              priceXof={Number(c.priceXof ?? 0)}
              rating={Number(c.rating ?? 0)}
              studentsCount={Number(c.studentsCount ?? 0)}
              instructorName={c.instructorName}
              domain={c.domain}
            />
          ))}
        </div>
      )}
    </div>
  );
}
