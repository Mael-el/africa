// ============================================================
// UTILITAIRES DE FORMATAGE — AfricaSkills
// ============================================================

/**
 * Formate un montant en FCFA avec séparateur de milliers.
 * Ex: 45000 → "45 000 FCFA"
 */
export function formatXof(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

/**
 * Retourne une note formatée sur 5 avec une décimale.
 * Ex: 48 (sur 50) → "4.8"
 */
export function formatRating(rating: number): string {
  return (rating / 10).toFixed(1);
}

/**
 * Formate un nombre d'étudiants.
 * Ex: 1243 → "1.2K", 512 → "512"
 */
export function formatStudents(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Retourne une classe Tailwind de couleur selon la rareté du badge.
 */
export function rarityColor(
  rarity: "common" | "rare" | "epic" | "legendary"
): string {
  switch (rarity) {
    case "common":
      return "from-slate-400 to-slate-600";
    case "rare":
      return "from-sky-400 to-blue-600";
    case "epic":
      return "from-purple-400 to-fuchsia-600";
    case "legendary":
      return "from-amber-400 via-orange-500 to-red-600";
  }
}

/**
 * Libellé français pour un niveau de cours.
 */
export function levelLabel(
  level: "beginner" | "intermediate" | "advanced" | "expert"
): string {
  switch (level) {
    case "beginner":
      return "Débutant";
    case "intermediate":
      return "Intermédiaire";
    case "advanced":
      return "Avancé";
    case "expert":
      return "Expert";
  }
}

/**
 * Libellé français pour un type d'emploi.
 */
export function jobTypeLabel(
  type: "full_time" | "part_time" | "freelance" | "internship" | "contract"
): string {
  switch (type) {
    case "full_time":
      return "Temps plein";
    case "part_time":
      return "Temps partiel";
    case "freelance":
      return "Freelance";
    case "internship":
      return "Stage";
    case "contract":
      return "CDD / Mission";
  }
}

/**
 * Génère un slug URL-friendly à partir d'une chaîne.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
