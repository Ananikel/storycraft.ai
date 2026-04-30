# StoryCraft AI - Stripe + Firebase

## Stripe Checkout

Le frontend appelle :

```http
POST /api/billing/create-checkout-session
```

Payload :

```json
{
  "planKey": "creator",
  "successUrl": "http://localhost:5173/?checkout=success#studio",
  "cancelUrl": "http://localhost:5173/?checkout=cancelled#pricing"
}
```

Le backend doit garder `STRIPE_SECRET_KEY` privé et mapper chaque plan vers un Price ID Stripe.

Exemple Express :

```js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceIds = {
  starter: process.env.STRIPE_PRICE_STARTER,
  creator: process.env.STRIPE_PRICE_CREATOR,
  pro: process.env.STRIPE_PRICE_PRO
};

app.post("/api/billing/create-checkout-session", async (req, res) => {
  const { planKey, successUrl, cancelUrl } = req.body;
  const price = priceIds[planKey];

  if (!price) {
    return res.status(400).json({ error: "Unknown subscription plan." });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: req.user?.id,
    metadata: {
      planKey
    }
  });

  res.json({ url: session.url });
});
```

En production, ajoutez un webhook Stripe pour activer le plan utilisateur après `checkout.session.completed`.

## Firebase / Firestore

Variables Vite :

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Structure Firestore utilisée :

```text
users/{userId}/storybooks/{storybookId}
```

Champs principaux :

```json
{
  "title": "Le Jardin des Etoiles",
  "theme": "Amitie, courage et decouverte",
  "visualStyle": "Watercolor premium",
  "language": "Francais",
  "secondLanguage": "Ewe",
  "previewImageUrl": "https://...",
  "pages": [],
  "status": "draft",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Règles Firestore minimales avec Auth :

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/storybooks/{storybookId} {
      allow read, create, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Prompt Firebase demandé

```text
Configure une base de données Firestore pour StoryCraft AI afin que chaque utilisateur authentifié puisse sauvegarder ses livres, les rouvrir et les modifier plus tard. Utilise la structure users/{userId}/storybooks/{storybookId}. Chaque storybook doit contenir le titre, le thème, le style visuel, les langues, les références de personnages, les scènes, les pages bilingues, l'URL de l'image d'aperçu, le statut draft/published, createdAt et updatedAt avec serverTimestamp. Ajoute des règles de sécurité pour qu'un utilisateur ne puisse lire et modifier que ses propres livres.
```
