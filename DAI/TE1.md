# TE 1

## Java IO 
##### Package
Y a 2 package IO : 
- java.io -> classic io package
- java.nio -> moderne package depui java 1.4, plus efficace et felixble mais plus complex a prendre en main

##### Data type
Y a 2 type de donner : 
- Binary : c'est les bytes[], donc la donner en brute
- Text : c'est une version interpreter de la donner pour la transformer en text

##### Utiliser IO
Em gros, y a InputStream and OutputStream, c'est des, Stream (no way) et ça à le meme fonctionement / logic qu'en c++
- Open the stream
- Use it
- Close the stream
  
###### Pour les bytes[]
Example Output (pour écrir sur un fichier) stream (**FOR BYTES[]**) : 
```Java
OutputStream fs = new FileOutputStream("file.data");

BufferedOutputStream bos = new BufferedOutputStream(fs);

for (int i = 0; i < 256; i++) {
  bos.write(i);
}

// flush le buffer -> écrit le buffer dans le fichier
bos.flush();

// close le stream, Close un buffer close aussi le stream
bos.close();
```

Example Input (pour lire sur un fichier) stream (**FOR BYTES[]**) : 
```Java
InputStream fs = new FileInputStream("file.data");

// utiliser un buffer pour tous charger -> lire
BufferedInputStream bis = new BufferedInputStream(fs);

int b;
while ((b = bis.read()) != -1) {
  System.out.print(b);
}

// close le stream, Close un buffer close aussi le stream
bs.close();
```
C'est fonction peuevent retourner une **FileNotFoundException**


###### Pour les String
Y a une sous type de stream qui permette de géré les charactère facilement
```Java
Reader reader = new FileReader("file.data", StandardCharsets.UTF_8);
```
et le buffer
```Java
BufferedReader br = new BufferedReader(reader);
```

Example de lecture de string
```Java
String line;
while ((line = br.readLine()) != null) {
  // Careful: line does not contain end of line characters
  bw.write(line + END_OF_LINE);
}
```


```Java
Writer writer = new FileWriter("file.data", StandardCharsets.UTF_8);
```
et le buffer
```Java
BufferedWriter bw = new BufferedWriter(writer);
```
après ça s'utilise comme le stream de base 



BREF, faux just foutre tous ça dans un **try/catch** pour choper les **IOException** 

## 💀💀💀 DOCKER 💀💀💀
##### Cheatsheet
```
# Build and tag an image
docker build -t <image-name> <build-context>

# Start a container using its image name
docker run <image-name>

# Start a container in background
docker run -d <image-name>

# Display all running containers
docker ps

# Stop a container
docker stop <container-id>

# Access a running container
docker exec -it <container-id> /bin/sh

# Start a container and override the entry point
docker run --entrypoint /bin/sh <image-name>

# Start a container and override the command
docker run <image-name> <command>

docker run -d --rm -p 8080:8080 plantuml/plantuml-server
-d = run in background
--rm = remove the container on stop
-p 8080:8080 = map machin port 8080 to this container port 8080

# Delete all stopped containers
docker container prune

# Delete all images
docker image prune
```

##### Create a docker file
```Docker
# Image sur la quelle on ce base pour crée la notre
FROM ubuntu:24.04
# Pour une app java FROM eclipse-temurin:21-jre

# Crée une variable d'environement
ENV key=value

# copie un directory (Sur notre machine) dans un autre (dans l'image)
COPY sourceDir destDir

# en gros, c'est un cd dans l'imagine
WORKDIR path

# Exec command
CMD ["echo", "Hello, World!"]

# Expose port
EXPOSE 8000
```