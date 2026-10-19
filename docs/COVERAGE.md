# Matrice initiale de couverture

Source disponible : `HANDOFF_CODEX.md` uniquement. Les 75 écrans, 180 tests et le DDL historique cités
ne sont pas présents ; leur couverture n’a pas été mesurée. « Démo » désigne une capacité testée sur fixtures,
« Contrat » une fonction isolée testée mais non raccordée, « Prévu » une fonction non implémentée.

| Règle                                                | Écran                 | Données / action / condition                            | Porte ou dépendance                     | Test / preuve                                            | Statut  |
| ---------------------------------------------------- | --------------------- | ------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------- | ------- |
| Organisation et stations bornent les accès           | Toutes les pages      | Session serveur, contrôle à chaque opération existante  | Auth réelle + RLS à venir               | API : A/B, ID direct, station exclue, permission absente | Démo    |
| Démarrage sans accès réel implicite                  | Bannière globale      | `APP_MODE=demo` obligatoire ; store mémoire             | Supabase existant à auditer             | Refus de mode réel ; smoke health                        | Démo    |
| Aucun administrateur par sélecteur UI                | Navigation exploitant | Aucun endpoint admin ni rôle client accepté             | Auth et délégations Hervé               | DTO stricts, route H.09 absente                          | Démo    |
| Créneaux en total, absence ≠ zéro                    | Vue d’ensemble        | `freeSlots=null`, état technique unknown                | Réservation + Agent 1                   | API overview                                             | Démo    |
| Préparation ≠ validation locale                      | Circuits/dossier      | Version attendue, état prepared                         | Essai complet à développer              | API transition/conflit + Playwright                      | Démo    |
| Validation bornée station/site/configuration/version | Dossier               | Contrat de preuves, trace intégrale, checklist/photos   | Capture terrain et politique versionnée | Domaine : scope, trous, preuves manquantes               | Contrat |
| Notes/statuts/rappels privés                         | Partenaires           | Mutation locale org, date valide, version               | Persistance et auth réelles             | API dates/versions, navigateur formulaire                | Démo    |
| Appel uniquement sur numéro confirmé                 | Partenaires           | Aucune fixture n’a de numéro confirmé ; pas de lien tel | Contacts canoniques sourcés             | Inspection UI ; parcours tel non testé                   | Prévu   |
| Transmission choisie avant envoi                     | Circuits/réseau       | Aperçu, confirmation nominative, idempotence            | Revue administrateur future             | API confidentialité/rejeu + Playwright                   | Démo    |
| Aucune communication interexploitants                | Réseau                | Expéditeur → réseau seulement, pas de messagerie        | Publication ciblée future               | API isolation, aucun endpoint publication                | Démo    |
| Pas de publication des notes/clients/finances        | Aperçu/réseau         | DTO explicite, liste de champs minimaux                 | Pièces/publications futures             | API refus champ privé et inspection du résultat          | Démo    |
| GPS ne déplace pas une station                       | Stations              | Message explicite, pas d’écriture GPS                   | Localisation et confirmation future     | Pas de GPS implémenté                                    | Prévu   |
| Données UI sans débordement global                   | 5 pages               | Largeurs 320/360/390/768/1024/1440                      | Source DS absente                       | Playwright ordinateur/téléphone                          | Démo    |
| Accessibilité clavier, zoom 200 %, focus modal       | Navigation/dossier    | Dialogue natif, labels, focus visible                   | Recette détaillée à compléter           | Test clavier/focus/zoom à ajouter                        | Prévu   |
| RLS, fichiers, export, révocation réelle             | À construire          | Aucun fichier réel accepté ni export                    | Audit Supabase/auth/Storage             | Tests sur services réels non exécutés                    | Prévu   |
| PWA/hors ligne, reprise uploads et GPX               | À construire          | Pas de service worker ni promesse de suivi background   | Auth/cache privé et stockage            | Non exécuté                                              | Prévu   |
| Finance approuvée et vérité réservation externe      | À construire          | Aucun montant ni calcul actif                           | Outil et politiques approuvés           | Non exécuté                                              | Prévu   |

## 18 moteurs Agent 2

| Moteur                            | Écran/contrat envisagé                | Dépendance / test restant                                          | Statut         |
| --------------------------------- | ------------------------------------- | ------------------------------------------------------------------ | -------------- |
| 1 Ancre/isochrone                 | Études, ancre confirmée et run        | Routage strict 45 min, source, fournisseur/budget ; test GPS/refus | Prévu          |
| 2 Découverte acteurs              | Catalogue sourcé                      | Sources/fraîcheur/conflits, modèle existant                        | Prévu          |
| 3 Prospects                       | Catalogue / qualification             | Rôles et faits distincts des suggestions                           | Prévu          |
| 4 Prescription/attribution        | Réservations/attribution              | Preuve d’apport et autorité outil externe                          | Prévu          |
| 5 Licences/six profils            | Organisation/licences                 | Statut commercial distinct du rôle logiciel                        | Prévu          |
| 6 Clientèles/demande              | Études/résultats                      | Estimations ≠ clients présents ; sources                           | Prévu          |
| 7 Positionnement/promesses        | Administration/offres                 | Promesses approuvées et conditions                                 | Prévu          |
| 8 Offres/tarifs                   | Administration/politiques             | Versions approuvées, aucun prix par défaut                         | Prévu          |
| 9 Acquisition organique           | Administration/GTM                    | Pas de publicité payante                                           | Prévu          |
| 10 Calendrier réseau              | Administration/calendrier             | Rôles et dates explicites                                          | Prévu          |
| 11 Scénarios/capacité/rentabilité | Économie/scénarios                    | Hypothèses ≠ réalisé ; créneaux et concurrence                     | Prévu          |
| 12 Acquisition supervisée         | Actions supervisées                   | H.06, budgets, reprise sans double coût                            | Prévu          |
| 13 Implantation Mode B            | Implantation                          | Voie unique, délégations explicites H.07                           | Prévu          |
| 14 Lancement                      | Administration/lancement              | H.09, validation/site/droits/technique distincts                   | Prévu          |
| 15 Pilotage commercial            | Partenaires (première tranche locale) | Statuts/notes démo seulement ; supervision à construire            | Démo partielle |
| 16 Répartition HT encaissé        | Économie/commissions                  | Politique approuvée, rapprochement/remboursement                   | Prévu          |
| 17 Apprentissage/fraîcheur        | Administration/qualité                | Provenance, dates, historique suffisant                            | Prévu          |
| 18 Expansion                      | Administration/expansion              | Modèles/études approuvés                                           | Prévu          |

## Portes humaines

Toutes restent à implémenter côté serveur dans le service réel ; aucune n’est déléguée implicitement.

| Porte | Décision               | Écran futur / dépendance                              |
| ----- | ---------------------- | ----------------------------------------------------- |
| H.01  | Ancre ambiguë          | Étude / confirmation                                  |
| H.02  | Budget payant          | Administration / plafond et coût connus               |
| H.03  | Scénario               | Scénarios / approbation                               |
| H.04  | Acteurs/rôles          | Catalogue / revue                                     |
| H.05  | GTM/offres             | Offres / politique versionnée                         |
| H.06  | Contacts automatisés   | Supervision / autorisations bornées                   |
| H.07  | Mode B                 | Implantation / délégation explicite                   |
| H.08  | Montage                | Implantation / décision                               |
| H.09  | Lancement              | Administration / décision Hervé ; bloqué dans la démo |
| H.10  | Changements engageants | Configuration / approbation                           |
| H.11  | Étude fille            | Études / décision et filiation                        |
