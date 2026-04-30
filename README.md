# StoryCraft AI

Application React + Vite + Tailwind CSS pour créer des livres illustrés multilingues.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Structure

- `src/App.jsx` : page principale, hero, pricing et studio.
- `src/components/Navbar.jsx` : navigation, switcher FR/EN, profil.
- `src/components/Pricing.jsx` : grille Starter, Créateur, Pro.
- `src/components/CreationDashboard.jsx` : stepper de génération, langues locales, aperçu livre.
- `src/services/AIService.js` : appels frontend vers un backend sécurisé.
- `src/i18n.js` : traductions i18next FR/EN.

## Connexion IA

Le frontend ne doit jamais contenir de clé API OpenAI. Configurez `VITE_STORYCRAFT_API_URL`
pour pointer vers votre backend, puis stockez `OPENAI_API_KEY` uniquement côté serveur.

Les endpoints attendus par `AIService.js` sont :

- `POST /api/ai/script/bilingual`
- `POST /api/ai/images/consistent-visuals`

Le backend peut ensuite appeler OpenAI avec le modèle texte disponible sur votre compte API
et un modèle image tel que `gpt-image-1.5`, `gpt-image-1` ou `dall-e-3` selon votre accès.
