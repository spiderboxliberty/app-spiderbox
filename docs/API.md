# Contrats HTTP initiaux — démonstration locale uniquement

Toutes les réponses API sont JSON avec `Cache-Control: no-store`. Le serveur est lié à la boucle
locale, refuse les hôtes étrangers et les origines navigateur autres que l’origine locale ou Vite local.
Les erreurs suivent `{ "error": "message" }`. Les DTO de mutation refusent les champs supplémentaires.
Une ressource hors organisation/stations répond 404, comme une ressource inexistante.

| Méthode / chemin                 | Droit / entrée                                                    | Sortie et transition                                                                                    |
| -------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| GET `/api/health`                | Public local                                                      | Mode, état, persistance et intégrations                                                                 |
| GET `/api/session`               | Public local, fixtures exclusivement                              | Session fixe org A, cookie HttpOnly/SameSite Strict, expiration 8 h                                     |
| GET `/api/overview`              | `station:read`, session serveur                                   | Stations autorisées, circuits de ces stations, relations privées de l’organisation et ses transmissions |
| POST `/api/circuits/:id/prepare` | `circuit:prepare`, org/station, `{version}`                       | Documentaire → préparé ; version incrémentée ; 409 si obsolète ou déjà préparé                          |
| PATCH `/api/partners/:id`        | `partner:write`, org, `{version,status,note,reminder}`            | Statut borné, note ≤ 2000 caractères, date locale valide ou null ; version incrémentée                  |
| POST `/api/submissions`          | `submission:create`, org/station, `{circuitId,version,requestId}` | `requestId` UUID, version attendue ; reçu en mémoire, date serveur UTC                                  |

La transmission conserve un instantané de titre/ID/version du circuit et l’auteur côté serveur.
La même clé d’idempotence est scoped utilisateur/organisation et renvoie le résultat original ; la
réutilisation avec un contenu différent produit 409. Le serveur ne prend aucun champ privé arbitraire.
La liste côté client ne divulgue ni notes, ni données d’autres organisations. Le journal en mémoire
retient action/auteur/ID/date, sans notes. Rien n’est persisté entre redémarrages.

401 : session absente ; 403 : action/origine/hôte non autorisé ; 404 : ressource/opération indisponible ;
400 : JSON/DTO invalide ; 409 : conflit ; 413 : corps > 64 Kio ; 415 : type non JSON.
Une erreur doit conduire l’utilisateur à recharger en cas de conflit. La session démo peut être renouvelée
en rechargeant la page. Les requêtes fournisseur, fichiers, exports, administration, validation terrain,
commandes techniques, finance et publications sont absents : aucune route ne leur donne accès.

Avant un service réel : remplacer le bootstrap fixture par une identité vérifiée ; recharger les droits
actuels à chaque opération ; stocker audit et idempotence de manière transactionnelle ; définir les limites
et les contrats de fichiers/exports ; éprouver les politiques RLS/Storage. Les tests de permissions actuels
ne constituent pas un test de révocation dans un fournisseur d’identité réel.
