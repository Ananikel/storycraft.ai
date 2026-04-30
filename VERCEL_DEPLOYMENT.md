# StoryCraft AI - Deploiement Vercel

## Configuration Vercel

Le fichier `vercel.json` configure :

- `npm run build` comme commande de build.
- `dist` comme dossier de sortie Vite.
- Un fallback SPA vers `index.html`.
- Une redirection `/api/*` vers le backend StoryCraft.
- Un cache long pour les assets générés par Vite dans `/assets/*`.

Remplacez cette destination dans `vercel.json` par votre URL backend réelle :

```json
"destination": "https://storycraft-api.example.com/api/:path*"
```

Exemples :

```json
"destination": "https://api.storycraft.ai/api/:path*"
```

ou :

```json
"destination": "https://storycraft-backend.onrender.com/api/:path*"
```

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
```

### Backend Stripe / OpenAI

Ces variables ne doivent pas être dans le frontend si le backend est deploye ailleurs.
Ajoutez-les dans les variables du projet backend.

```env
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_CREATOR=
STRIPE_PRICE_PRO=
```

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
