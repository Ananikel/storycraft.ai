# StoryCraft AI - Deploiement Vercel

## Configuration Vercel

Le fichier `vercel.json` configure :

- `npm run build` comme commande de build.
- `dist` comme dossier de sortie Vite.
- Un fallback SPA vers `index.html`.
- Des fonctions Vercel sous `/api/*`, notamment Stripe Checkout.
- Un cache long pour les assets générés par Vite dans `/assets/*`.

## Variables d'environnement Vercel

Copiez exactement ces variables dans Vercel, menu Project Settings > Environment Variables.

### Frontend Vite

```env
VITE_STORYCRAFT_API_URL=/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_CREATOR=
STRIPE_PRICE_PRO=
```

### Backend OpenAI

```env
OPENAI_API_KEY=
```

Stripe est géré par la fonction Vercel `api/billing/create-checkout-session.js`.
Les variables Stripe sont des variables serveur Vercel, elles ne doivent pas avoir le préfixe `VITE_`.

## Assets et logo

Les fichiers importes depuis `src/assets`, comme `src/assets/storycraft-logo.png`,
sont traites par Vite et copies automatiquement dans `dist/assets` avec un nom hashe.
Ils seront donc servis correctement par Vercel.

Consigne projet :

```text
Placez les logos et images utilises par React dans src/assets, importez-les dans les composants,
et laissez Vite les copier dans dist/assets au build. Ne referencez pas un chemin local absolu.
Pour un fichier public accessible sans import, placez-le dans public/ et referencez-le avec /nom-du-fichier.png.
```

## Build local de verification

```bash
npm install
npm run build
```

Le deploy Vercel doit etre lance depuis `apps/storycraft_ai` ou configure avec ce dossier comme Root Directory.
