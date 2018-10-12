![hivelogo](./src/lib/assets/project-images/project-hive-og-logo-large-cleaner-solo.png)

## Overview

### Current version

Beta v1.0

### Description
- A home security system on a Raspberry Pi running a restful API
- Armed, arming, disarmed, alarm, and motion detection states are currently represented by four LED's
    - Green LED: armed state
    - Red LED: disarmed state
    - Yellow LED: alarm state
    - Blue LED: currently arming or warning states
- Motion sensor triggers a warning state, which will change to an alarm state after 30 seconds
- Takes picture of intruder 5 seconds after the alarm is triggered
- Outputs wav file depending on state change
- You may send commands to the pi from a locally connected computer
- Pi communicates with a Heroku database to store user information and pictures taken

### Security
- When armed, if the motion sensor detects any movement, the warning state will activate for 30 seconds
- If a valid disarm request is not sent during those 30 seconds, the alarm state will activate
- 5 seconds after the alarm state activates, the camera will snap a picture

### Pi components
![hivelogo](./src/lib/assets/project-images/pi-diagram.png)
- Raspberry Pi 3
- Breadboard
- PIR (motion sensor)
- Pi/Arduino camera
- 4 different colored LED's
- Dupont wires

## How To

### Setup

#### Following steps must be done on the pi

- Ensure node is installed on pi
- Git clone this repo
- npm install
- Run 'node src/app.js' to turn on the server

## Usage

![houselogo](./src/lib/assets/project-images/project-hive-og-house-large-solo.png)

##### Send requests from any locally connected computer

- To create an account, send a POST request to the user route with a username, password, email, and access code
- To arm the system, send a GET request to the arm route with a valid access code
    - If the access code is valid the arming state will turn on for 30 seconds, after which it will enter the armed state and turn on the motion sensor
- To disarm the system, send a GET request to the disarm route with a valid access code
    - If the access code is valid all other states will be disabled, the motion sensor will turn off, and the disarmed state will activate

### Example requests

#### Example signup

Entered into command line:
```
echo '{"username":"kris3579","password":"password","email":"kristianesvelt@hotmail.com","accesscode":"3579"}' | http http://172.16.5.234:3000/user/signup
```
Result:
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 479
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Oct 2018 19:11:07 GMT
ETag: W/"1df-JOrcMNYu+m0VeiuhQPtoPcbAeM8"
X-Powered-By: Express

{
    "token": "long token string"
}
```

#### Example of arming system with a valid access code

Entered into command line:
```
http http://172.16.5.234:3000/arm/3579
```
Result:
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 57
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Oct 2018 19:15:49 GMT
ETag: W/"39-Xk+/H75ASfjKS3J94l5hQy3q9UA"
X-Powered-By: Express

{
    "accesscode": "3579",
    "isValid": true,
    "message": "verified"
}
```

#### Example of disarming system with valid access code

Entered into command line:
```
http http://172.16.5.234:3000/disarm/3579
```
Result:
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 57
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Oct 2018 19:24:34 GMT
ETag: W/"39-Xk+/H75ASfjKS3J94l5hQy3q9UA"
X-Powered-By: Express

{
    "accesscode": "3579",
    "isValid": true,
    "message": "verified"
}
```

## Testing

### Testing Framework: jest

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

* 3: testing VALID accesscode on disarm route - should return isValid = true

* 4: testing INVALID accesscode on disarm route - should return isValid = false

## Built With

** Please see package.json to confirm dependency details

## Contributing

Please feel free to contribute. Master branch auto merge locked for approval for non-contributors.

## Planned Enhancements 

In upcoming releases we plan to:

* Repeat alarm sound until the system is disarmed
* Integrate either photo burst or video instead of single picture on villain detection
* Faster reaction time from after villain is detected, to triggering pi camera
* Utilize database to log villain events and also log each time the system is armed / disarmed 
* Trigger a text message / email to be sent if villain is detected while system is armed with link to video / photos
* Front end to utilize account tokens for Web UI to access pictures and system event data
* Allow user creation from Web UI
* View villain cam live on Web UI
* Configure PI traffic to be forwarded back and forth between cloud instance for completely remote access outside your home


## Authors

![CF](http://i.imgur.com/7v5ASc8.png) [**Brai Frauen**](https://github.com/ashabrai), [**Jason Hiskey**](https://github.com/jlhiskey), [**Kristian Esvelt**](https://github.com/kris3579), [**Benjamin West**](https://github.com/bgwest)

## License

MIT
