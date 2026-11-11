# Architecture multi tier
division par tier = division physique (différente machine)
division par couche = division logic

**Loi de conway** = En gros, si un group est fait de 3 team, bah y auras 3 partie au projet



### couche et service
couche fermé = on ne peut pas contourné
couche ouvert = on peut

- Code de spagettie quand tous les couches sont ouverts

- pour éviter les monoliths dans le cas des gros code base **→** crée une couche service

- faut faire gaff parceque service != bon code, donc on peut faire plein de service de merde

### MVC
tkt



# Fonctionnalités avancées de Java

## Class loader
En gros, c'est le service qui s'occupe de charger les class au runtime, y a une hierachie et quand on trouve pas une class demander, on monter :
Custom loader → System (classpath) → Platform (module JDK) → Bootstrap (Java)


```java
system.out.println(String.class.getClassLoader());          // null : Bootstrap, natif
System.out.println(java.sql.Driver.class.getClassLoader()); // PlatformClassLoader : module du JDK
System.out.println(Sample.class.getClassLoader());          // AppClassLoader : votre classpath
```

loader exemple :
```java
public class CustomClassLoader extends ClassLoader {

    public CustomClassLoader(ClassLoader parent) {
        super(parent);
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] bytes = load(name);
        return defineClass(name, bytes, 0, bytes.length);
    }
}
```

### plugin
un plugin c'est un JAR qui est ajouter au run time en plus par le service loader

### Framework random
|spring boot | Quarkus | Fabric MC |
|---|---|---|
|truc pour faire des app<br>class loader dedier|truc pour faire du web <br> class loader hotreload|omg fabric mention|

## Reflection
relexion = programe qui se regarde lui meme

exemple :
```java
import java.lang.reflect.*;

// Instancier un objet
Class<?> clazz = Class.forName("com.example.MyClass");
Object object = clazz.getDeclaredConstructor().newInstance();

// Invoquer une méthode de l'objet
Method method = clazz.getMethod("myMethod"); // renvoie que ce qui ex plubique
method.invoke(object);
clazz.getDeclaredMethod("methodes"); // chope tous

// Affecter une valeur à un champ de l'objet
Field field = clazz.getField("myField");
field.set(object, "myValue");
clazz.getDeclaredField("methodes"); // meme vibe
```
btw la reflextion est couteuse

## Annotation au runtime

```java
@Retention(RetentionPolicy.RUNTIME) // visible par reflection à l'exécution
@Target(ElementType.FIELD)          // ne peut annoter qu'un champ
public @interface Hidden {
}
class Config {
    @Hidden String value = "???"; // annoté : à cacher
}
Config.class.getField("token").isAnnotationPresent(Hidden.class) // true
```

## Proxies
En gros, on gref une class au run time pour agire en temps que proxie a une autre genre
![alt text](image.png)

par logic, un proxie ça marche que s'il est sur une interface
Spring et CDI le contourne en créeant des sous-class mais du coup c'est limiter par l'héritage

aussi un proxie ne sais que choper ce qui vien de l'exterieur, pas les appel interne

## Annotation a la compilation
c'est géré par un plugin de javac. Il complie par round, il chope toutes les annotation, complie les fichiers qui les gère est continue tanqu'il y a du boulots

le but est d'éviter de recomplier chaque anotations a chaque fois en stoquand les resulta dans une fichier `target/generated-sources`