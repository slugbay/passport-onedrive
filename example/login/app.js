var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , MicrosoftOneDriveStrategy = require('passport-onedrive').Strategy;

var ONEDRIVE_CLIENT_ID = "---your--onedrive--client--id---"
var ONEDRIVE_CLIENT_SECRET = "---your--onedrive--client--secret--";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete OneDrive profile is
//   serialized and deserialized.
passport.serializeUser( function (user, done) {
	done(null, user);
});

passport.deserializeUser( function (obj, done) {
	done(null, obj);
});


// Use the MicrosoftOneDriveStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and 37signals
//   profile), and invoke a callback with a user object.
passport.use(new MicrosoftOneDriveStrategy({
    clientID: ONEDRIVE_CLIENT_ID,
    clientSecret: ONEDRIVE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/onedrive/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's OneDrive profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the OneDrive account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function (req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function (req, res){
  res.render('login', { user: req.user });
});

// GET /auth/onedrive
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in OneDrive authentication will involve
//   redirecting the user to login.live.com. After authorization, OneDrive
//   will redirect the user back to this application at /auth/onedrive/callback
app.get('/auth/onedrive',
  passport.authenticate('onedrive'),
  function (req, res){
    // The request will be redirected to OneDrive for authentication, so this
    // function will not be called.
  });

// GET /auth/onedrive/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/onedrive/callback', 
  passport.authenticate('onedrive', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
