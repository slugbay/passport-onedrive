/****************
 * IMPORTS
 */

var util = require('util')
var OAuth2Strategy = require('passport-oauth2')
var InternalOAuthError = require('passport-oauth2').InternalOAuthError
  
/**
 * `Strategy` constructor.
 *
 * The OneDrive authentication strategy authenticates requests by delegating to
 * OneDrive using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientId`      	your OneDrive application's client id
 *   - `clientSecret`  	your OneDrive application's client secret
 *   - `callbackURL`   	URL to which OneDrive will redirect the user after granting authorizationin your OneDrive Application
 *
 * Examples:
 *
 *     passport.use(new MicrosoftOneDriveStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/onedrive/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */

function MicrosoftOneDriveStrategy (options, verify) {
    options = options || {}
    options.authorizationURL = options.authorizationURL || 'https://login.live.com/oauth20_authorize.srf'
    options.tokenURL = options.tokenURL || 'https://login.live.com/oauth20_token.srf'
    options.scopeSeparator = options.scopeSeparator || ','
    options.customHeaders = options.customHeaders || {}

    OAuth2Strategy.call(this, options, verify)
    this.name = 'onedrive'
}

/**
 * Inherit from `OAuth2Strategy`.
 */

util.inherits(MicrosoftOneDriveStrategy, OAuth2Strategy)

/**
 * Retrieve user profile from One Drive.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `onedrive`
 *   - `id`
 *   - etc..
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */

MicrosoftOneDriveStrategy.prototype.userProfile = function (accessToken, done) {

    this._oauth2.get(
        'https://api.onedrive.com/v1.0/drive',
        accessToken,
        function (err, body, res) {
            if (err) {
                return done(new InternalOAuthError('failed to fetch user profile', err))
            }
            try {
                var json = JSON.parse(body)

                var profile = {
                    provider: 'onedrive'
                }
                profile.id = json.owner.user.id
                profile.displayName = json.owner.user.displayName
                profile.driveId = json.id
                profile.driveType = json.driveType
                profile.quota = json.quota
              
                profile._raw = body
                profile._json = json
              
                done(null, profile)
            }
            catch(e) {
                done(e)
            }
        }
    )
}

/**
 * Expose `Strategy`.
 */

module.exports = MicrosoftOneDriveStrategy
