#!/bin/bash

[[ $1 == "signup" ]] &&
echo '{"username":"jhiskey","password":"test","email":"jason@gmail.com","accesscode":"5000"}' | http 172.16.5.234:3000/user/signup &&
exit 0

[[ $1 == "more-signups" ]] &&
echo '{"username":"bwest","password":"testing","email":"ben@gmail.com","accesscode":"6000"}' | http 172.16.5.234:3000/user/signup && sleep 1 &&
echo '{"username":"bfrauen","password":"moretesting","email":"brai@gmail.com","accesscode":"7000"}' | http 172.16.5.234:3000/user/signup && sleep 1 &&
echo '{"username":"kesvelt","password":"evenmoretesting","email":"kris@gmail.com","accesscode":"8000"}' | http 172.16.5.234:3000/user/signup && sleep 1 &&
echo '{"username":"vsanchez","password":"password","email":"vinicio@gmail.com","accesscode":"9000"}' | http 172.16.5.234:3000/user/signup && sleep 1 &&
exit 0

[[ $1 == "arm" ]] &&
http 172.16.5.234:3000/arm/5000 &&
exit 0

[[ $1 == "disarm" ]] &&
http 172.16.5.234:3000/disarm/5000 &&
exit 0
