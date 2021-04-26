import TagList from '@/components/routes/TagList'

import { Model } from './Model'

export class Article extends Model {
  static type = 'Example.ArticleType'

  toCard () {
    return {
      type: 'Artikel',

      meta: [
        `# ${this.id}`,
        `von ${this.author.name}`,
        `am ${this.formattedDate}`,
        `${this.count_comments} Kommentare`
      ].join(' | '),

      title: this.title,

      contents: [
        {
          component: TagList,
          events: listConfig => ({
            clickTag (tag) {
              listConfig.filters.tag_id.value = tag.id
            }
          })
        },

        TagList
      ]
    }
  }

  get formattedDate () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return this.date.toLocaleDateString('de-DE', options)
  }
}
