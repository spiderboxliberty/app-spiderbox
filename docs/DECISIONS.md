# Décisions initiales — 19 octobre 2026

## Correction de cible — instruction ultérieure d’Hervé

Le projet applicatif **SpiderBox Liberty est à créer par Codex** avec la **base native Lovable Cloud**. Cette instruction explicite remplace la cible
Supabase externe mentionnée par la passation. Le nom du fournisseur sous-jacent, les identifiants,
les tables et la configuration Auth du projet doivent être vérifiés dans Lovable ; ils ne se déduisent
pas de l’ancien identifiant Supabase. Préserver le framework existant, créer le projet applicatif distinct et inventorier les droits/données du backend natif nouvellement créé.
Ne pas créer de base externe supplémentaire ni réactiver l’ancienne comme étape automatique.

Les décisions initiales ci-dessous décrivent la démonstration déjà livrée ; elles ne raccordaient aucun service réel.

1. **Portée autorisée** : création de `main` et amorce du développement à partir de la passation du
   12 octobre. Il s’agit d’un socle de démonstration, pas du lancement du produit ou des 75 écrans.
2. **Adaptation provisoire de stack** : React/TypeScript/Vite et API Node validée par Zod permettent
   d’avancer sans l’export framework. Aucun composant ni token du framework n’a été récupéré.
   Comparer les versions réelles, appliquer/valider le patch dans son contexte et remplacer les styles
   provisoires lors de la fourniture des sources ; ne pas reconstituer le patch à partir du résumé.
3. **Backend séparé** : les mutations traversent l’API. Les contrôles d’accès sont éprouvés sur deux
   organisations synthétiques. Ils ne prouvent pas des politiques RLS ou Storage ; aucun fichier réel
   n’est accepté et aucune opération d’export n’est disponible.
4. **Pas de connexion implicite** : aucune migration, aucun appel à Supabase, aucun fournisseur carto/IA,
   outil de réservation ou Agent 1. Une disponibilité absente reste `null`/`unknown`.
5. **Parcours terrain limité** : documentaire → essai préparé seulement. La checklist est informative,
   sans cases précochées. Contrat minimal de preuves testé séparément, sans endpoint de validation.
   GPS, GPX, pièces, interruptions, conditions expirées et suspension restent à développer.
6. **Transmission minimale** : titre, ID et version du circuit ; auteur, organisation et date serveur.
   Réception en mémoire. Ni examen réel par Hervé, ni publication, ni messagerie interexploitants.
7. **Dates** : instants serveur UTC ; affichage des envois explicitement Europe/Paris dans cette fixture.
   Un rappel est une date locale sans heure ; il ne déclenche aucun envoi automatique.

## Suite recommandée

- Recevoir les sources framework/prototype/inventaires et rapprocher chaque règle de l’existant.
- Inventorier la base native Lovable Cloud du projet applicatif : données, authentification, permissions,
  fichiers, identités et correspondances organisation/station. Aucun raccordement ou réactivation du
  Supabase externe historique par défaut. Aucune recréation aveugle.
- Remplacer le store mémoire et les sessions fixtures par auth réelle, invitations, appartenance
  vérifiée à chaque requête, révocation de sessions, audit durable et tests RLS/Storage à deux organisations.
- Étendre sites/affectations, contrats terrain et pièces avant d’autoriser une validation locale.
- Ajouter la revue administrateur et les publications versionnées ciblées, en conservant les portes H.
- Raccorder les autres adaptateurs seulement après définition des contrats, budgets et droits nécessaires.

Les fournisseurs, tarifs, identifiants techniques et règles financières ne sont pas inventés pour combler
les dépendances. La documentation d’un blocage ne vaut pas implémentation.
