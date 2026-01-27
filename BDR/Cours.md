# BDR
## Modèle EA
...
## Modèle relationnel
...
## Modèle EA > Modèle relationnel 
...
## Algèbre relationnel
...
## SQL 
...
## Dépendance fonctionnel
...
## Indexation
l'indexation c'est le fait de rajouter une donnée qui peremette de plus facilment accédée au donnée de la base (genre comme un hash)

##### Request step
- Parser : prend la request et check pour les erreur de syntaxe et problème evidents
- Rewriter : en gros il check les règle des table/view et verifie que la requet les enfrin pas
- Optimizer : Optimise la requet en trouvant la manière la plus efficace de l'executer (crée un plan)
- Plan : Exec le plan

##### Modèle de coût
Y a un modèle de coût, se sont des points qui sont attribuer sur la requet par rapport au co^t thorique (I/O et CPU) de celle si.

List des coût : 
`point = p`
- `bloc` : nombre de bloc mémoire (8192 oct) charger par la requet, en général c'est `1 block = 1p`
- `cpu_tuple_cost` (`defaut = 0.01p`): coût de traitment de chaque ligne de la requet 
- `cpu_operator_cost` (`defaut = 0.025p`) : coût de traitment de chaque operateur/function exécuter 

Si on utilise des **index** ça implique beaucoup de I/O random
*En gros, c'est le fait qu'avec un index, on s'en fou de l'ordre des tuple (en théorie), d'où le I/O random*
- `random_page_cost` (`defaut = 4p`) :  coût de lecture d'une page aléatoir 
- `cpu_index_tuple_cos` (`defaut = 0.005p`) : coût CPU de traitement d’une entrée d’index.

###### Paramètre ded parallélisme
- `parallel_tuple_cost` (`defaut : 0.1p`): Coût de transfert d’une ligne entre workers
- `parallel_setup_cost` (`défaut : 1000p`): Coût d’initialisation des workers
- `min_parallel_table_scan_size` (`défaut : 8 Mo`): Taille minimale d’une table pour activer le parallélisme.
- `min_parallel_index_scan_size` (défaut : `512 Ko`): Taille minimale d’un index pour scan parallèle


##### Init index
```SQL
CREATE INDEX index_product_id ON products (product_id);
```

###### Type d'index
- **B-tree** (defaut) : Organise les entrées dans l’ordre croissant.
  - `<` `<=` `=` `>=` `>` `BETWEEN` `IN` `IS NULL` `IS NOT NULL`
- HASH : hash de 32 bits
  - **QUE pour `=`**
  - à utilise quand on sait qu'on auras une chier de requet avec `=`
- **BRIN** (**B**lock **R**ange **IN**dexes) : stockent des résumés (min/max) des valeurs pour des plages de blocs de la table
  - `<` `<=` `=` `>=` `>` `BETWEEN` 
  - Ils sont très efficaces lorsque les données sont ordonnées ou corrélées physiquement (ex. séries temporelles, logs).
- **GiST** (**G**eneralized **S**earch **T**ree) : Supporte l’indexation de types complexes : formes géométriques, documents de texte intégral, etc. 
  -  `<<` `&<` `&>` `>>`...
  -  Utile pour les opérateur personaliser pour des recherche avancée
  -  Exemple, la recherche par `poin` **(x,y)** (oui, c'est un type de base PSQL)
- **SP-GiST** (**S**pace **P**artitioned **G**eneralized
**S**earch **T**ree) : Idéal pour les données naturellement partitionnables (spatiales,hiérarchiques, …)
  - Autorise des facteurs de branchement différents selon les nœuds, optimisant la structure de l’arbre.
  - Particulièrement efficace pour les requêtes spatiales complexes et les très grands ensembles hiérarchiques
- **GIN** (**G**eneralized **I**nverted **I**ndex) : conçus pour indexer efficacement des colonnes contenant des valeurs composées, typiquement (int[], text[], etc...)
- Index composite : Index multicolonne ()
  - `CREATE INDEX index_product_id_name ON products (product_id, product_name);`
- Index partiel : index sur un sous-ensemble, genre seulement les tuple de `WHERE a = 'truc'` par exemple
  - `CREATE INDEX index_product_id ON products(product_id) WHERE product_available = 'true';`
- Index couvrant (coverying index) : Permettent des Index Only Scans lorsque les colonnes sélectionnées figurent dans l’index.
  - `CREATE INDEX index_product_id_name_status ON products (product_id, product_name) INCLUDE (status);`


#### Bonne pratique
pas d'index pour rien, c'est couteux, genre si les donnée sont trier, par besoin d'index suivant comment

Si on ajout un index, utliser `EXPLAIN` ou `EXPLAIN ANALYZE` pour voir si c'est vraiment une bonne idée