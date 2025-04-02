# 🎬 Movie API - Fullstack Application with Next.js, MongoDB & JWT Auth

Bienvenue dans le projet **Movie API**, une API RESTful développée avec **Next.js**, **MongoDB**, **Mongoose** et **Zod** pour la validation. Elle est déployée sur **Vercel** et intègre un système complet d'authentification avec **JWT**.

---

## 🚀 Démo en ligne

🔗 [movie-api.vercel.app](https://movies-sage-kappa.vercel.app/)

---

## 🧱 Stack technique

- **Next.js** 14 (App Router)
- **TypeScript**
- **MongoDB** (via MongoDB Atlas)
- **Mongoose**
- **Zod** (validation de schémas)
- **Swagger** (documentation de l'API)
- **JWT** (authentification avec token)
- **Tailwind CSS** (si besoin de front-office)
- **Vercel** (déploiement cloud)

---

## 📁 Architecture du projet

```
app/
  api/
    auth/
      login/route.ts
      logout/route.ts
      register/route.ts
      refresh-token/route.ts
    movies/
      [idMovie]/route.ts
      [idMovie]/comments/
        route.ts
        [idComment]/route.ts
    theaters/
      route.ts
      [idTheater]/route.ts
models/
  Movie.ts
  Comment.ts
  Theater.ts
  User.ts
  Session.ts
schemas/
  movieSchema.ts
  commentSchema.ts
  userSchema.ts
services/
  auth.service.ts
utils/
  mongoose.ts
  responses.ts
swagger/
  components.ts
```

---

## 🔐 Authentification JWT

Le système d'authentification utilise **accessToken** (valide 1h) et **refreshToken** (valide 7 jours) stocké en base de données dans la collection `sessions`.

Routes disponibles :

- `POST /api/auth/register` : Enregistrement d'un utilisateur
- `POST /api/auth/login` : Connexion avec génération de token
- `POST /api/auth/logout` : Suppression de la session
- `POST /api/auth/refresh-token` : Régénération d'un nouveau token

---

## 📦 Installation en local

```bash
git clone https://github.com/votre-utilisateur/movie-api.git
cd movie-api
cp .env.local.example .env.local
```

Ajoutez vos variables d'environnement dans `.env.local` :

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_clé_secrète
```

Ensuite, lancez l'application :

```bash
npm install
npm run dev
```

L'application tourne sur [http://localhost:3000](http://localhost:3000)

---

## 📘 Documentation Swagger

Swagger est intégré automatiquement sur la route :

```
GET /api-doc
```

Vous y trouverez :
- Les routes détaillées
- Les modèles `Movie`, `Comment`, `User`, `Theater`
- Les schémas d'erreur standardisés

---

## ☁️ Architecture Cloud

Le projet est déployé sur [**Vercel**](https://vercel.com) avec les configurations suivantes :

- CI/CD automatique depuis GitHub
- Variables d'environnement gérées depuis le dashboard Vercel
- MongoDB Atlas comme base distante

---

## 📜 Licence

Projet open-source, vous pouvez le réutiliser ou l'améliorer librement.

---

Merci d'avoir exploré ce projet ! 🎉

