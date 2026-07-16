# Maison Ìró — Atelier Couture

Application web de l'atelier de couture sur-mesure Maison Ìró (Dakar · Paris) : vitrine publique (galerie, boutique, sur-mesure, réservation, espace client) et back-office de gestion (clients, commandes, devis, factures, stocks, finances), adossés à une API Laravel.

Le projet est un monorepo à deux dossiers :

```
backend/    # API Laravel (auth, données métier, MySQL, fichiers)
frontend/   # SPA React (vitrine + back-office)
```

## Stack technique

**Frontend**
- [React 19](https://react.dev/) + [React Compiler](https://react.dev/learn/react-compiler)
- [Vite 8](https://vite.dev/) (build & dev server)
- [React Router](https://reactrouter.com/) pour le routage
- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) pour l'UI
- [Recharts](https://recharts.org/) pour les graphiques du back-office
- [Oxlint](https://oxc.rs/) pour le lint
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) pour le support PWA — hors-ligne : lecture (cache `NetworkFirst` sur les GET `/api/*`) + écriture en file d'attente (Workbox Background Sync sur la création de commande, la prise de mesures et l'avancement Kanban), rejouée automatiquement au retour du réseau

**Backend**
- [Laravel 12](https://laravel.com/) (PHP 8.5)
- MySQL
- Authentification par token Bearer maison (pas de Sanctum : voir [Authentification](#authentification))
- Stockage de fichiers local (disque `public` + lien symbolique) pour les photos de produits/tissus/commandes
- [barryvdh/laravel-dompdf](https://github.com/barryvdh/laravel-dompdf) pour la génération des factures PDF
- [CinetPay](https://cinetpay.com/) pour le paiement Mobile Money (MTN MoMo / Orange Money) — identifiants configurables depuis `/admin/parametres`, aucune dépendance à l'API MTN/Orange directe

## Démarrage

### Backend (API)

```bash
cd backend
composer install
cp .env.example .env        # renseigner DB_* et FRONTEND_URLS
php artisan key:generate
php artisan storage:link    # requis pour servir les photos (produits, tissus)
php artisan migrate --seed  # crée le schéma + données de démo + un compte admin de test
php artisan serve           # http://127.0.0.1:8000
```



### Frontend

```bash
cd frontend
npm install
npm run dev       # serveur de développement (http://localhost:5173)
npm run build     # build de production dans dist/
npm run preview   # prévisualise le build de production
npm run lint      # lint du code avec Oxlint
```

Le frontend attend l'API sur `VITE_API_URL` (`frontend/.env`, par défaut `http://127.0.0.1:8000/api`).

⚠️ `APP_URL` (backend `.env`) doit correspondre à l'adresse réelle du serveur (`http://127.0.0.1:8000` par défaut) : c'est cette valeur qui sert à générer les URLs des photos uploadées.

## Structure du projet (frontend)

```
frontend/src/
├── api/              # clients HTTP par domaine (auth, catalogue, commandes, devis, factures…)
├── assets/images/    # photos de démonstration (index.js centralise les imports)
├── components/       # composants partagés (navbar, cloche de notifications, cartes, tuiles textiles…)
├── context/          # contextes React (panier, authentification)
├── mock/             # données statiques restantes (voir « Données »)
├── pages/
│   ├── public/        # site vitrine + espace client
│   └── admin/         # back-office
├── App.jsx            # déclaration des routes
└── main.jsx           # point d'entrée
```

## Authentification

L'API n'utilise pas Laravel Sanctum : l'authentification repose sur un système de token Bearer maison (table `auth_tokens`, tokens hashés en base, expiration 30 jours), volontairement simple car l'environnement de développement n'a pas d'accès Composer/Internet pour installer Sanctum.

- Trois rôles : `admin` (back-office complet), `employe` (back-office limité — clients, commandes, devis, livraisons, saisie des mesures) et `client` (espace client).
- Un compte `client` créé via `/inscription` est automatiquement relié (ou créé) à une fiche `Client` du CRM, par correspondance d'email. Un compte `employe` se crée depuis `/admin/equipe` (associe un membre d'équipe à des identifiants de connexion).
- Routes API réparties en deux groupes métier : `clients`, `orders`, `quotes`, `deliveries`, `measurements` (middleware `staff`, admin **ou** employé) et `invoices`, `finances`, `stocks`, `team-members`, `promotions`, `settings`, `order-statuses` en écriture (middleware `admin` strict). Seules les lectures du catalogue public (`textiles`, `collections`, `products`, `order-statuses`) sont ouvertes sans authentification.
- Les routes `/auth/login` et `/auth/register` sont limitées en débit (`throttle`) et protégées par un verrou anti-brute-force côté serveur.
- CORS restreint aux origines listées dans `FRONTEND_URLS` (backend `.env`).

## Routes (frontend)

**Site public**

| Route | Page |
|---|---|
| `/` | Accueil |
| `/galerie` | Galerie de créations (filtrable par grande catégorie et sous-catégorie) |
| `/boutique` | Boutique (vêtements, mercerie, tissus au mètre) |
| `/panier` | Panier & tunnel de commande (livraison, paiement, aperçu facture) |
| `/commande/confirmation` | Confirmation de commande |
| `/rendez-vous` | Prise de rendez-vous |
| `/contact` | Contact |
| `/connexion` | Connexion |
| `/inscription` | Création de compte |

**Espace client** (connexion requise)

| Route | Page |
|---|---|
| `/espace-client` | Suivi de commande, devis & factures, page fusionnée « Mesures & pièce sur-mesure » (carnet de mesures réutilisable + choix d'un style catalogue ou photo + tissu + instructions, en accordéon) |
| `/devis/paiement` | Conversion d'un devis en commande définitive (livraison, paiement, plan intégral ou en tranches) |
| `/facture/:id` | Facture (imprimable / téléchargeable une fois validée) |

**Back-office** (`/admin`, rôle `admin` ou `employe` selon la page)

| Route | Page | Accès |
|---|---|---|
| `/admin` | Tableau de bord (KPIs réels, CA 6 derniers mois, alertes de relance, échéances 24/48h réelles) | admin + employé |
| `/admin/clients` | Clients (fiches + carnet de mesures historisé par type de vêtement) | admin + employé |
| `/admin/commandes` | Commandes (Kanban glisser-déposer, envoi de devis chiffré, photos/instructions/mesures liées par commande) | admin + employé |
| `/admin/livraisons` | Livraisons | admin + employé |
| `/admin/devis` | Devis & Factures (validation des paiements en attente, téléchargement PDF) | admin uniquement |
| `/admin/catalogue` | Catalogue (Vêtements / Mercerie / Tissus, photos, prix) | admin uniquement |
| `/admin/stocks`, `/admin/stocks/entree` | Stocks (mouvements réels tissus/articles) | admin uniquement |
| `/admin/promotions` | Promotions | admin uniquement |
| `/admin/finances` | Finances | admin uniquement |
| `/admin/equipe` | Équipe (création de comptes employés) | admin uniquement |
| `/admin/parametres` | Paramètres (workflow de commande personnalisable, identifiants de paiement CinetPay) | admin uniquement |

## Workflows métier

**Sur-mesure** : le client choisit un style (produit du catalogue publié ou photo d'inspiration uploadée), un tissu, un profil de mesures (réutilisé depuis son carnet ou nouvelle prise datée) et des instructions, depuis la page unique « Mesures & pièce sur-mesure » de l'espace client → l'atelier envoie un devis chiffré (matières premières, main d'œuvre, échéance de livraison) → le client le convertit en commande définitive en choisissant l'adresse de livraison, le mode de paiement (carte, Mobile Money, espèces à la livraison) et le plan (intégral ou acompte 50 % + solde à la livraison) → la ou les factures générées restent `en_attente` jusqu'à validation (paiement Mobile Money confirmé automatiquement par webhook CinetPay, ou validation manuelle par un gestionnaire pour les autres moyens), ce qui les fait passer à `payée` et alimente automatiquement les mouvements de caisse.

**Boutique** : parcours du catalogue (vêtements, mercerie, tissus au mètre) → panier (articles mélangés) → tunnel de commande (livraison, paiement) → facture `en_attente` (stock décrémenté immédiatement) → validation → facture téléchargeable en PDF (logo et mentions de l'atelier).

**Paiement Mobile Money** : intégration [CinetPay](https://cinetpay.com/) (agrégateur MTN MoMo / Orange Money / carte, pas d'API MTN/Orange directe). Identifiants (`cinetpay_api_key`, `cinetpay_site_id`) configurables depuis `/admin/parametres`, stockés en base (table `settings`). Le client est redirigé vers la page de paiement hébergée CinetPay ; la confirmation arrive par webhook (`POST /api/webhooks/cinetpay`), qui revérifie toujours le statut réel auprès de l'API CinetPay avant de valider la facture (jamais de confiance aveugle dans le webhook).

**Suivi de commande** : dès qu'une facture liée à une commande passe à `payée`/`partielle`, la commande quitte automatiquement sa première étape pour la suivante. L'admin (ou l'employé) fait ensuite progresser la commande par glisser-déposer dans le Kanban. **Le workflow de commande est personnalisable** depuis `/admin/parametres` : ajout/suppression/renommage/réordonnancement des étapes (table `order_statuses`), reflété en temps réel dans le Kanban admin et le suivi client. Chaque changement de statut (automatique ou manuel) génère une **notification** pour le client, visible via la cloche dans la navbar — jamais un nouveau devis.

**Catalogue** : les articles sont organisés en trois grandes catégories — **Vêtements**, **Mercerie** et **Tissus** — chacune avec ses propres sous-catégories. L'admin gère le nom, le prix, le stock et la **photo** de chaque article (upload direct, stocké sur le disque `public` de Laravel). Les tissus ont en plus un prix au mètre optionnel : s'il est renseigné, le tissu devient achetable dans la boutique (sinon il reste une matière interne, visible seulement en gestion de stock).

**Carnet de mesures** : historisé et réutilisable — chaque prise de mesures (`measurements`) est datée et rattachée à un type de vêtement, gérable depuis la fiche client (admin/employé) ou directement lors de la création d'une pièce sur-mesure (client). Une commande référence le profil de mesures exact utilisé (`orders.measurement_id`), visible sur sa carte Kanban.

## Données

L'essentiel des données (clients, commandes, devis, factures, produits, collections, textiles, stocks, promotions, équipe, finances, notifications) provient de l'API Laravel / MySQL — la Boutique, la Galerie et la page d'Accueil affichent toutes le vrai catalogue publié par l'admin (photos comprises), plus aucune de ces données n'est simulée côté frontend.

Restent en données statiques dans `src/mock/` (contenu éditorial ou non couvert par un modèle backend) :
- `testimonials.js` (`heroStats`, `testimonials`) : témoignages et chiffres clés de la page d'accueil.
- `booking.js` : créneaux de rendez-vous (pas de modèle « réservation » côté API).
- `customOrder.js` (`measurementFields`) : libellés des champs de mesure standards, pas des données métier.

Le widget « Échéances 24/48h » du tableau de bord est calculé en temps réel à partir des échéances de commandes en base (comme les « Alertes de relance » juste au-dessus). Les étapes du workflow de commande (`orderStatuses`) proviennent désormais de l'API (`GET /api/order-statuses`), configurables depuis `/admin/parametres`.
