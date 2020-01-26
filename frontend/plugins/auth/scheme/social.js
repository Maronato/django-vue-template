import nanoid from 'nanoid'

const isHttps = process.server ? require('is-https') : null

export const parseQuery = (queryString) => {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export const encodeQuery = (queryObject) => {
  return Object.entries(queryObject)
    .filter(([key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'code',
  tokenName: 'Authorization'
}

export default class SocialScheme {
  constructor(auth, options) {
    this.$auth = auth
    this.req = auth.ctx.req
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)

    // Monkeypatch connect method
    auth.connect = function(name, ...args) {
      return auth.setStrategy(name).then(() => {
        if (!auth.strategy.connect) {
          return Promise.resolve()
        }
        return auth.wrapLogin(auth.strategy.connect(...args)).catch((error) => {
          this.callOnError(error, { method: 'connect' })
          return Promise.reject(error)
        })
      })
    }
    auth.disconnect = function(account, ...args) {
      if (!auth.strategy.disconnect) {
        return Promise.resolve()
      }
      const { id } = account
      return auth
        .request(`/api/auth/social/disconnect/${id}/`)
        .catch((error) => {
          this.callOnError(error, { method: 'disconnect' })
          return Promise.reject(error)
        })
    }
  }

  get _scope() {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI() {
    const url = this.options.redirect_uri

    if (url) {
      return url
    }

    if (process.server && this.req) {
      const protocol = 'http' + (isHttps(this.req) ? 's' : '') + '://'

      return (
        protocol + this.req.headers.host + this.$auth.options.redirect.callback
      )
    }

    if (process.client) {
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  async mounted() {
    // Sync token
    const token = this.$auth.syncToken(this.name)
    // Set axios token
    if (token) {
      this._setToken(token)
    }

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  _setToken(token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
  }

  _clearToken() {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
  }

  logout() {
    this._clearToken()
    return this.$auth.reset()
  }

  prepareProviderUrl({ params, state, nonce } = {}) {
    const opts = {
      protocol: 'oauth2',
      response_type: this.options.response_type,
      access_type: this.options.access_type,
      client_id: this.options.client_id,
      redirect_uri: this._redirectURI,
      scope: this._scope,
      // Note: The primary reason for using the state parameter is to mitigate CSRF attacks.
      // https://auth0.com/docs/protocols/oauth2/oauth-state
      state: state || nanoid(),
      ...params
    }

    if (this.options.audience) {
      opts.audience = this.options.audience
    }

    // Set Nonce Value if response_type contains id_token to mitigate Replay Attacks
    // More Info: https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
    // More Info: https://tools.ietf.org/html/draft-ietf-oauth-v2-threatmodel-06#section-4.6.2
    if (opts.response_type.includes('id_token')) {
      // nanoid auto-generates an URL Friendly, unique Cryptographic string
      // Recommended by Auth0 on https://auth0.com/docs/api-auth/tutorials/nonce
      opts.nonce = nonce || nanoid()
    }

    this.$auth.$storage.setUniversal(this.name + '.state', opts.state)

    return this.options.authorization_endpoint + '?' + encodeQuery(opts)
  }

  login({ params, state, nonce } = {}) {
    this.$auth.$storage.setUniversal(this.name + '.method', 'login')

    window.location = this.prepareProviderUrl({ params, state, nonce })
  }

  connect({ params, state, nonce } = {}) {
    this.$auth.$storage.setUniversal(this.name + '.method', 'connect')

    window.location = this.prepareProviderUrl({ params, state, nonce })
  }

  async fetchUser() {
    if (!this.$auth.getToken(this.name)) {
      return
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser({})
      return
    }

    const user = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint
    })

    this.$auth.setUser(user)
  }

  async _handleCallback(uri) {
    // Handle callback only for specified route
    if (
      this.$auth.options.redirect &&
      this.$auth.ctx.route.path !== this.$auth.options.redirect.callback
    ) {
      return
    }

    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1))
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)
    // accessToken/idToken
    const tokenKey = this.options.token_key || 'access_token'
    let token = parsedQuery[tokenKey]
    // refresh token
    const refreshTokenKey = this.options.refresh_token_key || 'refresh_token'
    let refreshToken = parsedQuery[refreshTokenKey]

    // Validate state
    const state = this.$auth.$storage.getUniversal(this.name + '.state')
    this.$auth.$storage.setUniversal(this.name + '.state', null)
    if (state && parsedQuery.state !== state) {
      return
    }

    // eslint-disable-next-line no-debugger
    debugger

    const method = this.$auth.$storage.getUniversal(this.name + '.method')

    // -- Authorization Code Grant --
    if (this.options.response_type === 'code' && parsedQuery.code) {
      const url =
        method === 'login'
          ? this.options.login_endpoint
          : this.options.connect_endpoint
      const data = await this.$auth.request({
        url,
        method: 'post',
        data: encodeQuery({
          code: parsedQuery.code
        })
      })

      if (data[tokenKey]) {
        token = data[tokenKey]
      }

      if (data[refreshTokenKey]) {
        refreshToken = data[refreshTokenKey]
      }
    }

    if (!token || !token.length) {
      return
    }

    // Append token_type
    if (this.options.token_type) {
      token = this.options.token_type + ' ' + token
    }

    // Store token
    this.$auth.setToken(this.name, token)

    // Set axios token
    this._setToken(token)

    // Store refresh token
    if (refreshToken && refreshToken.length) {
      refreshToken = this.options.token_type + ' ' + refreshToken
      this.$auth.setRefreshToken(this.name, refreshToken)
    }

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
