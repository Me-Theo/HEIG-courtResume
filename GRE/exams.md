# Exams
## Chap 8 2/2

### Graph planaire


### Graph eulérien
#### Definition
- chaine eulérienne = chaine qui passe une seul fois dans par chaque sommet qu'elle parcoure
- cycle eulèrien = c'est une chaine eulérienne qui passe par tous les sommet de G
- Graph eulèrien = graph qui comprend un cycle eulèrien

#### conctruction de cricuit eulerien
1) choisire un sommet et construire une anti aborescence recouvrante en partant du sommet *r*
2) Crée le cercuit iterativement en explorant le graph a partire *r*
   - quand faut choisire l'arc sortant d'un sommet (hors mit *r*)
     - choisire celui de l'anti-arborescnece uniquement s'il s'agit du dernier arc non encore utilisé quittant le sommet

#### Le problème du postier chinois
en gros, on cherche un chemin qui passe par tous les sommet du graph mais avec une longueur min.
###### 2 cas
- si