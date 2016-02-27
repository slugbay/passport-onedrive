# Passport-onedrive ![Travis Status](https://travis-ci.org/slugbay/passport-onedrive.png)

[![NPM](https://nodei.co/npm/passport-onedrive.png?downloads=true)](https://nodei.co/npm/passport-onedrive/) [![NPM](https://nodei.co/npm-dl/passport-onedrive.png?months=5&height=2)](https://nodei.co/npm/passport-onedrive/)

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Microsoft OneDrive](https://onedrive.live.com) using the OAuth 2.0 API.

This module lets you authenticate using OneDrive, in your Node.js applications.  
By plugging into Passport, OneDrive
authentication can be easily and unobtrusively integrated into any application or
framework that supports [Connect](http://www.senchalabs.org/connect/)-style
middleware, including [Express](http://expressjs.com/).

## Install

    $ npm install passport-onedrive

## Usage

#### Configure Strategy

The one drive authentication strategy authenticates users using a microsoft account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

The consumer key and secret are obtained by [creating an application](https://dev.onedrive.com/app-registration.htm) at
Microsoft's [developer](https://dev.onedrive.com/index.htm) site.

```js
    passport.use(new OneDriveStrategy({
        clientID: ONEDRIVE_CLIENT_ID,
        clientSecret: ONEDRIVE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/onedrive/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ userId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'onedrive'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
    app.get('/auth/onedrive',
      passport.authenticate('onedrive'));

    app.get('/auth/onedrive/callback', 
      passport.authenticate('onedrive', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
```

## Examples

For a complete, working example, refer to the [login example](https://github.com/slugbay/passport-onedrive/tree/master/example/login).

## Credits

  - Made with ♥ by [SlugBay](https://www.slugbay.com) engineers
    
  [![Screenshot](http://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/332/858/datas/gallery.jpg)](https://www.slugbay.com)

## Thanks

  - [Jared Hanson](http://github.com/jaredhanson)

## License

  - [The MIT License](http://opensource.org/licenses/MIT)

