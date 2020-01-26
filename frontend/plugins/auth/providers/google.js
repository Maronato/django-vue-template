const { assignDefaults } = require('@nuxtjs/auth/lib/providers/_utils')

module.exports = function google(strategy) {
  assignDefaults(strategy, {
    _scheme: '~/plugins/auth/scheme/social.js',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
    userinfo_endpoint: '/api/auth/user/',
    login_endpoint: '/api/auth/social/login/google/',
    connect_endpoint: '/api/auth/social/connect/google/',
    scope: ['openid', 'profile', 'email']
  })
}
