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
[0]Benjamins-MBP:project-hive bwest$ echo '{"username":"bwest","password":"testing","email":"ben@gmail.com","accesscode":"4129"}' | http https://project-hive.herokuapp.com/user/signup
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 479
Content-Type: application/json; charset=utf-8
Date: Wed, 10 Oct 2018 00:40:13 GMT
Etag: W/"1df-L3Ya9L/5FrSFykA0/NIAAlIm6Js"
Server: Cowboy
Via: 1.1 vegur
X-Powered-By: Express

{
    "token": "long token string"
}

[0]Benjamins-MBP:project-hive bwest$ 
```

[x] arm example passing [ validated code, non-existent code ]

```
[0]Benjamins-MBP:project-hive bwest$ 
[0]Benjamins-MBP:project-hive bwest$ http https://project-hive.herokuapp.com/arm/4129
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 57
Content-Type: application/json; charset=utf-8
Date: Wed, 10 Oct 2018 00:42:59 GMT
Etag: W/"39-PzpqiAy/VBOlVa7oDONUEgsRNl8"
Server: Cowboy
Via: 1.1 vegur
X-Powered-By: Express

{
    "accesscode": "4129",
    "isValid": true,
    "message": "verified"
}

[0]Benjamins-MBP:project-hive bwest$ 
[0]Benjamins-MBP:project-hive bwest$ http https://project-hive.herokuapp.com/arm/3000
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 65
Content-Type: application/json; charset=utf-8
Date: Wed, 10 Oct 2018 00:43:11 GMT
Etag: W/"41-NQuKQVBHNLK6Jl00Z025Dh+Da3k"
Server: Cowboy
Via: 1.1 vegur
X-Powered-By: Express

{
    "accesscode": "3000",
    "isValid": false,
    "message": "bad access code"
}

[0]Benjamins-MBP:project-hive bwest$
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

* 1: testing VALID accesscode on arm route - should return isValid = true

* 2: testing INVALID accesscode on arm route - should return isValid = false

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
