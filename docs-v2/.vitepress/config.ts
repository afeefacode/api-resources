import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'API Resources v2',
  description: 'Entwicklerdokumentation für api-resources v2',
  lang: 'de-DE',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Referenz', link: '/reference/klassen' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Einführung',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Konzept & Architektur', link: '/guide/konzept' }
          ]
        },
        {
          text: 'Fields',
          items: [
            { text: 'Attribute', link: '/guide/attribute' },
            { text: 'Relationen', link: '/guide/relationen' }
          ]
        },
        {
          text: 'Erweitert',
          items: [
            { text: 'Resolver', link: '/guide/resolver' },
            { text: 'Api-Level Konfiguration', link: '/guide/api-konfiguration' },
            { text: 'Migration v1 → v2', link: '/guide/migration' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'API-Referenz',
          items: [
            { text: 'Klassen-Übersicht', link: '/reference/klassen' },
            { text: 'DI Container', link: '/reference/container' }
          ]
        }
      ]
    },

    outline: {
      level: [2, 3],
      label: 'Auf dieser Seite'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/afeefacode/api-resources/edit/main/docs-v2/:path',
      text: 'Diese Seite bearbeiten'
    }
  }
})
