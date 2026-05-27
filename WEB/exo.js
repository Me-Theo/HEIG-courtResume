/*
Filtrer les valeurs d'un générateur

Nous souhaitons pouvoir filtrer les valeurs d'un Generator reçu en paramètre pour ne garder que les valeurs qui satisfont un prédicat (fonction qui prend une valeur et retourne un booléen).

Complétez la fonction génératrice filterGen qui prend en paramètre :

    generator : un générateur (Generator)
    predicate: prédicat qui est utilisé pour filtrer les valeurs du générateur en paramètres

Cette fonction génératrice doit uniquement émettre les valeurs du générateur reçu en paramètre qui satisfont le prédicat.

Des exemples d'utilisation sont donnés dans test.mjs.

IMPORTANT : votre implémentation doit filtrer les valeurs du générateur reçu en paramètre au fur et à mesure. Il n'est donc PAS admis de stocker les valeurs du générateur dans un tableau intermédiaire et d'utiliser les méthodes des tableaux tels que filter ou autres sur ce dernier.
*/

function * filterGen(generator, predicate) {
    // TODO complete
}

// Create a generator from array
let numbersGen = generator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

console.log("Keeping odd values: ");

// expand the filtered values of the generator into an array (keep only odd numbers)
console.log([...filterGen(numbersGen, x => x % 2 === 1)]);

console.log("----------------------------------------------")

// Create a generator from array
let flowersGen = generator(["Sunflower", "Rose", "Tulip", "Daisy", "Lily", "Orchid"]);

console.log("Keeping flower names having 5 or more characters: ")

// expand the filtered values of the generator into an array (keep only words of length 5 or more)
console.log([...filterGen(flowersGen, s => s.length > 4 )]);

// Create a generator from an array
function* generator(array) {
    yield * array;
}

/*------------------*/

/*
Grouper des mots par leur longueur

Soit un tableau avec des proverbes idioms.

Nous souhaitons regrouper les mots de ces proverbes par leur longueur.

Complétez la fonction groupedByLength(idioms) qui prend en paramètre idioms, un tableau de proverbes et retourne un objet contenant les mots individuels des proverbes regroupés par longueur.

Pour le tableau donné en exemple, l'objet attendu en sortie est :

{
  '1': [ 'a', 'a' ],
  '2': [ 'of', 'in' ],
  '3': [ 'leg' ],
  '4': [ 'cake', 'once', 'blue', 'moon' ],
  '5': [ 'break', 'piece' ]
}

On vous demande d'uiliser les functional array methods telles que filter, map, flatMap, reduce, etc...

Note : la méthode split(pattern) divise une chaîne de caractères en une liste ordonnée de sous-chaînes (à l'endroit du pattern), place ces sous-chaînes dans un tableau et retourne le tableau.
*/

function groupedByLength(idioms) {
    //TODO complete
}

export const idioms = [
    "break a leg",
    "piece of cake",
    "once in a blue moon"
  ];

  let result = groupByLength(idioms);

  console.log(result);