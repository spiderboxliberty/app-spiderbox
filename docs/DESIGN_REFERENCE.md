# Référentiel design de SpiderBox Liberty

Le **projet design Lovable existant est le référentiel visuel obligatoire** de la nouvelle application,
conformément à l’instruction d’Hervé. Il reste un projet distinct et doit être préservé.

- Projet : [framework Lovable](https://lovable.dev/projects/ca29a370-a5b3-4c93-afad-8a1cbedf4f19).
- Identifiant : `ca29a370-a5b3-4c93-afad-8a1cbedf4f19`.
- Référence visuelle fournie : [preview du framework](https://id-preview--ca29a370-a5b3-4c93-afad-8a1cbedf4f19.lovable.app).
- Cible : nouveau projet applicatif **SpiderBox Liberty**, avec backend natif Lovable Cloud.

## Règles d’intégration

1. À la création de l’application, référencer explicitement ce projet design par le mécanisme proposé
   par Lovable. Vérifier que la référence est effectivement appliquée ; citer le lien dans un prompt
   ne prouve pas une liaison technique.
2. Inspecter ses sources, ses composants, ses tokens et `FRAMEWORK_STATUS.md`. Relever la révision
   réellement lue ; les versions 1.0.0/1.0.1 de la passation ne prouvent pas l’état distant actuel.
3. Réutiliser les couleurs, typographies, espacements, rayons, ombres, icônes, composants et états
   réellement définis dans le framework. Conserver ses conventions responsive et d’accessibilité.
4. Composer les écrans métier et leurs variantes exploitant/administrateur avec ces éléments.
   Documenter les adaptations nécessaires et les composants manquants, sans recréer un design system
   concurrent ni transformer l’application métier en réplique du site marketing.
5. Examiner le correctif framework mentionné dans la passation lorsqu’il sera accessible, puis vérifier
   ses effets avant import. Ne pas reconstituer son contenu à partir du résumé.
6. Vérifier la cohérence visuelle sur mobile et ordinateur, y compris formulaires, erreurs, chargement,
   états vides, focus et dialogues. Relier les écarts constatés à la matrice de couverture.

## État vérifié

Le dépôt local contient une interface provisoire. Ses styles ne sont pas une reprise vérifiée du
framework et ne constituent pas une nouvelle référence approuvée. Les outils Lovable et les sources
du framework ne sont pas accessibles dans le contexte actuel ; aucune conformité ou liaison distante
n’est donc revendiquée. Cette lacune empêche de clôturer le lot design, sans empêcher les travaux
indépendants sur les règles métier et les contrats.
