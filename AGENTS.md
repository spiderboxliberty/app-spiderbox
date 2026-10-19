# Consignes de développement

- Objectif directeur : lire `GOAL.md` à chaque reprise et avancer vers l’application complète, au-delà du socle de démonstration.
- Autonomie demandée : ne poser que les questions portant sur une information clé réellement manquante. Continuer les tâches indépendantes pendant l’attente ; ne pas demander de validation routinière déjà autorisée.
- Livraison continue autorisée : après les vérifications adaptées, commiter chaque incrément cohérent puis le pousser sur `main`, sans nouvelle confirmation. Vérifier la révision distante ; distinguer le push GitHub de la synchronisation et du déploiement réellement constatés dans Lovable. Suivre `docs/DEVELOPMENT_WORKFLOW.md`.
- Lire `docs/HANDOFF_CODEX.md`, `docs/DECISIONS.md` et `docs/COVERAGE.md` avant d’étendre les fonctions métier.
- Utiliser le checkout existant : chaque tâche cloud est isolée. Ne pas créer de worktree sans demande explicite.
- Node 24 ; installer avec `npm ci --cache /workspace/.cache/npm`. Respecter le lockfile.
- Garder les fixtures dans `server/fixtures.ts` ; ne pas présenter une fixture comme un raccordement réel.
- Référentiel visuel obligatoire : projet design Lovable `ca29a370-a5b3-4c93-afad-8a1cbedf4f19`. Lire `docs/DESIGN_REFERENCE.md` ; reprendre ses composants et tokens et vérifier la référence lors de la création de l’application. Les styles locaux actuels sont provisoires et ne remplacent pas ce référentiel.
- Créer le nouveau projet applicatif SpiderBox Liberty dans Lovable, distinct du framework : cette création incombe à Codex, sans réclamer un lien de projet applicatif existant.
- Cible active : base native Lovable Cloud, selon la correction explicite d’Hervé. Inventorier son état réel avant modification ; ne pas cibler le Supabase historique par défaut. Aucun secret dans Git, le client, les logs ou un prompt.
- Authentification réelle obligatoire avant usage métier. Ne pas transformer la session de démonstration en accès réel.
- Vérifier organisation, permission et station à chaque opération serveur. Un ID client ou un rôle dans l’interface ne donne aucun droit.
- Ne pas créer de communication interexploitants, de publication automatique, de règle financière active ou de feu vert technique fictif.
- Garder les règles critiques hors du JSX. Stocker les instants en UTC et nommer explicitement le fuseau des sites.
- Une préparation d’essai n’est pas une validation locale ; une validation locale n’est pas une décision H.09.
- Ajouter des tests métier et de permissions utiles ; exécuter `npm test` et `npm run build`.
  Pour une modification de parcours, lancer la recette navigateur après build (voir README).
- Mettre à jour la matrice en distinguant démonstration, contrat testé, prévu et raccordé. Ne pas revendiquer une couverture non prouvée.

## Référentiels généraux obligatoires : Superpowers et gstack

Demandés explicitement par Hervé pour tout le projet, y compris la revue du code antérieur.
Lire [le guide et le registre complets](docs/DEVELOPMENT_WORKFLOW.md) et [le catalogue](docs/SKILLS_CATALOG.md).
Les deux suites sont des dépendances de développement locales, verrouillées dans `skills-lock.json`.

Au début de chaque tâche et après une compaction :

1. Lire `GOAL.md`, ce fichier, la passation et la matrice à jour.
2. Exécuter `npm run skills:status`. Si nécessaire, `npm ci --cache /workspace/.cache/npm`, puis
   `npm run skills:setup` ; ne pas écraser des installations locales modifiées pour forcer une mise à jour.
3. Charger `.agents/skills/superpowers/skills/using-superpowers/SKILL.md`, puis les sous-skills pertinents.
4. Charger le routeur `.agents/skills/gstack/SKILL.md`, puis les skills Codex pertinents sous
   `.agents/skills/gstack-*/SKILL.md`. Ne pas charger tout le catalogue en contexte d’un seul coup.
5. Pour leurs outils, `source scripts/dev-env.sh`. Dans ce conteneur, la QA locale sur fixtures utilise
   `SPIDERBOX_LOCAL_BROWSER=1 source scripts/dev-env.sh` ; ne pas importer de sessions navigateur réelles.

Cycle systématique : contexte/specification proportionnée → plan → test pertinent échouant avant
correction → implémentation → revue indépendante → correction → QA fonctionnelle et mobile → documentation
et matrice → vérification fraîche avant livraison. Diagnostiquer les causes avant de modifier le code.
L’audit des tests doit conserver les preuves utiles ; un test vert sans assertion utile ne vaut pas recette.

Choisir les workflows selon l’activité : produit, architecture, design/DS et DX lors de la conception ;
TDD/debugging/review et audit de tests pendant le développement ; QA, revue visuelle, sécurité et
performance avant livraison ; documentation, ship, déploiement et canary pour les livraisons autorisées ;
contexte/learnings/retro pour les reprises. L’ensemble des capacités reste dans le catalogue, y compris
celles momentanément sans prérequis ou hors périmètre web.

Les instructions du système, du développeur et les demandes explicites d’Hervé priment sur les suites.
L’autonomie déjà demandée dispense de réinterroger sur les choix techniques courants. Les suites ne
donnent pas de droits, budget, secrets ou autorisation de communiquer à des tiers. Aucun nouveau
worktree dans ce cloud sans demande explicite ; conserver le checkout isolé existant.

Ne jamais prétendre qu’un hook consultatif bloque réellement Codex, qu’un sous-agent natif est un
deuxième fournisseur, qu’un scanner indisponible a tourné ou qu’une installation disque a activé un
plugin dans l’interface. Documenter les substitutions et les limites au lieu de masquer les écarts.
