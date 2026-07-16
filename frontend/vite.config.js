import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Maison Ìró',
        short_name: 'Ìró',
        description: 'Couture sur-mesure haut de gamme, axe Dakar · Paris.',
        theme_color: '#1a1140',
        background_color: '#14102b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Lectures API : consultables hors-ligne à partir du dernier chargement réussi.
            urlPattern: ({ url, request }) => url.pathname.startsWith('/api/') && request.method === 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-reads',
              networkTimeoutSeconds: 6,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 300, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            // Création de commande sur-mesure hors-ligne : mise en file, envoi automatique au retour du réseau.
            urlPattern: ({ url, request }) => url.pathname === '/api/me/orders' && request.method === 'POST',
            handler: 'NetworkOnly',
            method: 'POST',
            options: {
              backgroundSync: {
                name: 'queue-me-orders',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          {
            // Prise de mesures hors-ligne.
            urlPattern: ({ url, request }) => url.pathname === '/api/me/measurements' && request.method === 'POST',
            handler: 'NetworkOnly',
            method: 'POST',
            options: {
              backgroundSync: {
                name: 'queue-me-measurements',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
          {
            // Avancement d'une commande dans le Kanban (couturier en atelier, réseau instable).
            urlPattern: ({ url, request }) => /^\/api\/orders\/\d+$/.test(url.pathname) && request.method === 'PUT',
            handler: 'NetworkOnly',
            method: 'PUT',
            options: {
              backgroundSync: {
                name: 'queue-orders-update',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
        ],
      },
    }),
  ],
})
