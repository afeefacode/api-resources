import { Model } from './Model'

export class Author extends Model {
  static type = 'Example.AuthorType'

  getLink (action = 'detail') {
    return {
      name: `authors.${action}`,
      params: {
        authorId: this.id
      }
    }
  }

  getTitle () {
    return this.name
  }
}
