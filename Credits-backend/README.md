## Rapport de la Phase Backend

Cette section fournit un résumé de la phase de développement backend pour l'application Digital Banking.

### 1. Aperçu

Le backend est un service API RESTful construit avec Java et le framework Spring Boot. Il gère toute la logique métier, la persistance des données et la sécurité de l'application. Les fonctionnalités clés incluent la gestion des clients, les opérations sur les comptes bancaires, le traitement des transactions, l'authentification/autorisation des utilisateurs, ainsi que la **gestion des crédits**.

### 2. Technologies Utilisées

*   **Java 17** : Langage de programmation principal.
*   **Spring Boot 3.x** : Framework pour construire des applications robustes et évolutives.
    *   **Spring MVC** : Pour la création de services web RESTful.
    *   **Spring Data JPA** : Pour la persistance des données et l'interaction avec la base de données.
    *   **Spring Security** : Pour la gestion de l'authentification et de l'autorisation.
*   **JSON Web Tokens (JWT)** : Pour sécuriser les endpoints API et gérer les sessions utilisateur.
*   **Hibernate** : Implémentation JPA pour l'ORM.
*   **Maven** : Automatisation de la compilation et gestion des dépendances.
*   **Base de données** :
    *   **H2 Database** : Base de données en mémoire pour le développement et les tests.
    *   **MySQL** : Base de données relationnelle pour les environnements de production.
*   **Lombok** : Pour réduire le code répétitif (getters, setters, constructeurs).
*   **MapStruct** : Pour le mapping entre DTOs et Entités.
*   **Swagger/OpenAPI 3** : Pour la documentation et le test de l'API (accessible via `/swagger-ui.html`).

### 3. Fonctionnalités Clés Implémentées

*   **Authentification & Autorisation** :
    *   Inscription utilisateur (`/api/auth/signup`).
    *   Connexion utilisateur avec génération de JWT (`/api/auth/login`).
    *   Changement de mot de passe (`/api/auth/changePassword`).
    *   Contrôle d'accès basé sur les rôles (RBAC) avec les rôles "ADMIN" et "USER".
    *   Endpoints sécurisés via Spring Security et JWT.
    *   Récupération du profil utilisateur (`/api/auth/profile`).
*   **Gestion des Clients (Admin)** :
    *   Opérations CRUD sur les clients (Créer, Lire, Mettre à jour, Supprimer).
    *   Recherche de clients.
    *   Endpoints : `/api/customers`.
*   **Gestion des Comptes Bancaires** :
    *   Création de comptes courants et d'épargne.
    *   Récupération des détails et listes de comptes.
    *   Récupération des comptes associés à un client spécifique.
    *   Endpoints : `/api/accounts`.
*   **Opérations sur les Comptes** :
    *   Opérations de débit et crédit sur les comptes bancaires.
    *   Virements entre comptes.
    *   Récupération de l'historique des opérations avec pagination.
    *   Endpoints : `/api/accounts/{accountId}/operations`, `/api/accounts/debit`, `/api/accounts/credit`, `/api/accounts/transfer`.
*   **Gestion des Crédits** :
    *   Soumission de demandes de crédit (Personnel, Immobilier, Professionnel).
    *   Consultation des détails et listes de demandes de crédit (toutes ou par client).
    *   Mise à jour du statut des demandes de crédit (ex : Approuvé, Rejeté) par les administrateurs.
    *   Simulation de crédits (calcul de la mensualité, coût total) selon le type, le montant et la durée.
    *   Endpoints : `/api/credits`, `/api/credits/simulate`, `/api/credits/{id}/status`.
*   **Gestion des Utilisateurs (Admin)** :
    *   Liste des utilisateurs.
    *   Attribution/retrait de rôles aux utilisateurs.
    *   Endpoints : `/api/admin/users`, `/api/admin/roles`.

### 4. Architecture et Conception

*   **Architecture en Couches** :
    *   **Contrôleur** : Gère les requêtes et réponses HTTP (APIs REST).
    *   **Service** : Contient la logique métier.
    *   **Repository** : Interagit avec la base de données via Spring Data JPA.
    *   **Entités** : Modèles de données JPA, incluant une classe de base `Credit` avec des sous-classes pour `PersonalCredit`, `MortgageCredit` et `ProfessionalCredit` (héritage single-table).
    *   **DTO (Data Transfer Object)** : Pour le transfert de données entre les couches, notamment pour les réponses et requêtes API (ex : `CreditDTO`, `PersonalCreditDTO`).
    *   **Mapper** : Conversion entre DTOs et Entités via MapStruct (ex : `CreditMapper`).
*   **Sécurité** :
    *   `JwtAuthenticationFilter` pour valider les tokens JWT à chaque requête.
    *   Implémentation de `UserDetailsService` pour charger les données utilisateur.
    *   `PasswordEncoder` (BCrypt) pour stocker les mots de passe de façon sécurisée.
    *   `AuthenticationEntryPoint` personnalisé pour gérer les accès non autorisés.
*   **Gestion des Erreurs** :
    *   Exceptions personnalisées (ex : `CustomerNotFoundException`, `BankAccountNotFoundException`, `BalanceNotSufficientException`, `CreditNotFoundException`, `InvalidCreditTypeException`).
    *   Gestion globale des exceptions (généralement via `@ControllerAdvice`).
*   **Audit** :
    *   Champs d'audit de base (`createdBy`, `lastModifiedBy`, `createdAt`, `updatedAt`) présents dans des entités comme `Credit`, remplis automatiquement ou avec le nom d'utilisateur authentifié.

### 5. Schéma de la Base de Données

*   **`Customer`** : Stocke les informations des clients.
*   **`BankAccount`** : Classe de base abstraite pour les comptes bancaires, héritage single-table (`CurrentAccount`, `SavingAccount`).
*   **`AccountOperation`** : Historique de toutes les transactions (débit, crédit).
*   **`AppUser`** : Stocke les identifiants et rôles des utilisateurs.
*   **`AppRole`** : Définit les rôles utilisateurs (ex : ADMIN, USER).
*   **`Credit`** : Entité de base pour les demandes de crédit, héritage single-table pour stocker les champs spécifiques à `PersonalCredit`, `MortgageCredit` et `ProfessionalCredit`. Inclut les champs communs (montant, durée, statut, client associé).

### 6. Configuration

*   **`application.properties`** : Configuration centralisée (port serveur, connexion BDD H2/MySQL, secrets JWT, logs).
*   **Configuration CORS** : Permet les requêtes du frontend (typiquement `http://localhost:4200`).
*   **Données Initiales** : `CommandLineRunner` dans la classe principale pour créer les rôles (ADMIN, USER) et utilisateurs par défaut au démarrage.

### 7. Défis et Solutions (Illustratif)

*   **Incohérence de la signature JWT** : S'assurer que la clé secrète utilisée pour signer et valider les JWT est identique et traitée de façon cohérente (UTF-8, Base64). Résolu en standardisant la dérivation de la clé dans `JwtUtils.java` et `JWTService.java` et en vérifiant la configuration dans `application.properties`.
*   **Parsing des fichiers de propriétés** : Correction du formatage des propriétés numériques avec commentaires dans `application.properties` pour éviter les `NumberFormatException`.
*   **Problèmes d'initialisation paresseuse (Lazy Initialization)** : Utilisation de DTOs et gestion des transactions pour éviter les `LazyInitializationException`. Utilisation de `@Lazy` sur `UserDetailsService` pour casser les dépendances circulaires.
*   **Gestion des types de crédit polymorphes** : Héritage single-table pour les entités `Credit` et utilisation de MapStruct avec des mappers personnalisés ou `@SubclassMapping` pour la conversion DTO. Les contrôleurs/services traitent et retournent les bons DTO selon le type de crédit.
*   **Sécurisation de la mise à jour des statuts** : Seuls les utilisateurs avec le rôle "ADMIN" peuvent modifier le statut des demandes de crédit.

### 8. Améliorations Futures (Potentielles)

*   Permissions plus granulaires.
*   Authentification à deux facteurs.
*   Reporting et analyses avancés pour les crédits (ex : taux d'approbation, évaluation des risques).
*   Intégration de services externes (ex : notifications email lors des changements de statut de crédit).
*   Audit plus complet des opérations de crédit.
*   Scoring automatique des crédits selon des règles prédéfinies.

Ce rapport résume l'état et la structure du système backend tel que développé.

## Connexion Frontend avec Backend

### Configuration du Backend

1. **Activer CORS dans Spring Boot** :
   Créer une classe de configuration CORS dans le backend :

   ```java
   // dans le package ma.digitbank.jeespringangularjwtdigitalbanking.config
   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
               .allowedOrigins("http://localhost:4200")
               .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
               .allowedHeaders("*")
               .allowCredentials(true)
               .maxAge(3600);
       }
   }
   ```

2. **Configurer la Sécurité pour Autoriser CORS** :
   Mettre à jour la classe SecurityConfig pour permettre les requêtes préalables CORS :

   ```java
   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
           .cors(Customizer.withDefaults()) // Activer CORS
           .csrf(AbstractHttpConfigurer::disable)
           // ...reste de votre configuration de sécurité
   }
   ```

### Configuration du Frontend

1. **Configuration de l'Environnement** :
   Créer ou mettre à jour les fichiers d'environnement pour stocker l'URL de l'API :

   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

2. **Intercepteur HTTP pour l'Authentification** :
   Créer un intercepteur JWT pour ajouter le token à toutes les requêtes :

   ```typescript
   // src/app/interceptors/auth.interceptor.ts
   import { Injectable } from '@angular/core';
   import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { AuthService } from '../services/auth.service';

   @Injectable()
   export class AuthInterceptor implements HttpInterceptor {
     constructor(private authService: AuthService) {}

     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       const token = this.authService.getToken();

       if (token) {
         const cloned = req.clone({
           headers: req.headers.set('Authorization', `Bearer ${token}`)
         });
         return next.handle(cloned);
       }
       return next.handle(req);
     }
   }
   ```

3. **Enregistrer l'Intercepteur** :
   Mettre à jour votre app.config.ts :

   ```typescript
   // src/app/app.config.ts
   import { provideHttpClient, withInterceptors } from '@angular/common/http';
   import { authInterceptor } from './interceptors/auth.interceptor';

   export const appConfig: ApplicationConfig = {
     providers: [
       // ...autres providers
       provideHttpClient(withInterceptors([authInterceptor])),
     ]
   };
   ```

4. **Mettre à Jour les Services API** :
   S'assurer que toutes les classes de service API utilisent la configuration de l'environnement :

   ```typescript
   // src/app/services/customer.service.ts
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { environment } from '../../environments/environment';
   import { Customer } from '../models/customer.model';

   @Injectable({
     providedIn: 'root'
   })
   export class CustomerService {
     private apiUrl = `${environment.apiUrl}/customers`;

     constructor(private http: HttpClient) {}

     getCustomers(): Observable<Customer[]> {
       return this.http.get<Customer[]>(this.apiUrl);
     }

     // ...autres méthodes
   }
   ```

### Tester la Connexion

1. **Démarrer le Backend** :
   ```bash
   cd /home/red/Documents/GitHub/-JEE-Spring-Angular-JWT---Digital-Banking/digitalbanking-backend
   mvn spring-boot:run
   ```

2. **Démarrer le Frontend** :
   ```bash
   cd /home/red/Documents/GitHub/-JEE-Spring-Angular-JWT---Digital-Banking/digitalbanking-frontend
   ng serve
   ```

3. **Vérifier l'Accès à l'API** :
   - Ouvrir la console du navigateur pour vérifier les erreurs CORS ou de connexion
   - Tester les endpoints API via l'interface utilisateur
   - Vérifier que le flux d'authentification fonctionne correctement

### Dépannage des Problèmes de Connexion

- **Erreurs CORS** :
  - S'assurer que la configuration CORS autorise votre origine frontend
  - Vérifier les fautes de frappe dans l'URL d'origine autorisée
  - Vérifier que toutes les méthodes HTTP nécessaires sont autorisées

- **Problèmes d'Authentification** :
  - Confirmer que le token JWT est correctement stocké après la connexion
  - Vérifier que le token est correctement inclus dans les en-têtes des requêtes
  - Vérifier l'expiration du token et la logique de rafraîchissement

- **Erreurs Réseau** :
  - Vérifier que les deux applications fonctionnent sur les ports attendus
  - Vérifier les paramètres de proxy qui pourraient interférer
  - S'assurer que votre pare-feu autorise les connexions
