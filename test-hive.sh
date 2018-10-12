#!/bin/bash

[[ $1 == "signup" ]] &&
echo '{"username":"jhiskey","password":"test","email":"jason@gmail.com","accesscode":"5000"}' | http 172.16.5.234:3000/user/signup &&
exit 0

[[ $1 == "arm" ]] &&
http 172.16.5.234:3000/arm/5000 &&
exit 0

[[ $1 == "disarm" ]] &&
http 172.16.5.234:3000/disarm/5000 &&
exit 0


