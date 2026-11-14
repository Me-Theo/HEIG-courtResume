# Trouver le nombre de plage de rendez-vous optimal entre 2 groupe

En gros, on prend un graph $G = (A \cup B, E) bi-partie avec $A$ le group 1, $B$ le group 2
et avec les arète $E$ représentant si un membre du group 1 a un rendez-vous avec un ,menbre du group B.


Dans ce graph, trouver le nombre de plage optimal revien a trouver le nombre **optimal de coloration d'arrete**

Pour ce fair, nous allons :
- compléter le graph pour qu'il y ai le meme nombre de sommets dans $A$ que dans $B$ ansi que fair en sort que les sommets ai tous le meme dergée (crée un graph complet en gros)
- cherche le couplage parfait dans le graph optenue
- colorier le couplage avec un couleur $c$ et retier les arrête concerné
- recompencé tant qu'il nous reste des couplages possible avec des couleur différente a chaque fois

![alt text](image-1.png)
![alt text](image.png)


# Heuristique et approximation

### Coloraion de graph
m = nombre d'arêtes / n = nombre de sommets
###### LF (Largest-First) {O(m + n)}
colorier le sommets avec le plus grand dégré
###### SL (Smallest-Last) {O(m + n)}
trier par ordre de degré croisants → prendre par ordre inverse
(traitement des égalite durant le premier trie)
###### DESATUR {O(n^2)}
Plus grand dégré, si non plus grand degre de saturation
![alt text](image-2.png)
###### RLF (Recusive largest First) {O(n*m)}
![alt text](image-3.png)
en gros :
1. chosire le sommets de plus haut degré (+déterminer en cas d'égaliter)
2. ban ses sommets voisins
3. colorier le sommets avec la couleur **K**
4. recomancer (1) tanqu'il reste des sommets chosiable et non colorier
5. faire **K + 1**
6. répété depui (1)

**!!! quand un sommets est colorier, on le retire du graph, donc il compte plus pour les degré !!!**
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)

###### Perfomance
DESATURe et RLF sont optimales poure les gaphes bipatis

### Voyageur de comerce
L'idée du problème est de trouver la tounrée la plus court passan par tous les sommets
*Inégalité triangulaire* = $d(i,j) + d(j,k) \ge d(i,j)$

##### Heuristique
###### Plus proche voisin
choisire une ville au hazard → choire la vile la plus proche de celle-ci → repeate
![alt text](image-8.png)
###### Goulton
l'idée est de construire un cycle hamiltonien
1. parcourt les arètes de la plus courte à la plus long et sélectionner une arète si
   1. elle ne crée aucun sous-tour (donc un tour qui a une longueur $n<|V|$)
   2. elle ne cére aucun sommets de degré 3

![alt text](image-9.png)
###### Inertion la moins chère/plus chère
1. Construire une tournée partielle en choissant une ville et sa plus proche voisine (ou plus éloigner)
2. Déterminer l'arête {i,j} de la torunée actuelle et la ville k n'en faisant pas partie avec un coût d'inertion $d(i,j) + d(j,k) - d(i,j)$ minimum (ou maximum) → insérer k dans la tournée
3. repeate

###### Christofides
1. crée un arbre recouvrant $T$ de poids min
2. crée un sous-graphe $G'$ a partire des sommets de degrée impair de $T$
3. trouvé un couplage parfait $M$ dans ce le graph $G'$
4. Ajouter les arêtes de $M$ dans l'arbre $T$ (dupliquant les arêtes appartenant a $M$ et a $T$)
5. Construire une tournée en parcourant $T'$ tout en prenant des raccourcis pour eviter les viles déja visiter

![alt text](image-10.png)
![alt text](image-11.png)
![alt text](image-12.png)
**Facteur d'approximation** = $L' \le \frac{3}{2}L*$ ou $L* = $ la longueur optimal

###### Meilleur fusion
1. choisire un sommet central
2. crée une pseudo tourné qui conciste a faire le tour des sommets en passant toujour par le sommets central
3. on fusion les arrète dans l'ordre décroissant des gains qu'elle apporte

![alt text](image-13.png)
![alt text](image-14.png)

### Heuristiques d'amélioration et d'échange
en gros l'idée c'est de proposer une solution admisible → amélioré la solution localment → répéter

- modification local = *mouvement*
  - noté pour la solution $s$ avec le movement $m$ : $s \oplus m$
- nouvel solution est dite ***voisine***

![alt text](image-15.png)

###### Heuristiques k-opt
l'idée c'est de modifier une tounrée initial avec un movement
durant un movement, on peut remplacer k arêtes de la tournée
(souvant on utiliser 2-opt ou 3-opt)
![alt text](image-16.png)
- calcule du "coût" est O(1)
- modification demande une bonne strcuture, si non O(n)
![alt text](image-17.png)

#### Stats
![alt text](image-18.png)

### Metaheuristique
métaheuristique = heuristique plus général mais demande d'être adapter au problème

- s'arret souvant un optimum local
- non déterministes
- pas de garantie d'optimalité

![alt text](image-19.png)

###### Notation
$\hat{x} = $minium local
$x* = $minimum gobal

###### Caracterisation
une caterisation simple est de prendre les methodes trajectoire
- Recuit simulé
- recherche avec tabou
- recherche à voisignages variable


ou les methodes basées sur la une population (ou mthodes evolutionnistes), crée plusieurs solution en meme temps → chosire la plus adapter → dervier la nouvel solution


##### recuit simulé
(ça s'appel comme ça a cause de la métalurgie, la technique du recuit)
###### Paramètre
- $x_0$ solution initial
- structure de voisinage associant a chaque solution x un esemble de solution $N(x)$
- fonction objectif $f$ a minimiser
- température initial $T_0 > 0$
- température final $T_f > 0$
- facteur de décroissance de tepérature $0<\alpha<1$

$x$ = solution courant | $x*$ = meilleur solution rencontrée pour l'instant | $T$ = température actuelle

![alt text](image-20.png)

###### infos
- plus $T$ est proche de 0, plus la probabilité d'accepeter un movement reduit
- $T_0$ dois être asser grand pour permettre une liberté de movement suffisante mais pas trop grand quand meme (si non çaa prend trop de temps)
- approche possible
  - chosire une probabilité d'acepetation inital $p$ (ex : $p = \frac{1}{3}$)
  - générer des mouvement random et calculer leur amplitude absolue moyennes
  $\Delta_m = moyen |\Delta|$
  $T_0 = -\frac{\Delta_m}{ln(p)}$
  Ainsi un mouvement dégradant a, en moyenne, une probabilité $p$ d’être accepté au début du processus d’optimisation.

###### Additional
- update de température
  - update après $n$ iteration (constant, ou dépendament de la taile $n$ du problème)
  - update après un nombre donné d'iteration sans amélioration
- critère d'arrêt
  - temps donné de calcul
  - nombre d'iteration sans amélioration de $x*$
- Réchaufement prériodique : au lieu de s'arréter quand on bouge plus, on peut tenter d'augmenter la température pour voir si ça débloque
- Choix de $\alpha$ : proche de 1, typiquement $\alpha = 0.95$
- Théorèems de convergence : si on itère assé de fois, on peut trouver la meilleur solution mais ça peut tendre ver l'infinit lol
