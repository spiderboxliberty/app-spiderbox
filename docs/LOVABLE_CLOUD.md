# Création de l’application SpiderBox Liberty dans Lovable Cloud

## Décisions explicites d’Hervé

Le projet applicatif est **à créer par Codex** et s’appellera **SpiderBox Liberty**.
Il utilisera la base native **Lovable Cloud**, ainsi que son authentification et son stockage gérés.
Le projet framework de design `ca29a370-a5b3-4c93-afad-8a1cbedf4f19` reste distinct.
Aucun lien de projet applicatif existant n’est demandé à Hervé comme préalable à la création.

Cette instruction remplace la cible Supabase externe de la passation. Ne pas réactiver le projet
historique, lui envoyer des migrations, demander ses clés ou créer un backend externe par défaut.
Le nom du moteur sous-jacent, les endpoints et les SDK se vérifient sur le nouveau projet natif ;
ils ne se déduisent pas de l’identifiant Supabase historique.

## Accès observés dans cette session

- La mention `@Lovable` est présente dans le message utilisateur. Cependant, la liste complète des
  outils accessibles à cette session ne contient aucun outil Lovable de création, lecture ou écriture.
  Le catalogue de skills cloud ne contient que l’onboarding. Il s’agit d’une limite de cette session,
  pas d’une affirmation sur l’installation du plugin sur le compte d’Hervé.
- L’accès Git HTTPS au dépôt `spiderboxliberty/app-spiderbox` fonctionne. Les préparatifs y sont versionnés.
- L’API GitHub a rencontré un refus HTTP 403 du tunnel CONNECT ; l’accès Git reste distinct de l’accès API.
- Aucun projet applicatif Lovable, backend natif, compte utilisateur ou schéma réel n’a été créé depuis
  cette session. Aucune synchronisation Lovable/GitHub ni aucun déploiement réel n’est revendiqué.

Le prérequis bloquant est de disposer des outils du plugin Lovable dans le contexte exécutant la tâche.
Le CLI local ne permet pas de piloter une intégration ChatGPT dont les outils ne sont pas exposés.
Ne pas extraire de cookies ou de credentials, inventer un endpoint MCP ou présenter un fichier local
comme la création effective d’un projet distant.

## Création et raccordement à effectuer via Lovable

1. Créer le **nouveau projet applicatif SpiderBox Liberty** en prenant le projet design
   `ca29a370-a5b3-4c93-afad-8a1cbedf4f19` comme référentiel obligatoire. Suivre
   [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md), vérifier la référence dans Lovable, reprendre ses composants
   et tokens, préserver son projet distinct et tracer les adaptations nécessaires.
2. Examiner le mécanisme de connexion/import GitHub offert par Lovable et le dépôt `app-spiderbox`
   avant de le relier. Conserver le code et les commits existants. Ne pas remplacer aveuglément le
   dépôt par un export ou prétendre qu’une synchronisation non vérifiée fonctionne.
3. Initialiser la base native, Auth et les fichiers via les capacités officielles Lovable. Examiner
   les tables, les droits et les valeurs par défaut effectivement générés avant d’ajouter le modèle métier.
   Aucune dépense fournisseur externe n’est activée par cette préparation.
4. Définir organisations, utilisateurs/appartenances, permissions par action/station, sites,
   affectations et audit. Appliquer les changements de schéma de manière versionnée et réversible ;
   ne pas réutiliser le DDL historique sans correspondance avec la base réelle.
5. Activer les invitations et les sessions réelles. Vérifier l’identité et les droits courants côté
   serveur à chaque opération. Aucun rôle administrateur accepté depuis un sélecteur client ou des
   métadonnées modifiables par l’utilisateur. Aucun secret privilégié dans le bundle web.
6. Raccorder les données du frontend au backend natif ; remplacer les fixtures pour les fonctions
   réellement raccordées. La session fixe de démonstration ne doit pas être exposée comme une connexion réelle.
7. Vérifier deux organisations, accès par ID direct, station exclue, appartenance révoquée,
   fichiers/URLs signées, recherches/exports et transmissions. Conserver l’absence de communication
   interexploitants, la confidentialité des notes et la décision H.09 distincte de la validation locale.
8. Vérifier le build/typecheck, les parcours mobile/ordinateur et la synchronisation GitHub, puis
   publier les fonctions effectivement prouvées. Consigner URL, projet, révision et état du déploiement
   uniquement lorsqu’ils ont été retournés ou vérifiés par les outils réels.

## Référence SQL, sans cible implicite

[audit-readonly.sql](../ops/reference-postgresql/audit-readonly.sql) reste une **référence PostgreSQL**
utilisable seulement si le moteur et une interface SQL autorisée du backend natif sont confirmés.
Il ne constitue ni une migration native Lovable, ni un prérequis exigeant une connexion Supabase externe.
Le script lit les catalogues dans une transaction `READ ONLY` avec délais bornés et `ROLLBACK`.
Il ne lit aucune ligne de table applicative, aucun utilisateur, aucun fichier et aucun secret stocké.
Les résultats de métadonnées restent privés et ne sont pas ajoutés à Git.

Sa syntaxe a été analysée avec `pglast` 7.21 : 14 instructions, dont 10 `SELECT`. Aucun SQL n’a été exécuté
contre un backend réel. La revue indépendante précédente concernait uniquement cette référence et
la procédure préparatoire ; les 17 tests locaux existants ne prouvent aucun raccordement natif.

## Configuration cloud

Les instructions de reprise et le goal doivent viser la création de SpiderBox Liberty avec Lovable Cloud.
L’autorisation réseau de l’ancien endpoint Supabase, ajoutée pendant la préparation précédente, est
retirée du brouillon : elle ne correspond plus à la cible demandée. Les autres règles existantes sont
conservées. Les domaines propres au nouveau backend ne seront déclarés qu’après identification réelle.
La modification du brouillon ne connecte aucun plugin et ne publie pas l’environnement.
