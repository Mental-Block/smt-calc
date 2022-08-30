# Run Client / Frontend

## Install

To install the dependencies

```
$ npm i
```

To run the application

```
$ npm run dev
```

OR

```
$ npm run start
```

## Server isn't Running

You will be greeted with a "app loading..." spiner if the server/backend isn't running.

To bypass this go into `src/context/AuthContext` and configure the auth state. Specifically the authData.ok for different views user login views.

## Server is Running

If the server is running you can use the following testing account.

- ### username - admin
- ### password - Password123!

## const file for API

In order to get the app running with the api's locally you may have to switch from the production api to development I should be using `.env` file but couldn't get it to work.

## TODO

- fix jwt token time expiration using the native jwt time expiration not the current variable be used
