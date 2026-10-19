# Développement systématique avec Superpowers et gstack

Demande explicite d’Hervé du 19 octobre 2026 : intégrer les deux suites à l’ensemble du projet,
revoir l’existant, puis appliquer leurs workflows pertinents jusqu’à l’application complète.
L’objectif produit est dans `GOAL.md` ; les règles exécutables de reprise sont dans `AGENTS.md`.

## Installation durable et périmètre

Les **15 skills Superpowers 7.0.0** et **57 entrées gstack 1.91.144.0 pour Codex** (routeur + 56
spécialistes) sont inventoriés intégralement dans [SKILLS_CATALOG.md](SKILLS_CATALOG.md).
Les sources officielles et leurs commits exacts sont verrouillés par `skills-lock.json`.
Les sources, binaires, rendus et états sont des dépendances ignorées ; ils ne font pas partie du bundle web.

```sh
npm ci --cache /workspace/.cache/npm
npm run skills:setup
npm run skills:status
source scripts/dev-env.sh
```

Le bootstrap vérifie origine, commit et propreté de chaque source avant toute exécution. Il ne
réinitialise jamais une source modifiée. Il utilise l’installateur officiel gstack `--host codex --prefix
--no-browser`, puis son contrôle officiel `--status`. `skills:status` vérifie le catalogue verrouillé
complet et ses fichiers `SKILL.md` réels, y compris le routeur ; un résultat partiel échoue.

Chemins :

- Superpowers : `.agents/skills/superpowers/skills/`. Lire `using-superpowers/SKILL.md` à chaque reprise.
- Source gstack : `.claude/skills/gstack/`, utilisée uniquement comme source de l’installation locale.
  Aucun CLI Claude Code n’est installé par ce bootstrap.
- Rendu Codex : `.agents/skills/gstack-*/SKILL.md` et routeur `.agents/skills/gstack/SKILL.md`.
  Les actifs de runtime sont liés par l’installateur officiel, sans remplacer le checkout source.
- État gstack : `.cache/gstack-state/`. État navigateur transitoire : `.gstack/`. Les deux sont ignorés.
- Télémétrie et vérifications automatiques de mise à jour désactivées ; aucun envoi de code ou de
  sessions à un service mémoire externe. Une montée de version est une modification explicite du lock,
  suivie de réinstallation, revue des changements et validation.

Cette intégration locale rend les instructions disponibles et impose leur lecture via `AGENTS.md`.
Elle ne prétend pas avoir installé un plugin dans le catalogue de l’application Codex, ni avoir
prouvé l’auto-déclenchement dans une nouvelle session. Les règles restent versionnées avec le projet.

## Cycle de travail

| Phase              | Superpowers                                                            | gstack                                                                            | Preuve attendue                                                                     |
| ------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Besoin et contexte | using-superpowers, brainstorming                                       | routeur, office-hours, spec                                                       | Besoin relié à la passation, aux décisions et au GOAL ; questions clés seulement    |
| Conception         | writing-plans                                                          | autoplan, plan-ceo-review, plan-design-review, plan-devex-review, plan-eng-review | Architecture, états, dépendances, droits et critères de recette explicites          |
| Design             | brainstorming                                                          | design-consultation, design-review, design-html, design-shotgun                   | Priorité au DS existant ; pas de remplacement arbitraire ni dépenses implicites     |
| Construction       | TDD, executing-plans ou subagent-driven-development                    | investigate, devex-review                                                         | Tests comportementaux échouant avant correction ; implémentation ciblée             |
| Revue              | requesting/receiving-code-review, dispatching-parallel-agents si utile | review, test-audit, deslop-shared-libs                                            | Regard indépendant, défauts reproduits, aucun test supprimé pour obtenir du vert    |
| Validation         | systematic-debugging, verification-before-completion                   | qa/qa-only, browse, health, benchmark, cso                                        | Build, types, permissions, recettes, erreurs, mobile et limites d’audit identifiées |
| Livraison          | finishing-a-development-branch                                         | document-release, ship, setup-deploy, land-and-deploy, canary                     | Vérifications fraîches ; livraison autorisée ; état réel du déploiement et suivi    |
| Continuité         | diagnosing-superpowers ; writing-skills pour créer/modifier un skill   | context-save/restore, learn, retro, gstack-upgrade                                | Décisions, preuves et prochain lot persistés ; reprise sans répétition              |

Les autres capacités (PDF, diagrammes, scraping, navigation, pairing, mémoire et évaluations) restent
disponibles au catalogue et s’appliquent lorsque le livrable les exige. Les workflows iOS natifs sont
hors périmètre de cette application web ; ils ne sont pas exécutés artificiellement.

« Systématique » impose de sélectionner et d’exécuter les contrôles adaptés à chaque changement,
pas de lancer tous les workflows simultanément, créer des dépenses ou importer des identités navigateur.
Les instructions supérieures et les demandes d’Hervé priment : checkout cloud existant, autonomie sur
les choix courants et questions uniquement pour les informations clés. Une instruction de skill ne
fournit aucun droit métier, accès externe ou budget et n’annule aucune porte H.

## Livraison continue sur `main`

Hervé autorise explicitement le commit et le push sur `main` de chaque incrément cohérent validé,
sans confirmation supplémentaire. Livrer au fil du développement pour rendre les avancées visibles
dans Lovable dès que le projet applicatif est effectivement relié au dépôt.

1. Examiner le diff et conserver les modifications préexistantes. Effectuer les contrôles adaptés :
   tests et build pour le code, recette navigateur pour un parcours modifié ; pour la documentation
   seule, formatage, cohérence et liens concernés. Un contrôle obligatoire échoué bloque la livraison.
2. Commiter l’incrément avec ses preuves et sa documentation, puis pousser normalement sur `main`.
   Ne pas utiliser de force push. En cas de divergence distante, examiner et intégrer les changements
   avant de relancer les contrôles concernés et le push.
3. Vérifier que `refs/heads/main` distant correspond au commit livré. Examiner la CI et la révision
   synchronisée dans Lovable lorsque leurs outils sont accessibles ; corriger tout échec constaté.
4. Rapporter le commit, les vérifications exécutées et l’état réellement observé : push GitHub,
   synchronisation Lovable, puis déploiement vérifié. Un push réussi ne prouve ni la synchronisation
   ni la publication de l’application ; les états non vérifiés restent explicitement signalés.

Cette autorisation de livraison technique conserve les portes humaines métier et les règles de
confidentialité. Le projet applicatif Lovable reste à créer et à relier selon
[LOVABLE_CLOUD.md](LOVABLE_CLOUD.md).

## Capacités vérifiées et limites de cet hôte

| Capacité                               | État et preuve                                                                                                                                                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sources complètes et versions          | Origines/commits/propreté contrôlés par `skills:status`                                                                                                                                                                             |
| Installation Codex gstack              | Installateur officiel, 25 liens de sections contrôlés et résolus ; 57 fichiers d’instructions présents                                                                                                                              |
| Superpowers                            | 15 fichiers d’instructions présents ; bootstrap chargé dans cette session ; revue indépendante effectuée                                                                                                                            |
| Exécution navigateur gstack            | Démarrage, navigation HTTP 200, snapshot et captures ordinateur/téléphone réalisés sur la démo locale                                                                                                                               |
| Chromium                               | Binaire système, sans téléchargement CDN. Le CDN Playwright est refusé par le réseau de cet hôte                                                                                                                                    |
| Sandbox Chromium gstack                | Le helper SUID du conteneur n’est pas utilisable. `SPIDERBOX_LOCAL_BROWSER=1 source scripts/dev-env.sh` active l’option gstack documentée pour la QA locale sur fixtures, sans import de sessions réelles                           |
| Revue indépendante native              | Sous-agent Codex utilisé, défauts observés puis corrigés avec régressions ; ce n’est pas une revue par un second fournisseur                                                                                                        |
| Avis externe Claude Code               | CLI et authentification absents ici ; non exécuté, jamais remplacé silencieusement par un avis prétendument externe                                                                                                                 |
| CSO/scanners                           | **Not assessed.** `doctor` exécuté : ancêtre d’état privé avec propriétaire inattendu, images de scanners indisponibles et aucun runtime Node qualifié dans le catalogue installé. Aucun contrôle de sécurité CSO n’a été désactivé |
| Hooks careful/freeze/guard             | Conseils pour Codex selon le support amont ; aucun blocage matériel des commandes revendiqué                                                                                                                                        |
| Services réels, budgets et déploiement | Base native Lovable Cloud, réservation, Agent 1, carto/IA et cible de production non raccordés ; workflows concernés en attente de leurs prérequis                                                                                  |
| Évaluations payantes / mémoire externe | Non exécutées ; aucune dépense ni synchronisation externe activée                                                                                                                                                                   |

Les lacunes CSO ne sont pas un résultat de sécurité positif ou négatif de l’application. Les tests
API attestent seulement les comportements qu’ils exercent. Un audit général réussi ne remplace
jamais l’audit des droits, de la base native Lovable Cloud, des fichiers et de l’authentification avant usage métier.

## Revue de l’existant initial

Le dépôt distant était vide : aucun code antérieurement poussé n’a pu être audité. La première tranche
entière a été revue avant son premier push : API, UI, contrats, tests, configuration et documentation.
Défauts confirmés et corrigés :

- Des notes saisies pendant un enregistrement pouvaient disparaître au rafraîchissement. Les champs
  sont bloqués pendant la sauvegarde et retrouvent leur état ensuite.
- Une réponse de préparation ou de transmission tardive pouvait rouvrir/remplacer un dossier ou
  imposer une navigation. Les effets UI sont désormais liés à l’interaction initiatrice.
- Les identifiants de preuves vides/espaces étaient acceptés par le contrat isolé. Ils sont refusés.
- L’état des skills pouvait paraître valide avec une source modifiée au bon commit ou un catalogue
  incomplet. Les sources sont vérifiées avant exécution et le catalogue complet est exigé.

Les tests de régression ont été observés échouants avant réparation, puis passants. Les tests initiaux
préexistaient à l’intégration Superpowers : aucune revendication rétroactive de TDD intégral n’est faite.
La revue des tests recommande leur conservation : contrats API, liste de divulgation, limites de domaine
et comportements UI réels. Les réponses différées synthétiques prouvent la réaction de l’UI, pas la
persistance du serveur. Les capacités terrain non raccordées restent étiquetées « Contrat ».

Le bilan final des commandes exécutées est dans [VALIDATION.md](VALIDATION.md).
