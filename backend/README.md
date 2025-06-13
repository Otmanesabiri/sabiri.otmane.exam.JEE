# Application de Gestion de Crédits Bancaires

*Date : 13 juin 2025*

## Table des matières
1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Backend (Spring Boot)](#backend-spring-boot)
   - [Structure du Backend](#structure-du-backend)
   - [Modèle de Données](#modèle-de-données)
   - [Couche Persistence (DAO)](#couche-persistence-dao)
   - [Services](#services)
   - [Contrôleurs REST](#contrôleurs-rest)
   - [Sécurité](#sécurité)
4. [Frontend (Angular)](#frontend-angular)
   - [Structure du Frontend](#structure-du-frontend)
   - [Composants](#composants)
   - [Services](#services-angular)
   - [Routing](#routing)
   - [Sécurité et Authentification](#sécurité-et-authentification-angular)
5. [Fonctionnalités](#fonctionnalités)
6. [Technologies Utilisées](#technologies-utilisées)
7. [Installation et Déploiement](#installation-et-déploiement)
8. [Conclusion](#conclusion)

## Introduction

Cette application JEE de gestion de crédits bancaires a été développée pour permettre aux banques de gérer efficacement leurs offres de crédit. Le système prend en charge trois types de crédits (Personnel, Immobilier, Professionnel), la gestion des clients, et le suivi des remboursements.

L'architecture suit une approche moderne avec un backend Spring Boot exposant des API REST consommées par un frontend Angular. Le système intègre une sécurité robuste basée sur Spring Security avec JWT pour l'authentification et l'autorisation basée sur les rôles.

## Architecture du Projet

L'application suit une architecture en couches typique des applications d'entreprise :

- **Couche Présentation** : Frontend Angular
- **Couche API** : Contrôleurs REST Spring Boot
- **Couche Métier** : Services Spring
- **Couche Persistance** : Repositories Spring Data JPA
- **Couche Données** : Entités JPA stockées dans H2/MySQL

Cette séparation assure une maintenance facilitée et permet l'évolution indépendante de chaque couche.

## Backend (Spring Boot)

### Structure du Backend

Le backend est organisé selon les conventions Spring Boot :

```
src/main/java/com/yourname/yourfirstname/
├── CreditManagementApplication.java
├── config/
│   ├── DataLoader.java
│   └── WebSecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── ClientController.java
│   ├── CreditController.java
│   └── RemboursementController.java
├── dto/
│   ├── ClientDTO.java
│   ├── CreditDTO.java
│   ├── etc...
├── entity/
│   ├── Client.java
│   ├── Credit.java
│   ├── CreditPersonnel.java
│   ├── CreditImmobilier.java
│   ├── CreditProfessionnel.java
│   ├── Remboursement.java
│   └── User.java
├── mapper/
│   ├── ClientMapper.java
│   ├── CreditMapper.java
│   └── RemboursementMapper.java
├── repository/
│   ├── ClientRepository.java
│   ├── CreditRepository.java
│   ├── RemboursementRepository.java
│   └── UserRepository.java
├── security/
│   ├── jwt/
│   └── services/
└── service/
    ├── ClientService.java
    ├── CreditService.java
    ├── RemboursementService.java
    └── etc...
```

### Modèle de Données

Le système repose sur plusieurs entités clés :

1. **User** : Représente un utilisateur du système avec authentification.
2. **Client** : Représente un client de la banque qui peut demander des crédits.
3. **Credit** (abstrait) : Classe de base pour tous les types de crédits.
   - **CreditPersonnel** : Pour les besoins personnels.
   - **CreditImmobilier** : Pour l'achat de biens immobiliers.
   - **CreditProfessionnel** : Pour les besoins professionnels.
4. **Remboursement** : Représente un paiement effectué pour un crédit.

Le modèle utilise l'héritage avec stratégie SINGLE_TABLE pour gérer les différents types de crédits.

### Couche Persistence (DAO)

La persistance est gérée via Spring Data JPA avec des repositories pour chaque entité :

- **ClientRepository** : Gestion des clients
- **CreditRepository** : Gestion des crédits avec des méthodes spécialisées pour filtrer par type et statut
- **RemboursementRepository** : Gestion des remboursements
- **UserRepository** : Gestion des utilisateurs

Les repositories fournissent des méthodes de requêtage personnalisées, notamment pour les recherches spécifiques par type de crédit ou par statut.

### Services

La couche service contient toute la logique métier :

- **ClientService** : Gestion des clients
- **CreditService** : Gestion des demandes de crédit, calcul des échéanciers
- **RemboursementService** : Gestion des remboursements 
- **AuthService** : Services d'authentification pour la sécurité

Chaque service utilise les mappers MapStruct pour convertir entre entités et DTOs.

### Contrôleurs REST

Les API REST exposent les fonctionnalités du système :

- **/api/auth** : Authentification et enregistrement
- **/api/clients** : Gestion des clients
- **/api/credits** : Gestion des crédits
- **/api/remboursements** : Gestion des remboursements

Chaque contrôleur intègre la validation des entrées et la gestion des erreurs.

### Sécurité

La sécurité est assurée par Spring Security avec JWT :

- JWT pour l'authentification stateless
- Autorisation basée sur les rôles (ROLE_ADMIN, ROLE_EMPLOYE, ROLE_CLIENT)
- Protection des endpoints selon les rôles
- Clé de signature JWT sécurisée (256 bits)

## Frontend (Angular)

### Structure du Frontend

Le frontend est structuré selon les meilleures pratiques Angular :

```
frontend_/src/app/
├── app.config.ts
├── app.css
├── app.html
├── app.routes.ts
├── app.ts
├── components/
│   ├── clients/
│   ├── credits/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   └── remboursements/
├── guards/
│   └── auth.guard.ts
└── services/
    ├── auth.service.ts
    ├── client.service.ts
    ├── credit.service.ts
    └── remboursement.service.ts
```

### Composants

Les principaux composants du frontend sont :

1. **Dashboard** : Vue d'ensemble avec statistiques sur les crédits et clients
2. **Login/Register** : Authentification et inscription
3. **Clients** : Liste, formulaire et détails des clients
4. **Credits** : Liste, formulaire et détails des crédits
5. **Remboursements** : Gestion et suivi des remboursements

Les composants utilisent Angular Material pour une interface utilisateur moderne et réactive.

### Services Angular

Les services gèrent la communication avec le backend :

- **AuthService** : Authentification et gestion des tokens JWT
- **ClientService** : Opérations CRUD pour les clients
- **CreditService** : Opérations CRUD pour les crédits
- **RemboursementService** : Opérations CRUD pour les remboursements

Chaque service utilise HttpClient pour les appels API sécurisés.

### Routing

Le routage Angular gère la navigation entre les différentes parties de l'application :

- `/login` et `/register` pour l'authentification
- `/dashboard` pour la page d'accueil
- `/clients`, `/clients/:id`, `/clients/new` pour la gestion des clients
- `/credits`, `/credits/:id`, `/credits/new` pour la gestion des crédits
- `/remboursements` pour la gestion des remboursements

Les routes sont protégées par des guards d'authentification et d'autorisation.

### Sécurité et Authentification Angular

La sécurité côté client est assurée par :

- Stockage sécurisé des tokens JWT
- Guards d'authentification (AuthGuard)
- Guards de rôle (RoleGuard)
- Interception des requêtes HTTP pour ajouter le token JWT

## Fonctionnalités

L'application offre les fonctionnalités suivantes :

1. **Authentification et Autorisation**
   - Login/Logout
   - Enregistrement des utilisateurs
   - Contrôle d'accès basé sur les rôles

2. **Gestion des Clients**
   - Ajout, modification et suppression de clients
   - Visualisation des crédits associés à un client
   - Recherche et filtrage des clients

3. **Gestion des Crédits**
   - Création de demandes de crédit de différents types
   - Traitement et approbation des demandes
   - Calcul des échéanciers de remboursement
   - Visualisation de l'état des crédits

4. **Gestion des Remboursements**
   - Suivi des remboursements effectués
   - Ajout de nouveaux remboursements
   - Calcul des montants restants

5. **Tableau de Bord**
   - Statistiques sur les crédits
   - Indicateurs de performance
   - Vue globale de l'activité

## Technologies Utilisées

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- JSON Web Token (JWT)
- MapStruct
- H2/MySQL Database
- Maven

### Frontend
- Angular 17
- Angular Material
- TypeScript
- RxJS
- Bootstrap (pour certains composants)

## Installation et Déploiement

### Prérequis
- JDK 17 ou supérieur
- Maven 3.6 ou supérieur
- Node.js 18 ou supérieur
- npm 9 ou supérieur

### Backend
```bash
cd exam2-2025
mvn clean install
mvn spring-boot:run
```
Le backend sera disponible sur `http://localhost:8084`

### Frontend
```bash
cd frontend_
npm install
npm start
```
Le frontend sera disponible sur `http://localhost:4200`

## Conclusion

Cette application de gestion de crédits bancaires offre une solution complète et sécurisée pour gérer l'ensemble du processus de crédit, de la demande jusqu'au remboursement. Son architecture moderne et modulaire facilite la maintenance et permet l'ajout de nouvelles fonctionnalités.

L'utilisation de Spring Boot et Angular assure des performances optimales et une expérience utilisateur fluide, tout en respectant les standards actuels de l'industrie en matière de développement d'applications d'entreprise.