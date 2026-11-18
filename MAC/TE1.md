# NoSQL
# Couchbase N1QL
c'est des json avec des shema donné
- y a des clef étrangère
- on peut imbriqué des donner, comme en JSON

###### Dico
- Item : clés-valeur
- Bucket : database qui regroupe les items
- Collection : organise les doc a l'interieur d'une Bucket
- Scope : groupe plusieur Collections

![alt text](image-16.png)

# Neo4j
# Modèle de Distribution et Cohérence
SGBD = Système de gestion de base de données
#### Architecture
![alt text](image.png)
### Distribution
2 type de d'aproche générique :
- Pratitionner (sharding) : diviser la base en sous ensemble de données
- Replication : copyer la base sur une autre node
*Modèles de distribution* = algo pour distribuer

#### Log de réplication
###### Statement-based replication
- log chaque requête d'ecriture exécuter

**problème** :
- NOW(), RAND(), etc. change a chaque execution
- Les instruction UPDATE ... where doivent être executer dans un ordre precis, si non ça casse
- instruction a side effect peut avoir d'autre side effect si executer ailler
###### Write-ahead log (WAL)
- log une sequence d'octets qui correspond au resulta d'une ecriture
- les client on just a la copier sur le disque
**problème** :
- dépendant du moteur de stockage
- si y a une changement dans le stockage suite a une update → 💀
*PostgreSQL* et *Oracle*
###### Logical (row-based) log
l'idée est de découper le format de log du format de stockage

on stock donc souvent :
- Ligne inséré
- Ligne supprimée
- Ligne mise à jours
avec les info pour les identifier

**avantage** :
- rétro-compatbilité (vue qu'indépendant du format de stockage)
- facile a analyser par une app externe

###### Trigger-based replication
Dans le cas où on a besoin de sortire du cardre de la base de donné classic, on peut déplacer la replication sur la couche application

approche plus couteuse et est plus risquer car on sait plus faire de logiciel

*Bucardo pour PostgreSQL* et *Oracle* le font

permette de : réplique des sous-ensemble de donné, repliquer un type de base a une autre et ajouter des logic de resolution de conflis

on a donc :
- **Trigger** : save la modif sur un table a part pour pouvoir être lue par un programme externe
- **Process exeterne** : applique la logic

#### Problèmes de délai de réplication
quand on est en **sync** et qu'il y a une couille dans le reseau → 💀
aussi plus y a de noeud, plus ça risque d'arriver

quand on est **async** on peut dé-sync et du coup on est incohérent pendant un temps (c'est applé "cohérence éventuelle")

#### Problème Lecture-écriture (Reading Your Own Writes)
si tu lit une donné depuit un noeud pas sync avec le reste ça peut crée des incoéhrence

pour reglé ça faut s'assuré que le user lit les donné qu'il a écrit (genre si tu push puit lit, bah tu voie le push), pas forcément le cas pour les autre users

**Tech** :
- quand on lit un truc qui a pue être modifier → privilégier la version du leader
- dans le temps just après une maj de la base (genre 2 - 3 min)→ lire depuis le leader
- le client peux être orienter ver un data base qui eu sa maj en priorité
- timestamp logic
-
#### Problème Lecture monotones
2 requet mais pas la meme reponce parceque les noeud était pas update

pour réglé :
- avoir une cohérence de lecture entre les user, genre un user devrais être renvoier ver le meme noeud

#### Resoudre le problème de délais
si c'est un délais accéptable → on s'en fous
sinon → on fait un system


### Algo de replication
##### Leader unique
y a une node qui est leader, les autre suivent. Peut être **sync** ou non. Dans le cas **async** faut faire gaff, vue que le leader peut crach et on ce retrouve avec une base incohérente sur les autre nodes (genre écriture perdu).
**Semi-sync** exits ou genre, y a un follower qui est sync et les autre non

**ajouter une folower** :
- snapshot de la base
- copier la snapshot
- demander les dernière modif depuis la snapshot au leader
- appliquer les modif (catch-up)
**Si pan** :
- follower : catch-up quand revien
- leader : un follower est elu leader, faut just reconfig les client pour qu'il se sync sur le nouveau leader
##### Multi-leader
plusieur noeud accept les écritures au lieux de 1

En gros, quand y a noeud qui écrit, elle le dit et les autre repliques

pour géré les conflit et problème de cohérence :
on utilise **vecteur de version**

bref a eviter car ça amène plein de merde mais utile pour  :
- Opération off-ligne : calendrier sur mobile et descktop
- Collaborative editing : google doc

##### Replication sans leader (Dynamo-style)
*Dynamo*
<img src="image-1.png" alt="drawing" width="50px"/>

En gros, no more leader, tous le monde est chef

quand on écrit ça peut être la merde si une des noeud était en pan, vue que la lecture devien incohérente. Pour eviter ça, on lit aussi sur plusieur node avec un num de version pour trier
###### Quorums de lecture et d'écriture
- pour $n$ répliques
- chaque écriture doit être confirmer par $w$ noeuds
- on lit $r$ noeuds
- si $w + r > n$, on est sure de choper une lecture correcte vue qu'il y a au moins un noeud a jours

$n$ = nombre impaire (3 ou 5)
$w = r = (n + 1) / 2$ (arrondi au supérieur)


## Partitionnement
![alt text](image-2.png)
#### Comment partitioner
- Equitable
  - Chaque node gère sa part de données
  - peux augmenter le debit global
- Asymétrique
  - certaine partition contiennent plus de donné et recoive plus de requet
  - peut crée des hot spots

###### Partitionner les clé-valeur
En gros, on hash les clé pour trouver la valeur
genre exemple : floor(key / page_size) = node_id

ça garentie pas que les clé sois bien répartie

###### hashage de clé (pour de vrais)
on fait des bucket, c'est just une hash map lol

mais on peut plus faire des requet efficace vue les clef sont plus stocker de manière adjacents 🥀

#### Rééquilibrage des partitions
Au fil du temps :
- (+) debit de requêtes
- (+) size de la DB
- (+) machine qui peuvent tombé en panne

*noob* : hash % nombre_node → fait qu'on bouge tous a chaque fois

🗿**pro** : quand on ajouter une node, elle vas voler des partition autre node jusqu'à que se sois équilibré. Si on supprime, on fait la meme a l'inverse

*🤓☝️ erm actually :* ça peut fait de manière automatique ou manuel ou des entre 2

### Request Routing
Comment on sait quel node est concerné par les requets ?
![alt text](image-4.png)
3 approche :
- **Routage par les noads** : le client contcte n'import quelle node (round-robin). Si la noad a la partition on est good, sinon on transmet
  ![alt text](image-3.png)
- **Couche de routage** : y a une couche dedier au routage qui dit quelle node est repsonsable de chaque demande, elle traite pas la demande, just la rebalance
  ![alt text](image-5.png)
- **Conscience du client** : le client connait les partitions, y a plus de problème
  ![alt text](image-6.png)

#### Service discovery
###### ZooKeeper
genre c'est une base qui gère les metadonné pour svaoir dans quel node ce trouve les données
![alt text](image-7.png)
il fait autorité

##### Cohérence dans les bases de données
la cohérence peut devenir difficile vue qu'il faut que les requet garde leur intégriter alors que les donné sont repartie
###### Conflit d’écriture (dirty write)
![alt text](image-8.png)
**eviter** : en gros faut mettre un verrous, pessimiste (faut l'aquérire et après on fait ce que l'on veut) ou optimist (on fait rien et s'il y a un problème on régle)
###### Conflit de lecture (dirty read)
![alt text](image-9.png)
![alt text](image-10.png)

#### Niveau d’isolation des transactions
(+) niveau d'isolation est élevé, (-) y a d'anomalie mais ... REQ lente 🥀
![alt text](image-11.png)

#### Traitement des transactions dans NoSQL
- Centraliser : simple à géré, ACID, isolé
- distribué : faut coordonner la validation entre les nodes. Exemple avec un PROTO 2PC

###### Cohérence de la réplication
en gros, au bout d'un certain temps, l'ecriture est repliqué et :
- Cohérence a terme (Eventual consistency)
-  En attendant : données périmées (stale data)

###### Incohérence de réplication
![alt text](image-12.png)

#### Le théorème de CAP
Consistency:
- après une maj, tous les read vois la meme donné
Availability:
- Si une node fontionne, il peut R/W les données → chaque demande dois être repondue
Partition tolerance:
- Le systeme continue à fonctionner meme si 2 ensemble de server sont isolé
- Echec de connexion → continue a fonction 🗿

**Theorème** : un system de donné distribuer peut pas avoir les 3 props de CAP, 2 / 3 c'est possible par contre

###### Raison
![alt text](image-13.png)
on doit choisir entre la cohérence parfait ou la disponibilité parfait
- si cohérent → prend du temps donc pas disponible
- si disponible → alors pas le temps de checker donc pas cohérent

Solution : faut faire du cas par cas et des entre deux 😭

## Recherche d'information
c'est les REQ sur un doc (text, video, image, raw data)

#### Paradox de la RI
REQ ideal contient toutes les infos que cherche le user
mais le user est con et du coup il sait pas ce qu'il ne connait pas

### Modèle de RI
en gros
- document → pré-structuré → data
- req du user → REQ structuré → besoin claire
- data into besoin claire → bonne data

![alt text](image-14.png)

