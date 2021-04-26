import TagList from '@/components/routes/TagList'

import { Model } from './Model'

export class Author extends Model {
  static type = 'Example.AuthorType'

  toCard (listConfig) {
    return {
      type: 'Autor',

      meta: [
        `# ${this.id}`,
        `${this.count_articles} Artikel`
      ].join(' | '),

      title: this.name,

      contents: [
        TagList
      ]
    }
  }
}
