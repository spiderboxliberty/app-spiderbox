# SpiderBox Liberty

Application web métier responsive — première tranche de développement, version 0.1.
La référence fonctionnelle reçue est conservée dans [docs/HANDOFF_CODEX.md](docs/HANDOFF_CODEX.md).
L’objectif de livraison complète et la politique d’autonomie sont dans [GOAL.md](GOAL.md).
Les règles Superpowers et gstack sont obligatoires dans [AGENTS.md](AGENTS.md).
Le raccordement à la base native Lovable Cloud et ses prérequis sont suivis dans
[docs/LOVABLE_CLOUD.md](docs/LOVABLE_CLOUD.md).

## Outils de développement et skills

```sh
npm ci --cache /workspace/.cache/npm
npm run skills:setup
npm run skills:status
source scripts/dev-env.sh
```

Le bootstrap installe les sources officielles aux commits de `skills-lock.json`, les skills Superpowers
et le rendu Codex complet de gstack. Il ne modifie pas `HOME`/`CODEX_HOME`. Les checkouts/outils/cache sont
ignorés par Git et distincts du code livré. Bun 1.4.3 est fourni comme dépendance de développement.
Voir [le guide et les capacités](docs/DEVELOPMENT_WORKFLOW.md) et [le catalogue](docs/SKILLS_CATALOG.md).

L’installateur gstack écrit encore quelques marqueurs historiques dans `~/.gstack` ; si l’hôte interdit
ces écritures, il faut autoriser précisément ce répertoire pour l’installation. Ne pas désactiver les
contrôles du système ni déplacer `HOME` pour contourner une restriction. Chromium système est réutilisé ;
les outils ne nécessitent pas un nouveau téléchargement de navigateur depuis un CDN dans ce cloud.

## Démarrer

Prérequis : **Node.js 24**, npm 11. Depuis la racine du dépôt :

```sh
npm ci --cache /workspace/.cache/npm
npm run dev
```

Vite écoute localement sur le port 5173 et transmet `/api` au serveur Node sur le port 3001.
Pour exécuter la version compilée, sans serveur Vite :

```sh
npm run build
APP_MODE=demo npm start
```

La même origine locale, port 3001, sert alors le frontend compilé et l’API. `GET /api/health`
doit renvoyer `status: ok`, `mode: demo`, `persistence: memory`, `integrations: disconnected`.
Arrêter les processus avec Ctrl+C. Ne pas partager cette démonstration sur un réseau public.

## Ce qui fonctionne dans la démonstration

- Tableau de bord, navigation et formulaires en français sur téléphone et ordinateur.
- Liste des stations et sites autorisés ; état technique et nombre de créneaux **inconnus**.
- Consultation des circuits documentaires et préparation d’un essai, avec contrôle de version.
- Modification des statuts, notes privées et dates de rappel partenaires. Pas de notification automatique.
- Aperçu puis transmission fictive nominative d’un titre/ID/version de circuit au réseau.
  Les notes privées, photos, données clients et finances sont exclues ; aucune publication n’a lieu.
- Contrôles côté API : session de démonstration, permissions par action, organisation et stations,
  DTO stricts, conflits de version, idempotence des transmissions et journal d’événements en mémoire.

Les fixtures sont synthétiques. Un cookie HttpOnly démarre une **session de démonstration fixe**,
pas une authentification utilisateur. Tous les visiteurs locaux partagent la même organisation A.
Les données modifiées et le journal disparaissent au redémarrage. Les sessions expirent après huit heures.
La fixture B sert aux tests de cloisonnement. Aucun sélecteur d’organisation ou de rôle n’est exposé au navigateur.

## Validation

```sh
npm test
npm run build
CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
```

Les tests API couvrent deux organisations, IDs directs, stations retirées du périmètre,
permissions absentes, conflits, données invalides, confidentialité et rejeu d’une transmission.
Les tests de domaine définissent les preuves minimales d’un essai local ; **leur validation n’est
pas encore raccordée à une opération serveur**. Le contrat n’autorise jamais un lancement commercial.

Playwright teste les parcours sur Chromium ordinateur et téléphone, ainsi que le débordement horizontal
aux largeurs 320/360/390/768/1024/1440. Il démarre deux serveurs indépendants sur les ports 3001 et 3002,
un par projet, pour isoler leurs données : arrêter les serveurs déjà actifs avant la recette.
Sur une autre machine, utiliser un Chromium de confiance via
`CHROMIUM_PATH`, ou installer celui de Playwright avec `npx playwright install chromium` puis omettre cette variable.
Le build est requis avant les tests navigateur. Les traces et captures restent dans `test-results/`, ignoré par Git.

## Architecture et état des dépendances

React + TypeScript + Vite pour l’interface ; Node HTTP + Zod pour l’API locale ; fonctions de domaine
séparées du JSX. Les dépendances sont verrouillées par `package-lock.json`. Les appels métier passent
par le serveur ; aucun secret fournisseur ni SDK privilégié n’est embarqué dans le client.

Ce choix constitue une base provisoire : **l’export du design framework Lovable, son correctif 1.0.1,
`FRAMEWORK_STATUS.md`, `screens.json`, le prototype et les 180 tests historiques n’ont pas été joints**.
L’interface actuelle utilise des styles locaux de substitution ; elle ne prétend pas importer les tokens
ou composants du framework. L’import et la comparaison de la stack attendent les sources.

La cible active est la base native **Lovable Cloud**, conformément à la correction d’Hervé.
Elle n’est pas encore raccordée ni inventoriée depuis cette session. Avant tout usage réel : examiner
la base, l’authentification et les droits du projet Lovable effectivement utilisé, puis raccorder et
éprouver les sessions, invitations et autorisations. Le Supabase externe historique n’est pas la cible
par défaut et n’a pas été modifié. `APP_MODE` différent de `demo`
empêche le serveur de démarrer. Aucun parcours réel ne doit être activé à partir des fixtures.

Voir [la matrice de couverture](docs/COVERAGE.md), [les contrats initiaux](docs/API.md) et
[les décisions et prochains lots](docs/DECISIONS.md). Cette première tranche n’implémente pas les 75 écrans.
