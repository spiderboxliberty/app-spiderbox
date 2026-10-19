# SpiderBox Liberty — passation vers Codex
Date : 12 octobre 2026. Responsable : Hervé Gagneux.

## Mission du prochain développement
Construire une application web responsive, utilisable sur téléphone et ordinateur, pour piloter la chaîne de valeur SpiderBox Liberty. Deux espaces : exploitants dans leur périmètre professionnel ; Hervé administrateur réseau. Le framework Lovable est un projet distinct de fondations et composants, pas l'application ni une réplique du site marketing. L'application future réutilise ses composants et tokens. Pas d'application native demandée.

## Références et statut réel
- Framework : https://lovable.dev/projects/ca29a370-a5b3-4c93-afad-8a1cbedf4f19 ; projet normal, à assigner comme design framework par Hervé dans ses préférences. Lire FRAMEWORK_STATUS.md pour le commit et les résultats exacts de livraison. La version distante1.0.0 est terminée ; un correctif local1.0.1 est fourni mais ne peut pas encore être appliqué via MCP (permission projects:write absente).
- Prévisualisation : https://id-preview--ca29a370-a5b3-4c93-afad-8a1cbedf4f19.lovable.app ; lien de preview, pas une publication de production.
- Prototype fonctionnel d'interface : prototype/SpiderBox_Liberty_Maquette_Complete.html, 75 écrans. Données fictives, navigation locale, aucune authentification/connexion métier. Espacements harmonisés le 12 octobre. Contrôles JS réalisés ; contrôle visuel navigateur local indisponible.
- screens.json : inventaire des 75 écrans, portes d'entrée, rôles, entrées/sorties/dépendances. Les libellés génériques de certaines fiches ne remplacent pas un contrat de données complet.
- reference-agent2/ : doctrine, 18 moteurs, 17 décisions, 11 portes, spécification, contrat d'exécution, DDL de référence et 180 tests hérités. Ce DDL est une référence historique, pas un dump de la base actuelle.
- Supabase existant : ouceotegjbhyruvztgtz, contactalterix@gmail.com, eu-central-1. Vérification MCP du 12 octobre : INACTIVE. L'inventaire SQL a échoué par timeout. Dernier état documentaire : 217 tables métier privées RLS, zéro table Agent 1. Cet état n'a PAS été revérifié en SQL ce jour. Réactiver puis auditer avant toute migration. Aucune base n'a été modifiée pendant cette passation.
- Aucun dépôt applicatif, URL Git ou projet Codex distant n'a été fourni/créé. Ce paquet est une passation, pas un environnement Codex provisionné.

## Priorité des décisions et divergences à traiter
Les instructions explicites de cette conversation priment sur les fichiers hérités. Conserver les règles non remplacées et versionner les modifications suivantes :
1. Une application web métier est désormais demandée. La règle historique « ChatGPT seule interface » ne doit pas empêcher cette création. Le skill exécuté dans ChatGPT n'est pas automatiquement un service disponible pour le navigateur : construire un contrat de service serveur pour les fonctions destinées à l'application, sans donner de pouvoirs engageants autonomes à l'IA.
2. L'exploitant peut réaliser un essai complet et valider un circuit pour SA station, SON emplacement et SA configuration. Remplacer la validation finale terrain exclusivement par Hervé dans les contraintes/états/tests concernés. Hervé garde audit/suspension et la décision de lancement H.09. Aucune validation générale de tout le réseau à partir d'un seul essai local.
3. Aucune communication entre exploitants. Transmission explicite au réseau ; Hervé examine puis publie pour un périmètre ciblé. Pas de messagerie, commentaires communs ou annuaire entre exploitants.
4. La disponibilité principale s'affiche en TOTAL DE CRÉNEAUX DISPONIBLES sur une période, pas en pourcentage de jours. Préserver séparément planifiés, indisponibles, confirmés, réservés et libres. La disponibilité technique reste inconnue tant que le contrat Agent 1 est absent.
5. L'exploitant peut modifier ses statuts/notes/reminders de partenaires et composer un numéro confirmé depuis son téléphone. Le clic tel: n'est pas une preuve d'appel abouti. Les envois IA/automatiques restent distincts et soumis aux autorisations bornées applicables.
6. L'autorisation passée de travailler sans accès client concernait l'ancien usage ChatGPT seul. Le lancement d'une application multiutilisateur exige authentification et contrôles côté serveur dès le premier usage réel.
7. Un prix, partage ou exception vu dans une simulation, un souvenir ou un dossier territorial ne devient jamais une règle active globale. Récupérer les versions approuvées et leurs conditions ; aucune valeur financière par défaut inventée.

## Utilisateurs, stations et sites
- Une organisation exploitante peut gérer plusieurs utilisateurs et stations ; permissions par rôle/action et station. Le rôle technique d'administrateur appartient à Hervé ; ne pas confondre rôle logiciel et statut commercial d'ambassadeur (licence signée).
- Exploitant fixe, mobile/camping-cariste ou multisite : capacités/profils cumulables, aucune obligation de posséder un camping-car. Les aires sont un type de lieu parmi d'autres.
- Distinguer position ponctuelle du téléphone, ancre d'étude, site d'exploitation confirmé et périodes d'affectation d'une station mobile. Un mouvement GPS ne déplace pas la station dans la base.
- Dates en UTC en stockage ; horaires locaux avec fuseau explicite par site, pas conversion implicite depuis le téléphone.

## Parcours exploitant
1. Invitation/connexion, organisation et stations autorisées, prise en main.
2. « Me localiser », adresse ou point sur carte ; précision/date/source visibles ; confirmation explicite du lieu. Géolocalisation web HTTPS avec permission, refus/timeout et saisie manuelle. Pas de suivi en arrière-plan promis.
3. Étude territoriale : point et Mode A/B explicitement choisis selon périmètre délégué ; étude exécutée en tâche suivie, preuves/fraîcheur visibles ; circuits candidats et acteurs avec raisons/dimensions/confiance. Le routage moyen strict 45 minutes ne se remplace pas par un rayon en kilomètres. Bandes 0–15/15–30/30–45 descriptives, aucun bonus de distance interne.
4. Aires/sites : services, accès, contacts, saisonnalité, capacités et demande estimée. Une capacité ou un volume d'avis ne devient pas le nombre réel de clients présents. Comparaison sites fixes et mobiles, information inconnue visible.
5. Circuits : découverte documentaire, fiche, test à préparer, enregistrement/GPX, checklist/photos/incidents, décision locale, historique, suspension et transmission. Aucun parcours documentaire ou test partiel ne suffit.
6. Partenaires : catalogue canonique, contacts sourcés, lien tel: explicite ; relation locale, statut, notes libres, date/rappel, historique ; aide IA distinguant faits prouvés et suggestions commerciales. Pas de prix ou promesse non approuvée dans les recommandations.
7. SpiderBox : affectations, incidents/défauts déclarés et pièces ; états mesurés/maintenance automatiques différés Agent 1. Un signalement humain n'est pas un diagnostic du matériel.
8. Réservations et économie : ingestion de l'outil existant comme source de vérité, références externes, qualité/synchronisation ; distinction réservation/prestation/encaissement/remboursement/commission dû/payée ; charges locales et scénarios séparés du réalisé.
9. Réseau : demande, aperçu des champs à transmettre, soumission, réponse du réseau, publication ciblée, notifications ; paramètres/confidentialité/aide/documents.

## Validation terrain et mise en exploitation
La validation est un dossier versionné contenant circuit/géométrie, station/site/véhicule/configuration, testeur authentifié, date, trace intégrale aller-retour, interruptions éventuelles, checklist, photos et conditions de validité.
Checklist : largeur, revêtement, pentes/dévers, obstacles, barrières/ponts, demi-tours, croisements, dangers, échappatoires, retour et compatibilité avec la configuration.
États proposés à aligner sur l'existant : documentaire → essai préparé → en cours → à compléter/incompatible/validé localement → éventuellement suspendu/à retester. Les états commerciaux et techniques restent séparés.
Les trous GPS ne sont pas comblés fictivement. Tracking foreground seulement ; reprise explicite, import GPX autorisé, provenance conservée ; réveil écran optionnel sans garantie système. Hors ligne : prévoir sauvegarde brouillon et uploads repris ; aucun document sensible dans un cache commun.
Mise en exploitation = validation locale active + site/droits/conditions assurés + lancement commercial autorisé + compatibilité technique réellement confirmée quand son contrat existe. Le contrat Agent 1 absent ne produit aucun feu vert automatique. Une version/site/configuration modifiée impose une réévaluation selon politique versionnée, jamais un transfert implicite de validation.

## Administration Hervé et couverture Agent 2
18 moteurs à rattacher à écrans, contrats serveur et tests :
1 ancre/isochrone ; 2 découverte acteurs ; 3 prospects achat/financement/accueil/exploitation ; 4 prescription/attribution ; 5 licences/six profils ; 6 clientèles/demande ; 7 positionnement/promesses ; 8 offres/tarifs ; 9 acquisition organique ; 10 calendrier réseau ; 11 scénarios/capacité/rentabilité ; 12 acquisition supervisée ; 13 voie unique implantation Mode B ; 14 lancement ; 15 pilotage commercial ; 16 répartition HT encaissé ; 17 apprentissage/fraîcheur ; 18 expansion.
Navigation admin : réseau/études/acteurs/circuits/transmissions/GTM/implantation/lancement/décisions/économie/apprentissage/utilisateurs/configuration/qualité/audit.
Portes à maintenir : H.01 ancre ambiguë ; H.02 budget payant ; H.03 scénario ; H.04 acteurs/rôles ; H.05 GTM/offres ; H.06 contacts automatisés/politiques ; H.07 voie Mode B ; H.08 montage ; H.09 lancement ; H.10 changements engageants ; H.11 étude fille. Les délégations locales introduites ici sont spécifiques ; elles ne transfèrent pas toutes les portes à l'exploitant.
Sources/observations/affirmations/preuves/conflits/lacunes/hypothèses/inférences restent séparés. Pas de score global masquant potentiel et confiance ; pas de données absentes converties en zéro. Climatologie saisonnière historique sourcée séparée de la météo et de la sécurité opérationnelles. Pas de publicité payante. Pas de collecte payante sans plafond et coût connus.

## Plan des données partagées
| Domaine | Producteur / vérité | Visibilité et publication |
|---|---|---|
| Organisations/établissements/contacts canoniques | Réseau, sources et preuves | Catalogue publié ciblé ; modification structurante revue réseau |
| Notes, statuts, rappels commerciaux | Organisation exploitante | Cette organisation et supervision professionnelle Hervé ; jamais autre exploitant |
| Circuit et test local | Exploitant authentifié, dossier preuves | Organisation concernée ; réseau reçoit seulement une transmission sélectionnée ou dossier pour audit autorisé |
| Référence circuit réseau | Réseau après revue | Publication versionnée/périmètre/date ; ne remplace pas la validation station/site/configuration |
| Position téléphone | Utilisateur, mesure ponctuelle | Transitoire par défaut ; conservation explicite pour étude/test ; aucune diffusion aux voisins |
| Site et affectation station | Organisation, confirmation | Organisation et réseau ; catalogue public éventuel distinct et contrôlé |
| Réservations/paiements/prescription | Outil de réservation existant | Organisation/stations autorisées, admin ; contact client minimisé |
| Rentabilité/charges | Données réconciliées et saisies locales | Organisation et admin ; aucune publication interexploitants |
| Technique/énergie/maintenance mesurée | Futur Agent 1 | Même cloisonnement ; unknown/non connecté tant que absent |
| Demande territoriale et aires | Sources/études documentées | Résultats réseau validés ; estimations étiquetées, pas fréquentation temps réel prétendue |
| Agrégats réseau | Réseau, calcul versionné | Si utile, publication par admin après minimisation ; seuils à définir, pas de reconstitution d'un exploitant |
| Soumissions/retours réseau | Auteur + revue admin | Expéditeur et réseau ; destinataires publiés explicitement, pas partage automatique |

Flux de transmission : brouillon → aperçu du contenu/attachments → soumission nominative → reçu/en revue → complément/refus/approbation → publication ciblée versionnée → retrait/expiration si nécessaire. Exclure par défaut notes libres privées, données clients et finances des publications. L'historique en garde la décision et le contenu réellement communiqué.

## Architecture technique proposée à Codex
- Conserver la stack réellement livrée par le framework (voir export package.json/README) ou documenter une adaptation justifiée. TypeScript, composants DS, couche domaine et adapters séparés ; aucun calcul critique enfoui dans JSX.
- Frontend responsive/PWA avec formulaires validés, routes protégées et états complets. La PWA n'implique pas distribution App Store/Play Store ; aucun comportement natif ou suivi GPS background promis.
- Backend authentifié : vérifier utilisateur, appartenance organisation/station et permission à CHAQUE opération, export et pièce jointe. Les IDs fournis par le client ne donnent aucun droit. Service secret/privileged role côté serveur uniquement ; aucun rôle admin par sélecteur UI/user_metadata.
- Conserver Supabase existant : inventorier schémas/tables/contraintes/politiques/triggers/config active avant modification ; migrations additives versionnées et testées. Catalogues canoniques acteurs distincts de l'organisation locataire de l'app : relation à définir après audit, pas duplication aveugle.
- Exposer API/vues/RPC minimales ; vérifier accès réel des schémas, RLS, Storage, fonctions privilégiées et recherches/exports. Les profils de l'ancien usage owner-only ne suffisent pas pour le multiutilisateur.
- Tâches d'étude/IA en worker/server avec run/status, idempotence, reprises, timeout, cache, plafonds par organisation/réseau. États proposés queued/running/awaiting_decision/blocked_budget/completed/failed ; à mapper sur contrats existants. UI ne fait aucun appel fournisseur secret directement.
- Provenance/version/fraîcheur dans tout résultat utile ; historique d'événements, projection courante distincte ; mutations atomiques sur capacités/budgets/allocations.
- Adapter réservation : en premier lecture/synchronisation idempotente ; outil externe conserve autorité sur création/annulation/paiement/référencement. Ne pas bâtir deux calendriers maîtres. Auth webhooks, external IDs, événements dupliqués/hors ordre, reprises/conflits, remboursements et rapprochement.
- Adapter technique : interface différée explicite, pas faux heartbeat, identifiants/messages/commandes inventés. Agent 2 n'envoie aucune commande autonome recharge/sécurité.
- Cartographie : choisir fournisseur pour map/geocoding/routage/isochrones 45min ; comparer coûts, quotas, licences et attribution avant engagement. Budget IA séparé. Aucune dépense fournisseur activée par la simple construction du code.
- Formules disponibilité : compter les créneaux par station/période en respectant définition d'un créneau et capacité concurrente ; distinguer créneaux disponibles connus et disponibilité inconnue. Ne pas soustraire deux fois deux causes d'indisponibilité chevauchantes. Afficher détail des exclusions et dernière synchronisation.
- Commissions : référence doctrine 65/25/10 (tiers prouvé), 75/25 (exploitant apporteur autorisé), 65/35 (pas prescription prouvée), HT encaissé après prestation confirmée et corrections ; politique active approuvée/périmètre/date avant tout calcul réel ; une attribution principale maximum, pas paiement automatique. Les exceptions territoriales historiques ne sont pas globalisées.

## Contrats d'API à spécifier avant implémentation réelle
Pour chaque opération : DTO validé, rôle/action/périmètre, état amont/aval, clé idempotence, version attendue/conflit, horodatage, sources et provenance, fichiers/pièces, erreur et reprise, audit.
Familles proposées : session/organisation/stations ; localisation/sites ; études/runs/results ; circuits/inspections/validation ; acteurs/relations locales/notes/reminders ; soumissions/publications ; réservations/sync/attribution ; états matériels/signalements ; charges/KPI/scénarios ; décisions/config/audit. Les noms de tables/endpoints exacts restent à aligner sur l'inventaire, pas figés par ce document.

## Lots de développement et dépendances
| Lot | Constructible maintenant | Dépendance bloquant l'usage réel |
|---|---|---|
| 0 Reprise DS et matrice couverture | Import sources, règles, fixtures, inventaire | Accès repo/projet Codex à fournir ; aucune sélection DS requise pour consulter le code exporté |
| 1 Socle multiutilisateur | UI/auth/invitations/permissions/sites/stations/audit/Storage | Supabase réactivé, audit et migrations testées |
| 2 Circuits et carnet commercial | Formulaires/tests/notes/statuts/photos/transmissions | Règles terrain adaptées et accès éprouvés |
| 3 Territoire et assistance IA | Parcours, tâches, contrats, providers simulés étiquetés | Fournisseurs/coûts/politiques serveurs/cartographie approuvés |
| 4 Réservations/finance | Contrats, ingestion fixtures, réconciliation | Outil exact, docs API, sandbox, credentials, webhooks/règles actifs |
| 5 Technique et disponibilités réelles | Écrans inconnus, déclaration incident | Agent 1 et contrat identifiants/fraîcheur/sécurité/calcul capacité |
| 6 Apprentissage/expansion | UI/admin et calculs testés sur fixtures | Historique réel suffisant et approbation modèles/études |

Dès maintenant : construire avec fixtures isolées et les fonctions locales clairement définies ; ne pas bloquer tout le projet en attendant Agent 1. Le go-live technique doit rester limité aux fonctions réellement raccordées.
Restant à obtenir au bon moment : accès dépôt/environnement Codex, moyen réactivation DB, documentation outil réservation + mapping IDs, fournisseurs carto/IA et budgets, politique d'autorisation H.06, délégations/rôles détaillés et contrats Agent 1. Aucun secret à inclure dans un prompt/fichier livré ; saisir dans le gestionnaire de secrets de l'environnement.

## Recette obligatoire et preuve de couverture
Les 75 écrans ne prouvent pas 100% de couverture. Construire une matrice règle → écran(s) → données → action/condition → porte/dépendance → test → statut. Ajouter les règles absentes plutôt que considérer l'inventaire fermé. Les 180 tests historiques sont fournis mais NON exécutés sur l'app ; adapter notamment les tests 8/40–44 et mentions d'interface exclusive selon décisions ci-dessus, puis ajouter les cas multitenant/mobile/outils externes.
Tests prioritaires :
- Organisation A ne peut lire/modifier/exporter un dossier/pièce de B, y compris par ID direct ; révoquer accès bloque l'opération serveur.
- Aucune route d'exploitant ne permet décision Hervé, publication réseau, prix ou paiement non autorisé.
- GPS refusé/timeout/précision faible, trajet interrompu/import, station non déplacée par téléphone.
- Test partiel/incomplet ne valide jamais ; validation nominative localisée/versionnée ; suspension/condition périmée empêche exploitation.
- Pas de notes privées exposées lors d'une transmission/publication ; aucune communication interexploitants.
- Webhook rejoué, paiement tardif, annulation/remboursement ne double-comptent ni réservation ni commission ; même règles sur export et UI.
- Disponibilité technique absente = unknown, pas zéro ni capacité approuvée ; fermeture double-cause non double-soustraite.
- Canaux payants interdits ; budgets null/exhausted bloquent appels payants ; cache et reprise ne doublent pas coût.
- Référence factuelle IA sourcée, suggestion étiquetée, aucune promesse/prix inédit actif.
- UX réel et preview 320/360/390/768/1024/1440, clavier/zoom200%, focus/modal, erreur/offline, navigation sans overflow global ni footer cachant contenu.
- Aucune migration destructive implicite, secrets absents du client, migrations rejouables et contrôles restauration/Storage avant production.
Un module n'est terminé que si règles/accès/erreurs et tests sont prouvés ; fonctionnalité raccordée distincte de fixture.

## Instruction de démarrage à coller dans Codex
« Développe l'application SpiderBox Liberty à partir de ce dossier. Lis HANDOFF_CODEX.md puis les décisions prioritaires, le statut framework, le manifeste source et l'inventaire screens.json. Évalue/applique le correctif framework-patch sur une branche puis valide build/typecheck/recette avant import des composants. Réutilise les composants/tokens du framework et préserve les règles spécifiques validées avec Hervé. Inspecte le dépôt et ses AGENTS.md avant modification. Commence par la matrice de couverture, l'import du DS et le lot 1 ; audite Supabase existant après réactivation sans recréer la base ni appliquer aveuglément le DDL historique. Isole fixtures et connecteurs différés. Vérifie permissions avec deux organisations et pièces, tests circuits/version/périmètre, et mobile. Avance sur les fonctions autorisées sans attendre les futurs agents ; indique chaque dépendance réellement bloquante. Ne déclare jamais 100% de couverture ou une connexion réelle sans preuve. »