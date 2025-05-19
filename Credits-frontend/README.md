# DigitalbankingFrontend

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

## Serveur de développement

Pour démarrer un serveur de développement local, exécutez :

```bash
ng serve
```

Une fois le serveur démarré, ouvrez votre navigateur et accédez à `http://localhost:4200/`. L'application se rechargera automatiquement chaque fois que vous modifierez l'un des fichiers sources.

## Échafaudage de code (Code scaffolding)

Angular CLI inclut de puissants outils d'échafaudage de code. Pour générer un nouveau composant, exécutez :

```bash
ng generate component nom-du-composant
```

Pour une liste complète des schémas disponibles (tels que `components`, `directives`, ou `pipes`), exécutez :

```bash
ng generate --help
```

## Compilation (Building)

Pour compiler le projet, exécutez :

```bash
ng build
```

Cela compilera votre projet et stockera les artefacts de compilation dans le répertoire `dist/`. Par défaut, la compilation de production optimise votre application pour la performance et la vitesse.

## Exécution des tests unitaires

Pour exécuter les tests unitaires avec le lanceur de tests [Karma](https://karma-runner.github.io), utilisez la commande suivante :

```bash
ng test
```

## Exécution des tests de bout en bout (end-to-end)

Pour les tests de bout en bout (e2e), exécutez :

```bash
ng e2e
```

Angular CLI n'est pas livré avec un framework de test de bout en bout par défaut. Vous pouvez choisir celui qui correspond à vos besoins.

## Ressources supplémentaires

Pour plus d'informations sur l'utilisation d'Angular CLI, y compris les références de commandes détaillées, visitez la page [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## Rapport de la Phase Frontend

Cette section fournit un résumé de la phase de développement frontend pour l'application Digital Banking.

### 1. Aperçu

Le frontend est une application monopage (SPA) construite avec Angular. Il fournit l'interface utilisateur pour interagir avec les services backend de Digital Banking. Les utilisateurs peuvent gérer leurs profils, consulter les détails de leurs comptes, effectuer des opérations, et les administrateurs peuvent gérer les clients et les comptes.

### 2. Technologies Utilisées

*   **Angular (version basée sur la CLI, par ex., v17+)**: Framework principal pour la construction de la SPA.
*   **TypeScript**: Langage de programmation principal.
*   **HTML5 & CSS3**: Pour la structure et le style.
*   **Bootstrap 5**: Framework CSS pour un design réactif et des composants d'interface utilisateur.
*   **NgBootstrap**: Widgets Angular pour Bootstrap (utilisés pour les modales).
*   **Ng2-Charts (Chart.js)**: Pour afficher des graphiques sur le tableau de bord.
*   **RxJS**: Pour la programmation réactive et la gestion des opérations asynchrones.
*   **Angular CLI**: Pour la génération de projet, la compilation et les tâches de développement.

### 3. Fonctionnalités Clés Mises en Œuvre

*   **Authentification des Utilisateurs**:
    *   Page de connexion avec validation de formulaire.
    *   Page d'inscription des utilisateurs.
    *   Gestion des jetons JWT (stockage et inclusion dans les requêtes API via un intercepteur HTTP).
    *   Fonctionnalité de déconnexion.
*   **Navigation & Mise en Page**:
    *   Barre de navigation réactive avec des liens conditionnels basés sur le statut d'authentification et les rôles des utilisateurs.
    *   Routage pour les différentes sections de l'application.
*   **Tableau de Bord Général**:
    *   Cartes récapitulatives (Nombre total de clients, Nombre total de comptes, Solde total).
    *   Graphiques affichant les types et statuts des comptes.
*   **Gestion des Clients (Vue Administrateur)**:
    *   Liste des clients avec fonctionnalité de recherche.
    *   Consultation des détails des clients.
    *   Création de nouveaux clients (via modale/formulaire).
    *   Modification des clients existants (via formulaire).
    *   Suppression des clients.
*   **Gestion des Comptes**:
    *   Liste des comptes bancaires avec fonctionnalité de recherche.
    *   Consultation des détails des comptes, y compris l'historique des transactions (paginé).
    *   Création de nouveaux comptes courants et d'épargne (via des formulaires dédiés).
    *   Réalisation de virements de fonds entre comptes (via modale).
*   **Gestion des Crédits**:
    *   Simulation de crédits (personnels, immobiliers, professionnels) permettant aux utilisateurs d'estimer les mensualités et les coûts.
    *   Soumission de demandes de crédit via un formulaire dynamique adapté au type de crédit sélectionné.
    *   Liste des demandes de crédit avec leur statut (par ex., En attente, Approuvé, Rejeté), consultable par les utilisateurs et les administrateurs.
    *   Affichage des détails complets d'une demande de crédit.
    *   Tableau de bord des crédits (potentiellement pour visualiser des statistiques sur les crédits et faciliter la gestion des demandes par les administrateurs).
    *   Possibilité pour les administrateurs de changer le statut des demandes de crédit (Approuver, Rejeter, Demander plus d'informations).
*   **Opérations Bancaires**:
    *   Consultation d'une liste de toutes les opérations (espace réservé, pourrait être amélioré).
    *   Réalisation d'opérations de débit/crédit (via des modales dans les Détails du Compte ou une page d'opérations dédiée).
*   **Gestion du Profil Utilisateur**:
    *   Consultation des informations du profil utilisateur.
    *   Modification du mot de passe utilisateur.

### 4. Architecture et Conception

*   **Architecture Basée sur les Composants**: L'application est structurée en composants réutilisables et modulaires.
*   **Services**: Services dédiés pour interagir avec l'API backend (par ex., `AuthService`, `CustomerService`, `AccountService`, `CreditService`).
*   **Routage**: Angular Router gère la navigation entre les différentes vues.
*   **Gardes (Guards)**:
    *   `AuthGuard`: Protège les routes nécessitant une authentification.
    *   `AdminGuard`: Protège les routes nécessitant des privilèges d'administrateur.
*   **Intercepteur HTTP (`AuthInterceptor`)**: Attache automatiquement les jetons JWT aux requêtes API sortantes.
*   **Formulaires Réactifs (Reactive Forms)**: Utilisés pour la gestion des données de formulaire et la validation (par ex., Connexion, Inscription, Formulaire Client, Formulaire Compte, Formulaire Crédit).
*   **Composants Autonomes (Standalone Components)**: La plupart des composants sont implémentés en tant que composants autonomes, simplifiant la gestion des modules.
*   **Modèles (Models)**: Des interfaces TypeScript définissent la structure des données (par ex., `Customer`, `BankAccount`, `AccountOperation`, `Credit`, `PersonalCredit`, `MortgageCredit`, `ProfessionalCredit`, `CreditStatus`).

### 5. Composants Clés

*   `AppComponent`: Composant racine.
*   `NavbarComponent`: Barre de navigation principale.
*   `LoginComponent`: Connexion utilisateur.
*   `RegisterComponent`: Inscription utilisateur.
*   `DashboardComponent`: Aperçu général et graphiques (pour les comptes et clients).
*   `CustomersComponent`: Liste et gère les clients.
*   `CustomerFormComponent`: Pour la création/modification des clients.
*   `CustomerDetailsComponent`: Affiche les détails d'un client unique et de ses comptes.
*   `AccountsComponent`: Liste et gère les comptes bancaires.
*   `AccountFormComponent`: Pour la création de nouveaux comptes bancaires.
*   `AccountDetailsComponent`: Affiche les détails d'un compte bancaire unique et de ses opérations.
*   `CreditDashboardComponent`: Tableau de bord pour la visualisation des informations et statistiques relatives aux crédits.
*   `CreditDetailsComponent`: Affiche les détails d'une demande de crédit spécifique, en utilisant des gardes de type pour afficher les informations pertinentes au type de crédit.
*   `CreditFormComponent`: Formulaire dynamique pour la création ou la soumission d'une demande de crédit (personnel, immobilier, professionnel).
*   `CreditListComponent`: Liste les demandes de crédit, permet le filtrage et la gestion de leur statut par les administrateurs.
*   `CreditSimulationComponent`: Permet aux utilisateurs de simuler différents types de crédits (personnel, immobilier, professionnel) et de visualiser les échéanciers.
*   `OperationsComponent`: Vue générale des opérations (peut être étendue).
*   `TransferOperationComponent`: Modale pour les virements de fonds.
*   `ProfileComponent`: Vue du profil utilisateur.
*   `ChangePasswordComponent`: Pour changer le mot de passe utilisateur.

### 6. Gestion de l'État

*   Principalement gérée au sein des composants et services individuels.
*   `AuthService` utilise `BehaviorSubject` pour gérer et diffuser l'état d'authentification de l'utilisateur actuel.
*   RxJS est largement utilisé pour gérer les flux de données asynchrones provenant des appels API.

### 7. Style

*   **Bootstrap 5**: Fournit le style de base et le système de grille réactif.
*   **CSS Personnalisé**: Des styles spécifiques aux composants sont appliqués pour personnaliser l'apparence et la mise en page.
*   **Icônes Bootstrap**: Utilisées pour l'iconographie.

### 8. Défis et Solutions (Illustratif)

*   **Problèmes de Rendu des Graphiques**: Erreurs "can't acquire context" rencontrées avec `ng2-charts`. Résolu en s'assurant que `NgChartsModule` était correctement importé dans les composants autonomes et que l'élément canvas était disponible dans le DOM au moment de l'initialisation du graphique. Hauteurs des conteneurs de graphiques ajustées pour éviter la coupure de la légende.
*   **Intégration JavaScript de Bootstrap**: Pour les composants autonomes, le JS de Bootstrap (pour les menus déroulants, modales) a été chargé dynamiquement dans `AppComponent` ou en utilisant les composants NgBootstrap.
*   **Configuration de l'Intercepteur JWT**: `AuthInterceptor` configuré en utilisant `provideHttpClient(withInterceptors(...))` pour la configuration d'application autonome.
*   **Problèmes CORS**: Gérés en configurant le backend pour autoriser les requêtes provenant de l'origine du frontend (`http://localhost:4200`).
*   **Validation et Soumission des Formulaires Réactifs**: Implémentation d'une validation de formulaire robuste et de retours utilisateur pour divers formulaires.
*   **Gestion des Types Spécifiques de Crédit**: Assurer l'affichage correct des propriétés spécifiques à chaque type de crédit (`PersonalCredit`, `MortgageCredit`, `ProfessionalCredit`) dans les templates en utilisant des gardes de type TypeScript (`isPersonalCredit`, etc.) et des conteneurs conditionnels (`<ng-container *ngIf>`).
*   **Erreurs de Parsing de Template Angular (NG5002, NG3, NG5, NG9)**: Résolution de diverses erreurs de template liées à l'accès aux propriétés, aux liaisons d'événements et à l'utilisation d'énumérations, en s'assurant de la bonne syntaxe et de la disponibilité des types dans le contexte du template.

### 9. Améliorations Futures (Potentielles)

*   Solution de gestion d'état plus sophistiquée (par ex., NgRx ou Elf) si la complexité de l'application augmente.
*   Tableaux de données avancés avec pagination, tri et filtrage côté serveur pour les listes (clients, comptes, opérations, crédits).
*   Notifications en temps réel (par ex., pour les nouvelles transactions ou les changements de statut de crédit).
*   Amélioration de l'UI/UX et des animations.
*   Tests unitaires et de bout en bout plus complets, notamment pour le module de gestion des crédits.
*   Internationalisation (i18n).

Ce rapport résume l'état et la structure du système frontend tel que développé.
