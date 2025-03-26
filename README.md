# Artisan Marketplace Platform

## Présentation du Projet

### Problématique
Les produits artisanaux, uniques et faits main, manquent souvent de visibilité en ligne face à la concurrence des grandes plateformes e-commerce. Les artisans peinent à se faire connaître, à vendre leurs créations à un public cible, et à gérer les aspects techniques de la vente en ligne.

### Solution Proposée
Une plateforme spécialisée dans les produits faits main qui répond aux besoins des artisans et des clients grâce à une interface moderne et un système robuste.

## Fonctionnalités Principales

### Gestion des Utilisateurs
- Inscription et connexion sécurisée avec authentification JWT
- Gestion des rôles : Vendeurs, Clients.

### Gestion des Produits
- Interface CRUD complète pour les vendeurs
- Système de catégorisation et filtrage avancé
- Gestion des stocks et des quantités

### Fonctionnalités Clés
- Paiement sécurisé via Stripe
- Système d'avis et de recommandations
- Pages boutique personnalisées pour les vendeurs

## Technologies Utilisées

### Frontend
- React.js
- Tailwind CSS

### Backend
- NestJS
- Authentification JWT
- Intégration Stripe

### Base de Données
- MongoDB

### Infrastructure
- Docker
- GitHub Actions (CI/CD)

## Installation et Configuration

### Prérequis
- Node.js (version 16+)
- MongoDB
- Docker
- Compte Stripe

### Étapes d'Installation

1. Cloner le dépôt
```bash
git clone https://github.com/nadaelmahfoudi/Bab-Artisanat.git
cd Bab-Artisanat
```

2. Installer les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configuration des variables d'environnement
Créer un fichier `.env` dans les dossiers `backend` et `frontend` avec les variables nécessaires :
- Clés Stripe
- Configurations de la base de données
- Secrets JWT

4. Lancement avec Docker
```bash
docker-compose up --build
```

## Structure du Projet

```
artisan-marketplace/
├── backend/
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## User Stories
### Vendeur
- Gestion complète des produits
- Page boutique personnalisée
- Notifications de commandes
- Tableau de bord de ventes

### Client
- Navigation et filtrage des produits
- Processus d'achat sécurisé
- Système d'avis
- Liste de souhaits

## Contribution

1. Forker le projet
2. Créer une branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commiter vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Pousser la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## Contact

Votre Nom - elmahfoudinada17@gmail.com

Lien du Projet: [https://[github.com/nadaelmahfoudi/Bab-Artisanat](https://github.com/nadaelmahfoudi/Bab-Artisanat)]
