# Maison Ìró — Frontend

SPA React de l'atelier de couture Maison Ìró (vitrine publique + back-office). Voir le [README principal](../README.md) à la racine du monorepo pour la vue d'ensemble du projet (backend, authentification, routes, workflows métier).

## Stack

- [React 19](https://react.dev/) + [React Compiler](https://react.dev/learn/react-compiler)
- [Vite 8](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Recharts](https://recharts.org/) (graphiques back-office)
- [Oxlint](https://oxc.rs/) (lint)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (PWA)

## Démarrage

```bash
npm install
npm run dev       # http://localhost:5173 — nécessite l'API backend lancée (voir ../README.md)
npm run build     # build de production dans dist/
npm run preview   # prévisualise le build de production
npm run lint      # lint avec Oxlint
```

Variable d'environnement (`.env`) :

```
VITE_API_URL=http://127.0.0.1:8000/api
```

## Structure

```
src/
├── api/              # clients HTTP par domaine (auth, catalogue, commandes, devis, factures…)
├── assets/images/    # photos (index.js centralise les imports)
├── components/       # composants partagés (navbar, footer, cartes, tuiles textiles…)
├── context/          # contextes React (panier, authentification)
├── mock/             # données statiques restantes (contenu éditorial, config)
├── pages/
│   ├── public/        # site vitrine + espace client
│   └── admin/         # back-office
├── App.jsx
└── main.jsx
```

Pour la liste complète des routes et les workflows métier (sur-mesure, boutique, validation admin), voir le [README principal](../README.md).
