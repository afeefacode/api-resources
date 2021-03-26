import { IS_DEVELOPMENT, KOLLEKTIV_APP_HOST } from './env'

import axios from 'axios'
import jwtDecode from 'jwt-decode'

const DEV_SESSION_STORAGE_KEY = 'dev_session'

class AuthService {
  router = null
  appName = null
  account = null
  jwt = null
  refresh_token = null
  initialized = false
  refreshTokenPromise = null

  async initApp (router) {
    this.router = router

    // pass and examine auth headers with each request
    axios.interceptors.request.use(config => {
      if (this.jwt) {
        config.headers.Authorization = `Bearer ${this.jwt}`
      }
      return config
    })

    axios.interceptors.response.use(
      r => r,

      async error => {
        const response = error.response || error
        if (response && response.status === 401) {
          if (this.jwt) {
            console.log('[Auth] Try to refresh access token.')
            await this.refreshAccessToken()
            return axios.request(response.config)
          } else {
            console.log('[Auth] 401 returned.')
            window.stop() // cancel all requests
            this.logout()
          }
        }
        return Promise.reject(response)
      }
    )

    // test if next route requires authentication
    this.router.beforeEach(async (to, _from, next) => {
      // any protected route
      if (to.matched.some(route => route.meta.requiresAuth)) {
        this.logInit(`[Auth] Route '${to.path}' needs authentication. Account is:`, this.account)
        if (this.account) {
          // authenticated
          this.logInit('[Auth] Account found. Forward to route.')
          next()
        } else {
          // try to recover dev session from local storage
          if (IS_DEVELOPMENT) {
            this.logInit('[Auth] Not authenticated. Try to recover dev session from local storage.')
            try {
              await this.tryRecoverDevSession()
              this.initialized = true
              next()
              return
            } catch (_e) {
              this.logInit('[Auth] Dev session not found in storage.')
            }
          }
          // not authenticated -> forward to login
          this.logInit('[Auth] Not authenticated. Forward to login.')
          window.location.href = `https://${KOLLEKTIV_APP_HOST}/auth/login?redirect_app=${this.appName}&redirect_url=${this.getRedirectUrl(to)}`
        }

      // route is public
      } else {
        // this is our auth_code consuming endpoint
        if (to.name === 'auth') {
          this.logInit('[Auth] Auth code received. Try to exchange with access token.')
          this.getAccessToken(to.query).then(result => {
            if (result === false) {
              return
            }
            this.initialized = true
            const path = to.query.redirect_url || ''
            next(path)
          })
        } else {
          next()
        }
      }
    })
  }

  async getAccessToken (query) {
    const authCode = query.auth_code
    if (authCode) {
      const url = `https://${KOLLEKTIV_APP_HOST}/api/auth/exchange`
      try {
        const response = await axios.post(url, { auth_code: authCode })

        this.logInit('[Auth] Access token received.')

        const data = response.data
        const jwt = jwtDecode(data.jwt)

        if (!jwt.account.is_admin) {
          this.logInit('[Auth] No Admin. Forward to frontend.')
          window.location.href = `https://${KOLLEKTIV_APP_HOST}`
          return Promise.resolve(false)
        }

        return this.login(jwt.account, data.jwt, data.refresh_token)
      } catch (error) {
        this.logInit('[Auth] Cound not retrieve access token.', error)
        this.logout()
      }
    }
  }

  saveAccount (account, jwt, refresh_token) {
    this.account = account
    this.jwt = jwt
    this.refresh_token = refresh_token

    if (IS_DEVELOPMENT) {
      localStorage.setItem(DEV_SESSION_STORAGE_KEY, JSON.stringify({
        account,
        jwt,
        refresh_token
      }))
    }
  }

  async tryRecoverDevSession () {
    const devSessionJson = localStorage.getItem(DEV_SESSION_STORAGE_KEY)
    this.logInit('[Auth] Dev session found in storage :-)')
    if (devSessionJson) {
      const devSession = JSON.parse(devSessionJson)
      return this.login(devSession.account, devSession.jwt, devSession.refresh_token)
    }
    throw new Error()
  }

  async refreshAccessToken () {
    const url = `https://${KOLLEKTIV_APP_HOST}/api/auth/refresh`

    if (!this.refreshTokenPromise) {
      this.refreshTokenPromise = axios.post(url, {
        jwt: this.jwt,
        refresh_token: this.refresh_token
      })
    }

    return this.refreshTokenPromise.then(response => {
      console.log('[Auth] Access token received.')

      const data = response.data
      const jwt = jwtDecode(data.jwt)

      this.refreshTokenPromise = null

      return this.login(jwt.account, data.jwt, data.refresh_token)
    }).catch(error => {
      console.log('[Auth] Cound not retrieve access token.', error)
      this.logout()
      this.refreshTokenPromise = null
    })
  }

  login (account, jwt, refresh_token) {
    this.logInit('[Auth] Login successful', account)
    this.saveAccount(account, jwt, refresh_token)
  }

  forwardToLoginPage () {
    this.logInit('[Auth] Not authenticated. Forward to login page.')
    const redirectUrl = this.getRedirectUrl(this.router.currentRoute)
    window.location.href = `https://${KOLLEKTIV_APP_HOST}/auth/login?redirect_app=${this.appName}&redirect_url=${redirectUrl}`
  }

  forwardToLogoutEndpoint () {
    console.log('[Auth] Logout. Good bye!')
    if (IS_DEVELOPMENT) {
      localStorage.removeItem(DEV_SESSION_STORAGE_KEY)
    }
    const redirectUrl = this.getRedirectUrl(this.router.currentRoute)
    window.location.href = `https://${KOLLEKTIV_APP_HOST}/auth/logout?redirect_app=${this.appName}&redirect_url=${redirectUrl}`
  }

  logout () {
    console.log('[Auth] Logout. Good bye!')
    if (IS_DEVELOPMENT) {
      localStorage.removeItem(DEV_SESSION_STORAGE_KEY)
    }
    const redirectUrl = this.getRedirectUrl(this.router.currentRoute)
    window.location.href = `https://${KOLLEKTIV_APP_HOST}/auth/logout?redirect_app=${this.appName}&redirect_url=${redirectUrl}`
  }

  getAccount () {
    return this.account
  }

  getRedirectUrl (route) {
    let query = Object.keys(route.query)
      .filter(key => route.query[key])
      .map(key => key + '=' + route.query[key]).join('&') || ''
    if (query) {
      query = '?' + query
    }
    return route.path + encodeURIComponent(query)
  }

  logInit (...msg) {
    if (this.initialized) {
      return
    }

    console.log(...msg)
  }
}

export const authService = new AuthService()
