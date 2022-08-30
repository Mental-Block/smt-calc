# Server / Backend

## Install

To install the dependencies

```
$ npm i
```

To run the application

```
$ npm start
```

OR 

```
$ npm run dev
```

## ENVS

In the `.env.example` file you will see all the enviroment variables needed to run the application.

## Deploying to NETLIFY & HEROKU

### NETLIFY

Just push git, add, commit and push changes as normal. Login into netlify and change the current production version. 

### Heroku

- Generate, Run all migrations 

- insert all moduleAliases or node will be unable to find them. Base typescript was having issues compiling with module alias. copy code into package.json before deploying. When I have time all come up with a better solution. 

```
 "_moduleAliases": {
      "@entities": "./dist/src/entities",
      "@interfaces" : "./dist/src/interfaces",
      "@middleware" : "./dist/src/middleware",
      "@routers"  : "./dist/src/routers",
      "@util": "./dist/src/util",
      "@const": "./dist/src/const"
    },
```

- Run herokudeploy.sh bash script 
