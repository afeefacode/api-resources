import AuthorCard from '@/components/models/author/AuthorCard'

import { Model } from './Model'

export class Author extends Model {
  static type = 'Example.AuthorType'

  $components = {
    listCard: AuthorCard
  }

  getRoute (action) {
    return {
      name: 'authors.' + action,
      params: {
        authorId: this.id
      }
    }
  }
}
