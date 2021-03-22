import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Shelby - %s',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/auth',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['nuxt-i18n',
      {
        lazy: true,
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n-redirected',
          alwaysRedirect: true,
          fallbackLocale: 'en'
        },
        locales: [
          {
            name: 'Português',
            code: 'pt',
            iso: 'pt-BR',
            file: 'pt-BR.js'
          },
          {
            name: 'English',
            code: 'en',
            iso: 'en-US',
            file: 'en-US.js'
          }
        ],
        langDir: 'i18n/',
        defaultLocale: 'pt',
        strategy: 'no_prefix',
        parsePages: false
      }
    ]

  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://factory.gocase.com.br'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.grey.lighten2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  /*
  /*
  ** Auth module configuration
  ** See https://auth.nuxtjs.org/guide/setup.html
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'api/v1/users/login',
            method: 'post',
            propertyName: 'generate_jwt'
          },
          user: {
            url: 'api/v1/printing_room/users/info',
            method: 'get',
            propertyName: false
          },
          logout: false
        }
      }
    }
  },
  router: {
    middleware: ['auth']
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
