# TE 2
## (6) Security
### Same orgine policty
"tow page from different origine should not be able to interfere with each other"

Une origine c'est le **protocol**, le **host** et **port**
- exemple : **http://www.example.com:80**

et par interfere on entend :
- Exec JS accesing DOM ou exec JS depuis une autre page
- Modifying an iframe content
- Fetching depuis une autre origine
- Fetching depuis un sous domaine

donc en gros, ça veux dire que l'on ne peut pas inerferé avec un page des manière dit si on vien pas de la meme orgine

###### Exeption
- static ressource embedded (image, scripts, styles, etc...)
- action field des forms

#### Iframe
y a une API pour choper ce qu'il y a dans une Iframe et logiquement on peut que le fair si la Iframe et la page parent on la meme origine
```JS
const iframe = document.createElement('iframe')
iframe.src = 'https://bank.com'

// Forbidden unless currently on https://bank.com
iframe.contentDocument.body.style.backgroundColor = 'red'

// Allowed
iframe.src = 'https://almost-bank.com'
```

##### Document.domain
on peut change le domaine de la page (que ver des dommain parent) si on veut (MAIS FAUT PAS LE FAIR, c'est du caca).

if **login.heig-vd.ch** sets `document.domain=heig-vd.ch`, then any subdomain of **heig-vd.ch** can communicate with **login.heig-vd.ch** if it also sets `document.domain=heig-vd.ch`!

Note that if **login.heig-vd.ch** sets `document.domain=heig-vd.ch` it **cannot** access content on **heig-vd**! The latter would also need to **explicitly** set `document.domain=heig-vd.ch` to allow access.

##### postMessage
function pour envoyer des message depuis la iframe ver le parent

### Cross-Orgine Ressources Sharing (CORS)
En gros, la policy qui regie les requets d'origine différente

Quand elle est active, les majorité des request sont bloqué
(c'est géré par le browser si jamais, **pas** le server)
le but est d'empécher le JS client de faire des request unauthorized

#### Allowing specific orgin
y a 2 header important pour géré le CROS
- Orgine : orgine de la requet
- Access-Control-Allow-Origin : permette a la reponce de dire qu'elle domaine sont authorisé

ces 2 header permette de crée la white list du CROS

#### CORS preflight request
Le truc, c'est que les requet style POST, DELETE etc..., elles ont besoin de savoir si le sever les autorise.

Du coup, on evoie un "preflight request" qui ai une requet envoyer automatiquement par le browser et qui demande si c'est ok
Ex :
- requet
  ```
    OPTIONS / HTTP/1.1
    Host: domain-b.com
    Origin: http://domain-a.com
    Access-Control-Request-Method: DELETE
    Access-Control-Request-Headers: X-PINGOTHER, Content-Type
  ```
- Respond
 ```
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: http://domain-a.com
    Access-Control-Allow-Methods: DELETE
    Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
  ```

#### CORS credentialed requests
si on veut des cookie ou HTTP authentification information
Faut demander parceque par defaut c'est pas authoriser

les methode **fetch** et **XMLHttpRequest** le demande par defaut elle par contre :]

### Client-side security
#### Cookie
Definie par une value et un nom
peuvent aussi avoir une date d'expiration, voir quelque directive de securité

y a ça si jamais
![alt text](image.png)
et en gros, le server peut dire a un client "stp, fait un cookie" avec le header `Set-Cookie : <name>=<value>, <name2> = <value2>, ....`;
et le browser vas repondre avec les cookie qu'il a avec `Cookie: <cookie-name>=<cookie-value>; <cookie-name>=<cookie-value>`, puit il vont ce mettre d'accord

###### Cookie client
on peut set un cookie depuis le client

#### Session
En gros, le server stock des donnée de session
just, faut ce rappler que c'est lier a un session ID qui dois être
- choisie par le server
- être sûr (genre pas falsifiable)
- unique a chaque session
- secretement partger avec le client
- le client, lui, le renvoie a chaque request (avec un cookie par exemple)
- et dois expiré au bout d'un moment

##### Attribut important
- Secure : si set, alors seulement envoyer vier a HTTP**S**
- HttpOnly : empèche JS d'acceder a ce cookie
- Domaine : permette de set le domaine du cookie pour le quelle il est valide


### Cross-Site Request Forgery (CSRF)
En gros, c'est just le fait de douiller le server et le client. Et de faire faire de truc pas prevue, gener accédée a donné par exemple.
Example où l'on veut afficher le l'avatar d'un compte en douce
```
<h1>Welcome to your account!</h1>
<img src='https://bank.com/avatar.png' />
```

le sever peut empécher ça en simplement verfiant si l'emeter a bien le bon domaine. Mais la reponce a la request peut être caché par le browser et donc impossible de la bloquer coter server

heursement, y a des header pour controller ça :
- `Vary : Referer` = uses the values of the **Referer** header as cache key
- `Cache-Control : no-store` = prevents caching altogether.

###### Referer vs Origin
Origin = domain, protocl and port mais pas le full URL
Referer = track ça plus d'ou vien le user, gener le lien sur le quel il a clicker par exemple

### Scenario 2
imagine je te fait clicker sur un lient qui en gros fait que ton compte se supprime

pour bloquer ça, on a des cookie header qui peuvent empécher le browser de balancer des cookie sans réféchire :
- SameSite = Strict : only send with same origin requests
- SameSite = Lax : also send when user navigates to the cookie’s origin (default)
- SameSite = None : send with all requests

### XSS
#### Reflected XSS
le code fait partie de la requet
```JS
// on the server
app.get('/', (req, res) => {
    // Get user data from the query string
    const user = req.query.user
    // Reflect it back in the response
    res.send(`<h1>Hello, ${user}</h1>`)
})
```
envoyer `?user=%3Cscript%3Ealert(%27document.cookie%27)%3C/script%3E`

##### Contre
First rule: never trust user data.
Second rule: escape user data.
```JS
import htmlEscape from 'html-escape'

app.get('/', (req, res) => {
    const userHtml = htmlEscape(req.query.user)
    res.send(`<h1>Hello, ${userHtml}</h1>`)
})
```
#### Danger place
- Element content
- attribute value
- src et href
#### Safe place
- HTML bodie (avec '<' et '&') pour escape
- HTML attribute si entouré de ', " et &

BTW, on peut encoder notre reponce en HEX
la décode puis l'afficher, ça marche parceque l'HTML parser vas skip les character d'escape

(peut être fait avec `hexEncode(data)`);

#### Stored XSS
le code est stocker dans le server

#### DOM-based XSS
Manipulation JS pour fair en sorte que la victime fait afficher le code

### Content Security Policy (CSP)
En gros, ça empèche d'envoyer des donner ver d'autre site que le notre
`Content-Security-Policy: default-src 'self'; img-src 'self' instagram.com`


### Random
- faut pas encrypte les mot de passe, faut les hasher (logic)