# Project Hive
##### Protect the hive
[![Build Status](https://travis-ci.com/bgwest/project-hive.svg?branch=development)](https://travis-ci.com/bgwest/project-hive)
## Overview

A raspberry pi running a restful API. Includes a database to manage user data and events.

##### working routes:

auth-router.js

## How To

#### User Auth Account manual testing

[x] signup

```
[0]Benjamins-MBP:project-hive bwest$ echo '{"username":"brai123","password":"herpw","email":"brai@gmail.com","accesscode":"6542"}' | http localhost:3000/user/signup
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 479
Content-Type: application/json; charset=utf-8
Date: Mon, 08 Oct 2018 22:48:29 GMT
ETag: W/"1df-RLNW2fHlmhedgu0PBPiCgDHlTSU"
X-Powered-By: Express

{
    "token": "long token string"
}

[0]Benjamins-MBP:project-hive bwest$
```

[x] arm

```

```


## Tests Performed with Jest

###### testing app.js routes and responses.

#### auth-router.js

* 1: test if 404 is returned if any route is invalid

* 2: test if 200 is returned with a token on successful signup

* 3: test if a 400 is sent body data is missing (e.g. username)

* 4: test if a 400 is returned when no creation data is sent (no body)

* 5: test if 200 and your token is returned on successful login

* 6: test for 401 status if auth fails (aka bad pw or username)

#### arm-router.js

* coming soon

#### image-router.js

* coming soon

### Installing

To use this in your code:

- git clone repo 
- npm install 
- require('../src/app.js')

## Built With

** Please see package.json to confirm dependency details.

## Contributing

Please feel free to contribute. Master branch auto merge locked for approval for non-contributors.

## Versioning

*n/a*

## Authors

![CF](http://i.imgur.com/7v5ASc8.png) **Brai Frauen**, **Jason Hiskey**, **Kristian Esvelt**, **Benjamin West**

## License

*none*
