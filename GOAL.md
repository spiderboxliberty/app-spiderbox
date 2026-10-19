# Objectif directeur — application SpiderBox Liberty complète

**Responsable métier : Hervé Gagneux.** Objectif demandé le 19 octobre 2026.

Construire et livrer une application web métier responsive complète permettant aux exploitants de
piloter leur activité dans leur organisation et leurs stations autorisées, et à Hervé d’administrer
le réseau, depuis l’invitation jusqu’aux opérations, à l’économie réconciliée et au suivi des décisions.
Une démonstration n’est pas l’objectif final : chaque capacité devra être raccordée, autorisée et prouvée.

**Référentiel visuel obligatoire :** le [projet design Lovable existant](https://lovable.dev/projects/ca29a370-a5b3-4c93-afad-8a1cbedf4f19).
Créer l’application en le prenant explicitement comme référence, réutiliser ses composants/tokens et
préserver son projet distinct. Les règles d’intégration et l’état de vérification sont dans
[DESIGN_REFERENCE.md](docs/DESIGN_REFERENCE.md).

## Références et autorité

1. Instructions explicites d’Hervé, puis décisions versionnées avec leur date et leur périmètre.
2. [Passation reçue](docs/HANDOFF_CODEX.md), notamment ses décisions prioritaires remplaçant les règles héritées.
3. Doctrine, moteurs, portes et contrats Agent 2 ; contexte des autres agents lorsque leur domaine intervient.
   « genre 2 » dans la demande d’objectif est interprété comme **Agent 2**, nommé dans la passation.
4. Sources framework, correctif, prototype, inventaires, contrats et tests historiques, une fois disponibles.
   Leur absence est un écart de sources à tracer ; leurs contenus ne doivent pas être inventés.

Le référentiel actuel est la passation ; `reference-agent2/`, `screens.json` et les exports framework ne sont
pas présents. L’ancien DDL ne doit jamais être appliqué comme un dump de la base actuelle.

**Correction d’Hervé du 19 octobre 2026 : créer le projet applicatif SpiderBox Liberty avec la base native Lovable Cloud.**
Cette instruction remplace le choix du Supabase externe historique comme cible. Vérifier les données,
l’authentification et les droits du nouveau projet Lovable lors de sa création ; aucune migration
ou réactivation du projet Supabase historique n’est requise par défaut.

## Autonomie de développement

- Poursuivre la prochaine tranche utile sans demander une confirmation de routine. Choisir les détails
  techniques réversibles, rechercher les solutions existantes et documenter les décisions significatives.
- Après validation de chaque incrément cohérent, le commiter et le pousser sur `main` sans confirmation
  supplémentaire, pour permettre à Hervé de suivre les avancées dans Lovable une fois sa liaison GitHub
  effective. Vérifier et rapporter séparément le push, la synchronisation et le déploiement.
- Interroger Hervé **uniquement si une information clé ne peut pas être déduite des sources disponibles**
  et conditionne une décision ou un raccordement réel : règle contradictoire, accès indisponible,
  délégation métier, conditions financières actives, contrat fournisseur ou budget à engager.
- Regrouper les questions indispensables ; pendant l’attente, avancer sur les parties indépendantes.
  Une absence de réponse ne fournit ni identifiants, ni budget, ni autorisation métier.
- Saisir les secrets dans les paramètres sécurisés de l’environnement, jamais dans le chat ou le dépôt.
- L’autonomie technique n’ouvre aucune porte H, ne déclenche aucune dépense et ne permet aucune
  communication engageante, migration destructive ou publication de données privées par défaut.
- Appliquer les référentiels **Superpowers et gstack à chaque phase pertinente**, conformément à
  `AGENTS.md` et au registre de capacités. Garder les preuves et signaler les capacités indisponibles.

Créer le nouveau projet applicatif dans Lovable fait partie de la mission de Codex. Aucun lien de projet
applicatif existant ne doit être réclamé à Hervé ; le framework reste un projet séparé.

## Lots et conditions de livraison

| Lot                                  | Résultat attendu                                                                                    | Preuves requises avant clôture                                                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Sources et design                | Inventaire complet, import DS réel, patch évalué, matrice des écrans/règles                         | Commit framework identifié, build/typecheck et contrôles du correctif ; divergences tracées                                            |
| 1 — Socle multiutilisateur           | Connexion/invitations, organisations, rôles/actions/stations, sites/affectations, audit et pièces   | Base native Lovable Cloud inventoriée ; tests réels A/B, IDs directs, révocation, export/Storage ; aucun secret client                 |
| 2 — Circuits et partenaires          | Essais intégraux, preuves/versions/périmètres, notes/rappels, transmissions et revue réseau         | GPS refusé/interrompu, GPX, reprise, validation locale bornée, suspension, confidentialité et publications ciblées                     |
| 3 — Territoire et assistance         | Études Mode A/B, tâches suivies, acteurs/prospects, preuves/fraîcheur et suggestions distinguées    | Routage strict 45 minutes, sources, plafonds/cache/reprises sans double coût, portes humaines préservées                               |
| 4 — Réservations et économie         | Adaptateur idempotent de l’outil source, réconciliation, charges/scénarios, attribution/commissions | Webhooks authentifiés, rejeu/hors ordre/annulation/remboursement, règles approuvées par périmètre/date, aucune double comptabilisation |
| 5 — Technique et capacité            | Contrat Agent 1 réel, incidents humains distincts des mesures, total de créneaux par période        | Inconnu tant que non raccordé ; exclusions sans double soustraction ; sécurité et fraîcheur éprouvées                                  |
| 6 — Réseau, apprentissage, expansion | Administration des 18 moteurs, 11 portes, décisions versionnées et publications                     | Historique suffisant, modèles/études approuvés, audit des actions et droits, aucune communication interexploitants                     |
| 7 — Exploitation du produit          | Déploiement web, procédures de reprise, supervision, documentation et assistance                    | Recette complète, contrôles de restauration, suivi post-déploiement et fonctions réelles explicitement identifiées                     |

## Définition de « terminé »

- Chaque règle est reliée à ses écrans, données, permissions, états, portes/dépendances et tests dans
  `docs/COVERAGE.md`. Les 75 écrans et 180 tests historiques sont rapprochés sans les confondre avec une preuve.
- Les parcours exploitant et administrateur sont fonctionnels de bout en bout sur les services réels
  prévus ; aucun écran fixture n’est présenté comme un service raccordé.
- Authentification et autorisations côté serveur sont actives dès le premier usage réel, y compris
  sur pièces, recherches et exports. Aucune organisation ne lit les informations privées d’une autre.
- Les 18 moteurs et H.01–H.11 sont couverts selon leurs contrats, sans autonomie engageante de l’IA.
  Une validation locale ne valide jamais tout le réseau ni le lancement H.09.
- Recette mobile/ordinateur : 320/360/390/768/1024/1440, clavier, zoom 200 %, focus, erreurs, hors ligne
  et reprises prévues ; aucune promesse de GPS en arrière-plan ou d’application native.
- Tests de domaine, API, base/Storage, connecteurs, navigateur et non-régression exécutés avec résultats
  distincts : passés, échoués, ignorés, non exécutés. Les échecs obligatoires bloquent la livraison concernée.
- Déploiement et vérification en environnement cible documentés, avec état de synchronisation,
  surveillance et restauration. Les migrations restent additives et versionnées après audit.

## Point de départ et reprise

Le dépôt a commencé vide, sans branche distante `main`. La tranche 0.1 crée une démonstration locale :
5 pages exploitant, préparation d’essai, relations privées et transmissions minimales en mémoire.
Elle prépare le développement mais ne clôt aucun lot réel ci-dessus.

À chaque reprise : lire ce fichier, `AGENTS.md`, la matrice de couverture et le dernier bilan de validation ;
examiner Git et les sources reçues ; continuer le prochain lot réalisable. Mettre à jour l’état et les preuves
dans le même changement que le code. Cet objectif est un engagement de projet versionné ; il ne constitue
pas un ordonnanceur de tâches en arrière-plan.
