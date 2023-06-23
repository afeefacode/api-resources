import { Model } from '../../src'
import { Type } from '../../src/type/Type'

export const ArticleType = new Type('Article', {
  fields: {
    title: {
      type: 'Afeefa.StringAttribute'
    },
    category: {
      type: 'Afeefa.StringAttribute'
    },
    date: {
      type: 'Afeefa.DateAttribute'
    },
    author: {
      type: 'Afeefa.Relation',
      related_type: {
        type: 'Author'
      }
    },
    comments: {
      type: 'Afeefa.Relation',
      related_type: {
        type: 'Comment',
        list: true
      }
    }
  },
  update_fields: {
    title: {
      type: 'Afeefa.StringAttribute',
      default: 'untitled'
    },
    category: {
      type: 'Afeefa.StringAttribute'
    },
    date: {
      type: 'Afeefa.DateAttribute',
      default: '2023-06-16T17:16:26.751Z'
    },
    comments: {
      type: 'Afeefa.Relation',
      related_type: {
        type: 'Comment',
        list: true
      }
    }
  },
  create_fields: {
    title: {
      type: 'Afeefa.StringAttribute',
      default: 'untitled'
    },
    category: {
      type: 'Afeefa.StringAttribute'
    },
    date: {
      type: 'Afeefa.DateAttribute',
      default: '2023-06-16T17:16:26.751Z'
    },
    author: {
      type: 'Afeefa.Relation',
      related_type: {
        type: 'Author'
      }
    },
    comments: {
      type: 'Afeefa.Relation',
      related_type: {
        type: 'Comment',
        list: true
      }
    }
  }
})

export class Article extends Model {
  public static type = 'Article'
}

export const AuthorType = new Type('Author', {
  fields: {
    name: {
      type: 'Afeefa.StringAttribute'
    }
  }
})

export class Author extends Model {
  public static type = 'Author'
}

export const CommentType = new Type('Comment', {
  fields: {
    text: {
      type: 'Afeefa.StringAttribute'
    }
  }
})

export class Comment extends Model {
  public static type = 'Comment'
}
