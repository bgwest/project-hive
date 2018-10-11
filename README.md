# Project Hive
##### Protect the hive
[![Build Status](https://travis-ci.com/bgwest/project-hive.svg?branch=development)](https://travis-ci.com/bgwest/project-hive)
## Overview

###Description
- A home security system on a Raspberry Pi running a restful API
- Armed, arming, disarmed, alarm, and motion detection states are currently represented by four LED's
    - Green LED: armed state
    - Red LED: disarmed state
    - Yellow LED: alarm state
    - Blue LED: currently arming or warning states
- Takes picture of intruder ?
- Outputs sounds depending on state ?
- You may send commands to the pi from a locally connected computer
- Pi communicates with a Heroku database to store user information and pictures taken

### Usage
- To create an account, send in a username, password, email, and access code
- To arm the system, send a GET request to the arm route with a valid access code
    - If the access code is valid the arming state will turn on for 30 seconds, after which it will enter the armed state and turn on the motion sensor
- To disarm the system, send a GET request to the disarm route with a valid access code
    - If the access code is valid all other states will be disabled, the motion sensor will turn off, and the disarmed state will activate

### Security
- When armed, if the motion sensor detects any movement, the warning state will activate for 30 seconds
- If a valid disarm request is not sent during those 30 seconds, the alarm state will activate
- 5 seconds after the alarm state activates, the camera will snap a picture

### Pi components
(Pi schematic picture)
- Raspberry Pi 3
- Breadboard ?
- PIR motion sensor ?
- Raspicam ?
- wires ?

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

[x] arm example passing [ validated code, invalid code ]

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

### Installing

To use this in your code:

- git clone repo 
- npm install 
- require('../src/app.js')

## Built With

** Please see package.json to confirm dependency details

## Contributing

Please feel free to contribute. Master branch auto merge locked for approval for non-contributors.

## Versioning

*n/a*

## Authors

![CF](http://i.imgur.com/7v5ASc8.png) [**Brai Frauen**](https://github.com/ashabrai), [**Jason Hiskey**](https://github.com/jlhiskey), [**Kristian Esvelt**](https://github.com/kris3579), [**Benjamin West**](https://github.com/bgwest)

## License

MIT
