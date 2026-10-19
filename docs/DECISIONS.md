# Décisions initiales — 19 octobre 2026

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
- Réactiver puis auditer Supabase existant : schémas, tables, permissions, RLS, fonctions, Storage,
  identités, catalogue canonique et correspondances organisation/station. Aucune recréation aveugle.
- Remplacer le store mémoire et les sessions fixtures par auth réelle, invitations, appartenance
  vérifiée à chaque requête, révocation de sessions, audit durable et tests RLS/Storage à deux organisations.
- Étendre sites/affectations, contrats terrain et pièces avant d’autoriser une validation locale.
- Ajouter la revue administrateur et les publications versionnées ciblées, en conservant les portes H.
- Raccorder les autres adaptateurs seulement après définition des contrats, budgets et droits nécessaires.

Les fournisseurs, tarifs, identifiants techniques et règles financières ne sont pas inventés pour combler
les dépendances. La documentation d’un blocage ne vaut pas implémentation.
