# Maison Ìró — Atelier Couture

Application web de l'atelier de couture sur-mesure Maison Ìró (Dakar · Paris) : vitrine publique (galerie, boutique, sur-mesure, réservation) et back-office de gestion (clients, commandes, devis, stocks, finances).

## Stack technique

- [React 19](https://react.dev/) + [React Compiler](https://react.dev/learn/react-compiler)
- [Vite 8](https://vite.dev/) (build & dev server)
- [React Router](https://reactrouter.com/) pour le routage
- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/) pour l'UI
- [Recharts](https://recharts.org/) pour les graphiques du back-office
- [Oxlint](https://oxc.rs/) pour le lint
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) pour le support PWA

## Démarrage

```bash
npm install
npm run dev       # serveur de développement (http://localhost:5173)
npm run build     # build de production dans dist/
npm run preview   # prévisualise le build de production
npm run lint      # lint du code avec Oxlint
```

## Structure du projet

```
src/
├── assets/images/   # photos de l'atelier et des créations (index.js centralise les imports)
├── components/      # composants partagés (navbar, footer, cartes, tuiles textiles…)
├── context/         # contextes React (panier)
├── mock/            # données de démonstration (catalogue, clients, galerie…)
├── pages/
│   ├── public/       # site vitrine
│   └── admin/        # back-office
├── App.jsx           # déclaration des routes
└── main.jsx          # point d'entrée
```

## Routes

**Site public**

| Route | Page |
|---|---|
| `/` | Accueil |
| `/galerie` | Galerie de créations |
| `/boutique` | Boutique prêt-à-porter |
| `/sur-mesure` | Commande sur-mesure |
| `/espace-client` | Espace client |
| `/rendez-vous` | Prise de rendez-vous |
| `/contact` | Contact |

**Back-office** (`/admin`)

| Route | Page |
|---|---|
| `/admin` | Tableau de bord |
| `/admin/clients` | Clients |
| `/admin/commandes` | Commandes |
| `/admin/devis` | Devis |
| `/admin/catalogue` | Catalogue |
| `/admin/stocks`, `/admin/stocks/entree` | Stocks |
| `/admin/promotions` | Promotions |
| `/admin/finances` | Finances |
| `/admin/livraisons` | Livraisons |
| `/admin/equipe` | Équipe |
| `/admin/parametres` | Paramètres |

## Données

Les données affichées proviennent actuellement de fichiers de simulation dans `src/mock/` (pas d'API backend connectée).
