# Bilan initial de validation — 19 octobre 2026

Périmètre : socle local de démonstration 0.1, objectif directeur et intégration des workflows.
Ce bilan ne prouve ni l’achèvement des 75 écrans, ni un raccordement métier, ni une recette de production.

| Vérification réellement exécutée                      | Résultat                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `bash scripts/cloud-install.sh`                       | Réussi : Node 24, `npm ci`, bootstrap complet, status, types/build et tests                                                     |
| `npm test`                                            | **17 passés, 0 échoué, 0 ignoré** : domaine, API et vérification des sources/outils                                             |
| `npm run build`                                       | Réussi : TypeScript strict et build Vite                                                                                        |
| `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`    | **12 passés, 0 échoué, 0 ignoré** sur Chromium ordinateur/téléphone                                                             |
| Largeurs navigateur                                   | Les 5 pages vérifiées sans débordement horizontal à 320/360/390/768/1024/1440                                                   |
| `npm run format:check`                                | Réussi                                                                                                                          |
| `npm audit --omit=dev`                                | 0 vulnérabilité déclarée pour les dépendances applicatives à la date de la commande ; ce n’est pas un audit de sécurité complet |
| `npm run skills:setup` répété                         | Réussi ; pas de modification des sources tierces verrouillées                                                                   |
| `npm run skills:status`                               | Origines, commits, sources propres ; **57/57** instructions gstack et **15/15** Superpowers                                     |
| Installateur officiel gstack `--status`               | Routeur réel ; **25 liens de sections**, tous résolus                                                                           |
| Navigateur gstack                                     | Navigation HTTP 200, snapshot et captures ordinateur/téléphone sur la démo locale                                               |
| `npm run dev`, puis `PORT=5173 npm run smoke`         | Réussi : Vite, proxy API, session fictive et données autorisées ; créneaux inconnus                                             |
| `bash -n scripts/cloud-install.sh scripts/dev-env.sh` | Réussi                                                                                                                          |

Les erreurs initiales ont été diagnostiquées et corrigées : cache npm hors des chemins écrits autorisés,
client HTTP ignorant le remplacement de Host, sélecteurs navigateur ambigus, états partagés entre projets
de recette et défauts reproduits par la revue indépendante. Aucun échec connu ne reste dans les suites
ci-dessus. Les régressions du formulaire, des réponses tardives, des preuves vides et des contrôles de
sources ont d’abord échoué à leurs assertions, puis passé après correction.

Les tests navigateur utilisent deux serveurs de fixtures indépendants, sur 3001 et 3002. Ils incluent
préparation d’essai, aperçu/transmission, sauvegarde de note, rafraîchissement, réponse différée et navigation.
Les tests de réponses différées synthétiques ne prétendent pas tester la persistance du serveur.

## Limites explicites

- Connexion Supabase, migrations, RLS/Storage et authentification réels : **non exécutés**, aucun accès configuré.
- Framework original, patch, prototype et tests historiques : **non disponibles** dans les sources reçues.
- Essai terrain réel, GPS/GPX/photos, synchronisation réservation, commission, Agent 1 et capacités réelles : **non raccordés**.
- Recette complète d’accessibilité, zoom 200 %, modes hors ligne, Firefox/Safari et appareils physiques : **non exécutée**.
- CSO/scanners gstack : **not assessed** ; le doctor signale le propriétaire d’un ancêtre d’état privé,
  les images de scanners indisponibles et l’absence de runtime Node qualifié. Aucune validation de ces
  scanners ou sécurité générale n’est revendiquée.
- Second fournisseur de revue, évaluations payantes, mémoire externe et déploiement de production : **non exécutés**.
- La CI GitHub est fournie, mais aucun résultat distant n’était disponible au moment de ce bilan local.

## Configuration cloud

Les champs `install_script` et `start_skill` ont été enregistrés avec succès dans le brouillon de
l’environnement. Ils décrivent l’installation reproductible, le démarrage, les contrôles et la reprise
via `GOAL.md`/`AGENTS.md`. Aucun secret ni domaine réseau supplémentaire n’a été ajouté.

Le brouillon n’exécute pas les scripts et ne publie pas le snapshot. La publication appartient à l’utilisateur
dans les paramètres de l’environnement ; aucune restauration dans une nouvelle tâche n’a été vérifiée.

## Prochaine tranche

Reprendre `GOAL.md` et la matrice, obtenir les sources DS et Agent 2 citées dans la passation, puis
réactiver/auditer Supabase avant de remplacer la session fictive. Les autres lots indépendants peuvent
avancer sans attendre Agent 1, avec état non raccordé visible. Ne déclarer aucun lot réel terminé sur
la seule base des tests de cette démonstration.
