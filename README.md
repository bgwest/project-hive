# Project Hive
##### Protect the hive
[![Build Status](https://travis-ci.com/bgwest/16-18-Authorization.svg?branch=18-asset-management)](https://travis-ci.com/bgwest/16-18-Authorization)
## Overview

A raspberry pi running a restful API. Includes a database to manage user data including events and hashed access codes.

##### Also note: 
new npm scripts have been added including a bash script to easily manage the devDb: devDbOff, dbDevOn (see package.json)

##### working routes & methods:

routes and methods

## How To

#### Example testing with just jest:

```
npm run devDbOn
npm run justJest
npm run devDbOff
```

#### Example testing manually via cli:

```
npm run devDbOn
npm run start-server
````

## User Auth Account manual testing

[x] signup

```
```

## Tests Performed with Jest

###### testing app.js routes and responses.

##### user-router.test.js

* 1: words

##### blog-post-router.test.js

* 9: words

#### auth-router.js

* 13: test if 404 words

#### image-router.js

* POST - 200 - words

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
