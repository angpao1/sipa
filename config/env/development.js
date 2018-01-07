module.exports = {
    debug: true,
    mongoUri: 'mongodb://localhost:27017/twitter_clone',
    sessionSecret: 'dev_secret_key',
    facebook: {
        clientID: '166162610821837',
        clientSecret: '7bc3f5eac6eeb9fb447568028cd7a4a4',
        callbackURL: 'http://localhost:3000/oauth/facebook/callback'
    }
};