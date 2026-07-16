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
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) pour le support PWA

**Backend**
- [Laravel 12](https://laravel.com/) (PHP 8.5)
- MySQL
- Authentification par token Bearer maison (pas de Sanctum : voir [Authentification](#authentification))
- Stockage de fichiers local (disque `public` + lien symbolique) pour les photos de produits/tissus

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

- Deux rôles : `admin` (accès back-office) et `client` (accès espace client).
- Un compte `client` créé via `/inscription` est automatiquement relié (ou créé) à une fiche `Client` du CRM, par correspondance d'email.
- Toutes les routes API métier (`clients`, `orders`, `quotes`, `invoices`, `finances`, `stocks`…) exigent le rôle `admin`. Seules les lectures du catalogue public (`textiles`, `collections`, `products`) sont ouvertes sans authentification.
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
| `/espace-client` | Suivi de commande, carnet de mesures, devis & factures, création d'une pièce sur-mesure |
| `/devis/paiement` | Conversion d'un devis en commande définitive (livraison, paiement, plan intégral ou en tranches) |
| `/facture/:id` | Facture (imprimable / téléchargeable une fois validée) |

**Back-office** (`/admin`, rôle admin requis)

| Route | Page |
|---|---|
| `/admin` | Tableau de bord (KPIs réels, CA 6 derniers mois, alertes de relance) |
| `/admin/clients` | Clients |
| `/admin/commandes` | Commandes (Kanban glisser-déposer, envoi de devis chiffré) |
| `/admin/devis` | Devis & Factures (validation des paiements en attente) |
| `/admin/catalogue` | Catalogue (Vêtements / Mercerie / Tissus, photos, prix) |
| `/admin/stocks`, `/admin/stocks/entree` | Stocks (mouvements réels tissus/articles) |
| `/admin/promotions` | Promotions |
| `/admin/finances` | Finances |
| `/admin/livraisons` | Livraisons |
| `/admin/equipe` | Équipe |
| `/admin/parametres` | Paramètres |

## Workflows métier

**Sur-mesure** : le client soumet une demande (modèle, tissu, mensurations) depuis l'espace client → l'atelier envoie un devis chiffré (matières premières, main d'œuvre, échéance de livraison) → le client le convertit en commande définitive en choisissant l'adresse de livraison, le mode de paiement et le plan (intégral ou acompte 50 % + solde à la livraison) → la ou les factures générées restent `en_attente` jusqu'à validation par un gestionnaire, qui les fait passer à `payée` (et alimente automatiquement les mouvements de caisse).

**Boutique** : parcours du catalogue (vêtements, mercerie, tissus au mètre) → panier (articles mélangés) → tunnel de commande (livraison, paiement) → facture `en_attente` (stock décrémenté immédiatement) → validation admin → facture téléchargeable.

**Suivi de commande** : dès qu'une facture liée à une commande passe à `payée`/`partielle`, la commande quitte automatiquement l'étape « Reçue » pour « En cours ». L'admin fait ensuite progresser la commande par glisser-déposer dans le Kanban (`En cours` → `Finition` → `Prête` → `Livrée`). Chaque changement de statut (automatique ou manuel) génère une **notification** pour le client, visible via la cloche dans la navbar — jamais un nouveau devis.

**Catalogue** : les articles sont organisés en trois grandes catégories — **Vêtements**, **Mercerie** et **Tissus** — chacune avec ses propres sous-catégories. L'admin gère le nom, le prix, le stock et la **photo** de chaque article (upload direct, stocké sur le disque `public` de Laravel). Les tissus ont en plus un prix au mètre optionnel : s'il est renseigné, le tissu devient achetable dans la boutique (sinon il reste une matière interne, visible seulement en gestion de stock).

## Données

L'essentiel des données (clients, commandes, devis, factures, produits, collections, textiles, stocks, promotions, équipe, finances, notifications) provient de l'API Laravel / MySQL — la Boutique, la Galerie et la page d'Accueil affichent toutes le vrai catalogue publié par l'admin (photos comprises), plus aucune de ces données n'est simulée côté frontend.

Restent en données statiques dans `src/mock/` (contenu éditorial ou non couvert par un modèle backend) :
- `testimonials.js` (`heroStats`, `testimonials`) : témoignages et chiffres clés de la page d'accueil.
- `booking.js` : créneaux de rendez-vous (pas de modèle « réservation » côté API).
- `orders.js` (`orderStatuses`), `customOrder.js` : configuration statique (libellés d'étapes, choix de modèles/mensurations), pas des données métier.
- `alerts.js` (`dueSoon`) : widget « Échéances 24/48h » du tableau de bord, encore en démonstration (les « Alertes de relance » juste au-dessus, elles, sont réelles).
