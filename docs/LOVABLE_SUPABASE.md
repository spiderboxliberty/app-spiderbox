# Raccordement Lovable, GitHub et Supabase

Demande d’Hervé du 19 octobre 2026 : utiliser le MCP Lovable en complément de GitHub pour livrer
l’authentification et la base. Cette demande autorise le travail de raccordement ; elle ne fournit pas
un accès technique que les outils de la session n’exposent pas.

## État constaté dans la session

- Aucun outil Lovable ou Supabase n’est exposé ; `codex mcp list --json` retourne une liste vide.
- Le Git HTTPS existant accède à `spiderboxliberty/app-spiderbox`. Le premier socle est sur `main`.
- `GH_TOKEN` est présent, sans lecture de sa valeur. L’appel à l’API GitHub a répondu `Forbidden` ;
  le test sans authentification confirme un refus HTTP 403 du tunnel CONNECT pour `api.github.com`.
  Cela ne permet pas de conclure que l’authentification Git est manquante ou invalide.
- Aucune variable Lovable, Supabase ou de connexion PostgreSQL n’est injectée, et aucun binding
  correspondant n’est enregistré dans la configuration cloud.
- Le test de l’endpoint Supabase indiqué dans la passation est également refusé par le tunnel CONNECT
  (HTTP 403). **Le statut actif/inactif de la base n’a donc pas été vérifié.**
- Aucune table, politique RLS, identité ou configuration d’authentification n’a été modifiée.

## Accès nécessaires pour continuer

1. Rendre le MCP Lovable disponible dans cette conversation avec les droits de consultation et
   modification du projet autorisé. Le projet `ca29a370-a5b3-4c93-afad-8a1cbedf4f19` cité dans la
   passation est le **framework de design**, pas automatiquement le projet de l’application métier.
   Lire l’inventaire Lovable et les liaisons Git/Supabase avant de sélectionner la cible applicative.
2. Obtenir un accès au projet Supabase **existant** `ouceotegjbhyruvztgtz`, via le MCP autorisé ou une
   connexion d’audit sécurisée. Vérifier son état réel ; s’il est suspendu et si la réactivation entraîne
   un coût, obtenir le budget applicable avant de l’engager.
3. Autoriser les destinations HTTPS réellement requises dans l’environnement. Les demandes initiales
   sont `api.github.com` et `ouceotegjbhyruvztgtz.supabase.co`. Une règle réseau ne connecte aucun MCP,
   n’authentifie aucun compte et ne réactive pas une base.
4. Saisir les credentials éventuels uniquement dans les paramètres sécurisés. Ne pas fournir de clé
   service-role dans le navigateur, le dépôt ou le chat. Réutiliser les authentifications MCP injectées
   avant de réclamer une nouvelle clé ; ne pas demander un token GitHub pour les opérations Git qui fonctionnent.

L’absence actuelle du MCP ne justifie pas d’utiliser des cookies d’un navigateur personnel ni de
prétendre que GitHub administre Lovable. Les appels Git, API GitHub, MCP Lovable et SQL sont des accès distincts.

## Audit préalable

Le script [audit-readonly.sql](../ops/supabase/audit-readonly.sql) est un premier inventaire des catalogues :
relations, colonnes, contraintes, RLS, expressions de politiques, fonctions privilégiées, triggers,
droits visibles et extensions. Il utilise une transaction `READ ONLY`, des délais bornés et `ROLLBACK`.
Il ne lit aucune ligne de table applicative, de `auth.users`, de secrets ou de fichiers Storage.
Il ne récupère pas les corps de fonctions ni les arguments de triggers, susceptibles de contenir des données sensibles.

Ce script **n’a pas été exécuté contre la base existante**. L’accès aux métadonnées dépend du rôle :
les vues `information_schema` peuvent être partielles. Exécuter avec un rôle d’audit approprié et
consigner le rôle, la date UTC et les lacunes. Conserver les résultats dans un emplacement privé ignoré,
par exemple `.cache/audits/`, jamais dans un commit contenant des données réelles.

Compléter l’inventaire via les interfaces autorisées : schémas réellement exposés par l’API,
configuration Auth (sans secrets), fournisseurs activés, invitations, inscription publique,
URLs de redirection et origine applicative, SMTP, buckets/visibilité/limites, fonctions privilégiées
et sauvegarde/restauration. Un inventaire SQL ne prouve pas l’efficacité des droits ou du stockage.

## Ordre de mise en œuvre après audit

1. Confirmer le projet applicatif Lovable et sa liaison au bon dépôt/branche GitHub, puis importer
   le framework sans transformer son projet de design en application métier.
2. Mapper les tables et règles existantes pour utilisateurs, organisations, memberships,
   permissions par action/station et supervision Hervé. Préparer des migrations **additives** et
   versionnées uniquement pour les écarts réellement constatés ; ne pas exécuter le DDL historique en bloc.
3. Raccorder Supabase Auth, les invitations et les sessions réelles. Vérifier l’identité côté serveur,
   puis les droits courants à chaque opération ; ne jamais accepter un rôle admin dans des métadonnées utilisateur.
4. Remplacer les stores fixtures par les adapters réels avec RLS, permissions minimales et audit durable.
   Aucun succès d’authentification ne donne accès aux données sans vérification organisation/station.
5. Vérifier deux organisations, IDs directs, membership révoqué, station exclue, recherches, exports,
   pièces/URLs signées et publications. Tester les chemins d’erreur et les migrations rejouables/restauration.
6. Pousser le code validé sur GitHub et vérifier sa synchronisation dans le projet Lovable. Publier
   uniquement les capacités réellement raccordées ; ne pas exposer la session fixe de démonstration.

Ni l’ajout de ce document ni celui du script ne constitue un déploiement d’authentification ou de base.

## Préparatifs vérifiés

- Le parseur PostgreSQL `pglast` 7.21 valide la syntaxe des 14 instructions : 10 `SELECT`, 2 réglages
  de transaction et 2 instructions de transaction. Ce contrôle ne résout pas les catalogues sur le serveur
  réel, ne vérifie pas les permissions et n’exécute aucune requête sur Supabase.
- Revue indépendante statique du script et du protocole : aucun défaut critique ou important relevé.
- Les 17 tests existants domaine/API/outillage passent ; ils ne testent aucune connexion Supabase réelle.
- Les deux domaines HTTPS ont été ajoutés au **brouillon** cloud ; les scripts existants sont conservés.
  La sauvegarde n’applique pas les règles au runtime et ne publie pas l’environnement. Revoir/enregistrer
  les paramètres puis publier selon le flux de l’interface avant de revérifier les accès.

La prochaine étape bloquante est de rendre les outils MCP Lovable et l’accès d’audit Supabase disponibles,
puis de réessayer les opérations concernées après ce changement effectif.
