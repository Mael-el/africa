# 🌍 AfricaSkills

> **La première plateforme panafricaine de formation, certification et emploi.**
> Forme. Certifie. Emploie.

![AfricaSkills](https://img.shields.io/badge/AfricaSkills-Form._Cert._Emploie.-F97316?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F)

---

## 📋 Vue d'ensemble

AfricaSkills est une plateforme qui :

1. **Forme** les jeunes africains dans 12 domaines d'excellence
2. **Certifie** leurs compétences par un système de badges (XP, raretés)
3. **Connecte** les meilleurs talents aux entreprises partenaires
4. **Accompagne** la création de startups via un incubateur
5. **Impose** l'anglais professionnel en 3 mois (B2 garanti)

### 🎯 Domaines de formation

| Domaine | Icône | Description |
|---------|-------|-------------|
| Anglais | 🇬🇧 | Programme intensif — 3 mois pour le B2 |
| Développement | 💻 | React, Next.js, NestJS, mobile |
| Data & Analyse | 📊 | Python, SQL, Power BI, ML |
| Cybersécurité | 🛡️ | Ethical hacking, pentesting, SOC |
| Intelligence Artificielle | 🤖 | LLMs, RAG, Computer Vision |
| Design UI/UX | 🎨 | Figma, design systems |
| Mathématiques | 🔢 | Algèbre, stats, optimisation |
| Physique | ⚛️ | Mécanique, élec, thermo |
| Lecture rapide | 📚 | Lire 3x plus vite |
| Ingénierie | 🏗️ | Civil, mécanique, électrique |
| Robotique | 🦾 | Arduino, ROS, drones, IoT |
| Entrepreneuriat | 🚀 | Business plan, levée de fonds |

---

## 🏗️ Architecture (cible monorepo)

```
africaskills/
├── frontend/              → Next.js 15 (ce projet)
├── backend/               → NestJS 10 + Prisma (vision)
├── docker-compose.yml     → PostgreSQL 16 + Redis 7 + Meilisearch
└── README.md
```

### Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 15 · React 19 · TypeScript · Tailwind · shadcn/ui · Zustand · React Query |
| **Backend** (actuel) | Next.js Route Handlers + Drizzle ORM + PostgreSQL |
| **Backend** (cible) | NestJS 10 · Prisma · PostgreSQL 16 · Redis 7 · Socket.io · BullMQ |
| **Recherche** | Meilisearch |
| **Stockage** | Cloudflare R2 |
| **Paiements** | FedaPay · KkiaPay · MTN MoMo · Orange Money · Wave · Moov |
| **Email** | Resend |
| **SMS** | AfricasTalking |
| **Hébergement** | Vercel (front) + Railway (back) |

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- PostgreSQL 16
- pnpm ou npm

### Installation

```bash
# 1. Cloner et installer
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec DATABASE_URL

# 3. Pousser le schéma en base
npx drizzle-kit push

# 4. Lancer le serveur de dev
npm run dev

# 5. Initialiser les données (12 domaines, 8 cours, 8 badges, 6 entreprises, 6 jobs)
curl -X POST http://localhost:3000/api/seed
```

### Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarre en production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |
| `npx drizzle-kit push` | Synchronise le schéma avec la DB |
| `npx drizzle-kit studio` | Interface visuelle Drizzle |

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── (pages)
│   │   ├── page.tsx              # Accueil — hero, domaines, cours vedettes
│   │   ├── courses/
│   │   │   ├── page.tsx          # Catalogue filtrable
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Détail d'une formation
│   │   │       └── CourseCheckout.tsx  # Paiement Mobile Money
│   │   ├── badges/page.tsx       # Badges & certifications
│   │   ├── jobs/page.tsx         # Offres d'emploi
│   │   ├── dashboard/page.tsx    # Espace étudiant
│   │   └── about/page.tsx        # À propos
│   ├── api/
│   │   ├── seed/route.ts         # Initialisation de la DB
│   │   ├── courses/              # CRUD cours
│   │   ├── domains/route.ts      # Liste des domaines
│   │   ├── badges/route.ts       # Liste des badges
│   │   ├── jobs/route.ts         # Offres d'emploi
│   │   ├── payments/route.ts     # Paiement Mobile Money (mock)
│   │   └── health/route.ts       # Healthcheck
│   ├── layout.tsx                # Layout global + Navbar + Footer
│   ├── globals.css               # Thème africain (orange/or/émeraude)
│   └── not-found.tsx             # Page 404
├── components/
│   ├── Navbar.tsx                # Navigation sticky
│   ├── Footer.tsx                # Pied de page
│   ├── CourseCard.tsx            # Carte de formation
│   ├── DomainCard.tsx            # Carte de domaine
│   ├── BadgeCard.tsx             # Carte de badge avec rareté
│   └── JobCard.tsx               # Carte d'offre d'emploi
├── db/
│   ├── index.ts                  # Client Drizzle (pool pg)
│   └── schema.ts                 # Schéma complet (10 tables)
└── lib/
    ├── seed-data.ts              # Données de seed
    └── format.ts                 # Utilitaires (XOF, rareté, etc.)
```

---

## 🗄️ Schéma de données

**10 tables principales :**

- `users` — étudiants, instructeurs, entreprises, admins
- `domains` — les 12 domaines de formation
- `courses` — formations avec prix en FCFA
- `lessons` — leçons d'un cours (vidéo + contenu)
- `enrollments` — inscriptions des étudiants
- `badges` — certifications (common / rare / epic / legendary)
- `user_badges` — badges obtenus par les étudiants
- `payments` — paiements Mobile Money (FedaPay, KkiaPay, MTN, Orange, Moov, Wave)
- `companies` — entreprises partenaires
- `jobs` — offres d'emploi

Voir [`src/db/schema.ts`](./src/db/schema.ts) pour le détail.

---

## 💳 Paiements Mobile Money

La route `/api/payments` simule actuellement l'intégration avec :

- **MTN Mobile Money** 🟡
- **Orange Money** 🟠
- **Moov Money** 🔵
- **Wave** 🔵
- **FedaPay** 💳
- **KkiaPay** ⚡

**En production**, il faudra :

1. Remplacer le mock par l'appel à l'API FedaPay/KkiaPay
2. Stocker les clés API dans `.env` (`FEDAPAY_SECRET_KEY`, `KKIAPAY_PRIVATE_KEY`)
3. Gérer les webhooks de confirmation de paiement
4. Implémenter la réconciliation comptable

Exemple d'appel :

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "courseSlug": "react-nextjs-fullstack",
    "phoneNumber": "+229 01 00 00 00",
    "method": "mtn_mobile_money"
  }'
```

---

## 🔌 API Routes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | Healthcheck |
| `/api/seed` | POST | Initialise la DB |
| `/api/seed` | GET | Compte les entités |
| `/api/domains` | GET | Liste des 12 domaines |
| `/api/courses` | GET | Catalogue (filtres : `?domain=`, `?q=`, `?limit=`) |
| `/api/courses/[slug]` | GET | Détail d'un cours |
| `/api/badges` | GET | Tous les badges |
| `/api/jobs` | GET | Offres d'emploi actives |
| `/api/payments` | POST | Paiement Mobile Money |

---

## 🎨 Design system

**Palette africaine :**

- **Orange** `#F97316` — énergie, action
- **Or** `#F59E0B` — richesse, réussite
- **Émeraude** `#059669` — nature, croissance
- **Fond noir** `#0A0A0A` — élégance moderne

**Raretés de badges :**

- 🥉 **Common** — gris
- 💎 **Rare** — bleu ciel
- ⚡ **Epic** — violet
- 🌟 **Legendary** — or → rouge

---

## 🧭 Vision monorepo complète (NestJS backend)

La version actuelle utilise Next.js Route Handlers. Pour la mise en production, l'architecture cible est :

```
backend/  (NestJS 10)
├── src/
│   ├── modules/
│   │   ├── auth/         # JWT, refresh, OAuth (Google/GitHub)
│   │   ├── users/        # CRUD users + profils
│   │   ├── domains/      # Gestion des 12 domaines
│   │   ├── courses/      # CRUD cours + leçons + progression
│   │   ├── enrollments/  # Inscriptions + progression
│   │   ├── badges/       # Attribution de badges (events)
│   │   ├── payments/     # FedaPay, KkiaPay, webhooks
│   │   ├── companies/    # Entreprises partenaires
│   │   ├── jobs/         # Offres d'emploi
│   │   ├── search/       # Meilisearch (cours, jobs, users)
│   │   ├── notifications/# Email (Resend) + SMS (AfricasTalking)
│   │   └── realtime/     # Socket.io (chat, notifs live)
│   ├── common/           # Guards, decorators, filters, interceptors
│   ├── config/           # ConfigModule + validation
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── docker-compose.yml
```

### Modules NestJS à implémenter (prompt par prompt)

1. **Auth** — JWT + refresh + guards
2. **Users** — CRUD + profils + upload avatar (R2)
3. **Domains & Courses** — catalogue complet
4. **Enrollments** — progression + leçons
5. **Badges** — système XP + attribution event-driven
6. **Payments** — FedaPay + KkiaPay + webhooks
7. **Companies & Jobs** — marché de l'emploi
8. **Search** — Meilisearch (cours, jobs)
9. **Notifications** — Resend + AfricasTalking + BullMQ
10. **Realtime** — Socket.io (chat, live)

---

## ✅ Règles de développement

- ✅ **TypeScript strict** partout
- ✅ **Commentaires en français**
- ✅ **Principes SOLID**
- ✅ **Tests unitaires** (Jest + Testing Library)
- ✅ **Gestion d'erreurs** centralisée
- ✅ **Variables d'environnement** (jamais de secrets en dur)
- ✅ **Documentation Swagger** sur toutes les routes API

---

## 🌐 Variables d'environnement

```env
# Base de données
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/africaskills

# Paiements
FEDAPAY_PUBLIC_KEY=
FEDAPAY_SECRET_KEY=
FEDAPAY_MODE=sandbox
KKIAPAY_PUBLIC_KEY=
KKIAPAY_PRIVATE_KEY=

# Stockage
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=africaskills

# Email & SMS
RESEND_API_KEY=
AFRICASTALKING_API_KEY=
AFRICASTALKING_USERNAME=

# Recherche
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_MASTER_KEY=

# Redis (queues BullMQ)
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
```

---

## 📊 Roadmap

### Phase 1 — MVP (actuel)
- [x] Landing page
- [x] Catalogue formations
- [x] Détail cours + checkout Mobile Money (mock)
- [x] Système de badges
- [x] Offres d'emploi
- [x] Dashboard étudiant

### Phase 2 — Backend NestJS
- [ ] Migration vers NestJS + Prisma
- [ ] Authentification JWT
- [ ] Paiements réels FedaPay/KkiaPay
- [ ] Upload vidéo sur Cloudflare R2
- [ ] Progression réelle + leçons vidéo

### Phase 3 — Engagement
- [ ] Programme anglais intensif 3 mois
- [ ] Chat Socket.io (étudiants + mentors)
- [ ] Recherche Meilisearch
- [ ] Notifications email + SMS

### Phase 4 — Échelle
- [ ] Incubateur de startups
- [ ] Gamification avancée (clans, défis, tournois)
- [ ] Application mobile (React Native)
- [ ] Expansion 15 pays africains

---

## 🤝 Contribution

AfricaSkills est un projet open pour l'Afrique. Pour contribuer :

1. Fork le projet
2. Crée une branche (`feat/nom-feature`)
3. Commit avec messages conventionnels
4. Ouvre une PR

---

## 📄 Licence

MIT © 2026 AfricaSkills — **Made with 🧡 in Africa.**

---

<div align="center">

**🌍 L'Afrique forme. L'Afrique embauche. 🌍**

</div>
