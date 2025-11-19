# Chap 1
Espace d'adressage -> espace total de utilisable

# Chap 2
#### CPU mode : user, kernel
#### CPL (2 bit)
Current Privilege Level
- 0 -> kernel
- 2 -> ?
- 3 -> user
- 4 -> ?

|Acces|Kernel|User|
|--|--|--|
|Priviledge Instruction |YES|NO|
|Direct access to all memory|YES|NO|
|Direct access to devices|YES|NO|
|run by **OS** |**YES**|NO|
|run by **APPLICATION** |NO|**YES**|

## Interuption
2 type : 
- Interuption **Materiel**
  - Interuption asynchrone
  - dois utilise l'IRQ (Interrupt Request)

- Interuption **Logicielle**
  - Interuption syncrone
  - Interuption pour : int, sysnter, syscall, swi, etc...
  - Exeption déclancher par le processeur crée ce genre d'interuption

## ISR : Interrupt Service Routine
Chaque interuption a une routine décrite en memoir et charger au démarage de l'OS

##### Exemple d'interuption Materielle
1) Devices -> send interrupt to interrupt controller
2) Controller send interrupt to CPU
3) CPU stop actual task -> change to kernel mode
4) Launch interupt routine
5) change mode to user mode -> reprend la task

##### exemple d'interuption logicel 
- syscall 
- seg fault
- division par **0**


## Architecture
##### Monolitique
Tous les sous-system son dans le kernel space pour faciliter leur fonctionement

- populaire par ce que simple a mettre en place
- pas beaucoup d'abstarction -> **(+)performant**
- pas très securisé
- code base du kernel souvant **très grand**

##### Micro processu
Le moins possible dans le kernel space
Application passe par des sous processus special dans le user space pour faire des appelle system.
Exemple : (User)App -> (User)File system -> (Kernel)Memorie management

- client - server
- (+)securisé
- Facilement extensible
- (-)perfomance

# Chap 3 | interuption
Instruction **svc** = syscall = passer en mode kernel

|Lib c|Desc|
|--|--|
|fork|create process|
|open|creat / read file|
|close|close file|
|read|read data from file|
|write|write data in to file|

Passe par le **STUB** pour traduire l'instru en instru system

#### Address 
- relative : relative à la plage memoire du programme 
- absolues : absolue
- symbolique : pas encore déterminier, use by linker


# Chap 4 | Process
PCB = Process Control Block = petit struct pour controller un programme
En gros état de la memoir du process, memoir des threads, tous ça
### MMU = Memory Management Unit


### Zombie
En gros, quand un process ce termine, il rent une valeur qui est stocker le PCB et elle ne seras libéré que lorsque le parent vient la lire (d'ou le **waitpid()**) mais du coup si ça arrive pas, bah le process rest mais sert a rien, genre un **zombie** 💀



### lib C
##### exec
- execl
  - execlp
  - execle

- execv
  - execvp
  - execvpe

- execve(path, args, envs) : En gros il appel tous ça 
```c
 char *const args[] = { "ls", NULL };
 char *const envp[] = { NULL };
 
 execve("/usr/bin/ls", args, envp);
```

### Routine de changement de context
1) Save PCB_0
2) Load PCB_1
3) Reconfig MMU parcequ'il faut set la memoir
4) Charger le PC
5) Good to Go :]

# Chap 5 | Thread
Thread relier à un process


#### Statue
- new -> crée 
- ready -> près â être lancé
- waiting -> zzz
- running -> [RUN]
- zombie -> terminer mais pas encore libérée

#### TCB = PCB pour les threads


#### Crée un thread 101
1) define a thread
```c
void * threadFnc(void * args){
    // do thing
    // since args is a void pointer, need to cast in case

    // obliger de rendre un truc si jamais
    return NULL;
}
```

2) call pthread_create()
```c
pthread_t threadAddr;
int argument=1;

// le agrument est optionel, si pas just NULL
threadAddr = pthread_create(&threadAddr, NULL, threadFnc, (void *)argument)
```

3) join le thread avec 
```c
// le NULL c'est l'address ou on vas écrire les resulta, mais du coup, bah là y a rien
pthread_join(threadAddr,NULL);
```

# Chap 6 | PIPE 🪈🚬 ⚗️
### FD = File Descriptor 
- En gros, c'est une table avec les addres de chaque pipe qui pointe sur des truc comme des fichier
- Y a une table global qui point ver chaque fichier ouver
- Y a FD local par process qui point sur certain de ces address
- tous les FD sont dans le kernel (no way)
- les pipes marche en **FIFO**

**dup2(pipeA, pipeB)** ça redirige la pipeB ver la pipeA

FD local : 
- entry 0 -> stdin
- entry 1 -> stdout
- entry 2 -> stderr
- ...

#### Max capacity : 4Ko

### Pipe nommé et anonyme
#### nommé 
- C'est crée avec **mkfifo()**
(c'est applée par **open()** par exemple)
- c'est une sorte de fichier virtuel si on veut
- ça dois être detruit vue que c'est comme un fichier



#### anonyme 
- C'est crée avec **pipe()**
- ça marche qu'entre process
- ça ce detruit automatiquement à la fin du **process**

```c
int fd_pipe;
char * pipe_name = "prout.pipe";
// = 0 -> pas pue crée :[
if(mkfifo(pipe_name, O_CREATE | 06444) != 0){
  // do somthing
}

// ouvre comme un fichierf
fd_pipe=open(pipe_name, O_WRONLY);
```

#### Just in case
- O_RDONLY = **R**ea**D** **ONLY**
- O_WRONLY = **WR**ite **ONLY**
- O_RDWR = **R**eaD **WR**ite
- O_APPEND = ajoute à la fin du fichier
- O_CREATE = si pas trouver -> crée

# Chap 7 | Signeaux
- En gros c'est un evenement qui dois être traiter balancer de manière async
- Un process reagie à c'est signau et les traite grace au **handler** dans le **user space**
- UN SEUL EXEMPLAIRE de signale par type dans la list d'attente
Genre si spam de ctrl-c -> 1 seul pris en compte
- fils d'attent **FIFO**
- masquer un signaux -> dans que masquer ingoré, demasquer -> efin pris en compte
- possible d'ingoré un signaux

### Signaux imporant 
- SIG**INT** : ctrl-C -> interupt
- SIG**KILL** : terminaison
- SIG**TERM** : aussi terminaison
- SIG**USR1** : Signal emis par process user
- SIG**USR2** : ausi Signal emis par process user
- SIG**CHILD** : terminaison d'un enfant

### libc
- **signal(int,sighandler_t)** -> associe un signal a une fnc
```c
void fncRandom(int sig){...}

singal(SIGUSR1,fncRandom);
```
- **kill(pid, int)** -> send the SIGKILL to a process but can also send a specific signal

- **SIG_IGN** -> ignore le signal 
```c
singal(SIGUSR1,SIG_IGN);
```


### Socket
|Client|Sever|
|--|--|
|socket(...)|socket(...)|
|  |bind(...)|
|connect(...)|listen(...)|
|   |accept(...)|
|send(...)|recv(...)|
|recv(...)|send(...)|
|  |close(connection)|
|close(...)|close(...)|

# END >:[
![alt text](GpqgF8GagAAf_Z0.jpg)

