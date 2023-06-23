import { Model, apiResources } from '../src'
import { Article, ArticleType, Author, AuthorType, Comment, CommentType } from './fixtures/types'

beforeAll(() => {
  apiResources.registerType('Author', AuthorType)
  apiResources.registerType('Article', ArticleType)
  apiResources.registerType('Comment', CommentType)

  apiResources.registerModels([Article, Author])
})

describe('model constructor', () => {
  test('default', () => {
    const model = new Model()
    expect(model.type).toBe('Model')
    expect(model.name).toBeUndefined()

    expect(Object.getOwnPropertyNames(model)).toEqual([
      'id', 'type', '_ID', '_original', 'class'
    ])
  })

  test('given type', () => {
    const model = new Model('Model2')
    expect(model.type).toBe('Model2')
    expect(model.name).toBeUndefined()
  })

  test('given data', () => {
    const model = new Model({name: 'MyModel'})
    expect(model.type).toBe('Model')
    expect(model.name).toBe('MyModel')
  })

  test('given type and data', () => {
    const model = new Model('Model2', {name: 'MyModel2'})
    expect(model.type).toBe('Model2')
    expect(model.name).toBe('MyModel2')
  })
})

describe('custom model constructor', () => {
  test('default', () => {
    const model = new Article()
    expect(model.type).toBe('Article')
    expect(model.category).toBeUndefined()
  })

  test('given type', () => {
    const model = new Article('Article2')
    expect(model.type).toBe('Article2')
    expect(model.category).toBeUndefined()
  })

  test('given data', () => {
    const model = new Article({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })
    expect(model.type).toBe('Article')

    expect(model.title).toEqual('My cool Article')
    expect(model.author).toBeInstanceOf(Author)
    expect(model.test).toEqual('something')
  })

  test('given type and data', () => {
    const model = new Article('Article2', {
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })
    expect(model.type).toBe('Article2')

    expect(model.title).toEqual('My cool Article')
    expect(model.author).toBeInstanceOf(Author)
    expect(model.test).toEqual('something')
  })
})

describe('from json', () => {
  test('from json', () => {
    const model = Article.fromJson({
      type: 'Article',
      title: 'My cool Article',
      author: {
        type: 'Author',
        name: 'The Best'
      },
      test: 'something' // runtime property
    })

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date', 'author', 'comments'])

    expect(model).toBeInstanceOf(Article)

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      category: null,
      date: null,
      author: new Author({
        name: 'The Best'
      }),
      comments: []
    })

    expect(model.test).toBeUndefined()
  })

  test('from json base class', () => {
    const model = Model.fromJson({ type: 'Article' })
    expect(model).toBeInstanceOf(Article)
  })
})

describe('defaults', () => {
  class Article extends Model {
    public static type = 'Article'
  }

  test('create and fill all defaults', () => {
    let model = new Article()

    expect(Object.keys(model)).toEqual(['id', 'type'])

    model = Article.defaults()

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date', 'author', 'comments'])

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'untitled',
      category: null,
      date: new Date('2023-06-16T17:16:26.751Z'),
      author: null,
      comments: []
    })
  })

  test('create, fill defaults and fill data', () => {
    const model = Article.defaults({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date', 'author', 'comments', 'test'])

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      category: null,
      date: new Date('2023-06-16T17:16:26.751Z'),
      author: {
        type: 'Author',
        id: null
      },
      comments: [],
      test: 'something'
    })
  })

  test('create, fill defaults and fill data2', () => {
    const model = Article.defaults().fill({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date', 'author', 'comments', 'test'])

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      category: null,
      date: new Date('2023-06-16T17:16:26.751Z'),
      author: {
        type: 'Author',
        id: null
      },
      comments: [],
      test: 'something'
    })
  })
})

describe('withOnly', () => {
  test('given data', () => {
    const model = new Article({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      author: {
        type: 'Author',
        id: null
      },
      test: 'something'
    })

    const model2 = model.withOnly({test: true})

    expect(model2).toEqual({
      id: null,
      type: 'Article',
      test: 'something'
    })

    expect(Object.getOwnPropertyNames(model2)).toEqual([
      'id', 'type', '_ID', '_original', 'class', 'test'
    ])
  })
})

describe('without', () => {
  test('given data', () => {
    const model = new Article({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      author: {
        type: 'Author',
        id: null
      },
      test: 'something'
    })

    const model2 = model.withOnly({test: true})

    expect(model2).toEqual({
      id: null,
      type: 'Article',
      test: 'something'
    })

    expect(Object.getOwnPropertyNames(model2)).toEqual([
      'id', 'type', '_ID', '_original', 'class', 'test'
    ])
  })
})

describe('fill', () => {
  test('fill', () => {
    const model = new Article()

    expect(Object.keys(model)).toEqual(['id', 'type'])

    model.fill({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'author', 'test'])

    expect(model).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      author: {
        type: 'Author',
        id: null
      },
      test: 'something'
    })
  })
})

describe('serialize', () => {
  test('serializes all defaults', () => {
    const model = Article.defaults()

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date', 'author', 'comments'])

    expect(model.serialize()).toEqual({
      type: 'Article',
      title: 'untitled',
      category: null,
      date: new Date('2023-06-16T17:16:26.751Z'),
      author: null,
      comments: []
    })
  })

  test('serializes all defaults without', () => {
    const model = Article.defaults().without({
      author: true,
      comments: true
    })

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date'])

    expect(model.serialize()).toEqual({
      type: 'Article',
      title: 'untitled',
      category: null,
      date: new Date('2023-06-16T17:16:26.751Z')
    })
  })

  test('serializes all defaults except2', () => {
    const model = Article.defaults().withOnly({
      title: true,
      category: true,
      date: true
    })

    expect(Object.keys(model)).toEqual(['id', 'type', 'title', 'category', 'date'])

    expect(model.serialize()).toEqual({
      type: 'Article',
      title: 'untitled',
      category: null,
      date: new Date('2023-06-16T17:16:26.751Z')
    })
  })

  test('ignores unset fields', () => {
    const model = new Article({
      title: 'Some nice heading',
      category: undefined
    })

    expect(Object.keys(model.serialize())).toEqual(['type', 'title'])

    expect(model.serialize()).toEqual({
      type: 'Article',
      title: 'Some nice heading'
    })
  })

  test('ignores unconfigured fields', () => {
    const model = new Article({
      test: 'test'
    })

    expect(Object.keys(model.serialize())).toEqual(['type'])

    expect(model.serialize()).toEqual({
      type: 'Article'
    })
  })

  test('respect fields to serialize', () => {
    const model = new Article({
      title: 'Some nice heading'
    })

    expect(model.serialize({})).toEqual({
      type: 'Article'
    })
  })

  test('respect fields to serialize2', () => {
    const model = new Article({
      title: 'Some nice heading',
      category: 'This is the cat'
    })

    expect(model.serialize({ category: true })).toEqual({
      type: 'Article',
      category: 'This is the cat'
    })
  })
})

describe('clone', () => {
  test('clone all values', () => {
    const model = new Article({
      title: 'My cool Article',
      author: new Author(),
      test: 'something' // runtime property
    })

    const clone = model.clone()

    expect(Object.keys(clone)).toEqual(['id', 'type', 'title', 'author', 'test'])

    expect(clone).toEqual({
      type: 'Article',
      id: null,
      title: 'My cool Article',
      author: {
        type: 'Author',
        id: null
      },
      test: 'something'
    })

    expect(Object.getOwnPropertyNames(clone)).toEqual([
      'id', 'type', '_ID', '_original', 'class', 'title', 'author', 'test'
    ])

    expect(model.class).toEqual(clone.class)
    expect(clone._original).toEqual(model)
    expect(clone._ID).toEqual(model._ID + 1)
  })

  test('clones related one too', () => {
    const model = new Article({
      author: new Author()
    })

    // copy related

    const clone: Article = model.clone()
    const author = clone.author as Model
    expect(author._original).toBeNull()
    expect(author._ID).toEqual(model._ID - 1)

    author.name = 'My Name is Rabbit'
    expect((model.author as Model).name).toEqual('My Name is Rabbit')

    // clone related

    const clone2 = model.clone({ author: true })
    const author2 = clone2.author as Model
    expect(author2._original).toEqual(model.author)

    author2.name = 'My Name is another Rabbit'
    expect((model.author as Model).name).toEqual('My Name is Rabbit') // not changed

    expect(clone2._ID).toEqual(model._ID + 2)
    expect(author2._ID).toEqual(model._ID + 3)

    // copy related

    const clone3 = model.clone()
    const author3 = clone3.author as Model
    expect(author3._original).toBeNull()

    author3.name = 'My Name is yet another Rabbit'
    expect((model.author as Model).name).toEqual('My Name is yet another Rabbit')
    expect(author.name).toEqual('My Name is yet another Rabbit')
    expect(author2.name).toEqual('My Name is another Rabbit')

    expect(clone3._ID).toEqual(model._ID + 4)
    expect(author3._ID).toEqual(model._ID - 1)
  })

  test('clones related many too', () => {
    const getComment = (owner: Model, index: number): Model => {
      return (owner.comments as Model[])[index] as Model
    }

    const model = new Article({
      comments: [new Comment({text: 'C1'}), new Comment({text: 'C2'})]
    })

    // copy related

    const clone: Article = model.clone()
    const comment1 = getComment(clone, 0)
    const comment2 = getComment(clone, 1)
    expect(comment1._original).toBeNull()
    expect(comment2._original).toBeNull()

    comment1.text = 'Comment 1 Text'
    comment2.text = 'Comment 2 Text'
    expect(getComment(model, 0).text).toEqual('Comment 1 Text')
    expect(getComment(model, 1).text).toEqual('Comment 2 Text')

    // clone related

    const clone2 = model.clone({ comments: true })
    const comment1_2 = getComment(clone2, 0)
    const comment2_2 = getComment(clone2, 1)
    expect(comment1_2._original).toEqual(getComment(model, 0))
    expect(comment2_2._original).toEqual(getComment(model, 1))

    comment1_2.text = 'Comment 1 updated Text'
    comment2_2.text = 'Comment 2 updated Text'
    expect(getComment(model, 0).text).toEqual('Comment 1 Text') // not changed
    expect(getComment(model, 1).text).toEqual('Comment 2 Text')

    // copy related

    const clone3: Article = model.clone()
    const comment1_3 = getComment(clone3, 0)
    const comment2_3 = getComment(clone3, 1)
    expect(comment1_3._original).toBeNull()
    expect(comment2_3._original).toBeNull()

    comment1_3.text = 'Comment 1 again updated Text'
    comment2_3.text = 'Comment 2 again updated Text'
    expect(getComment(model, 0).text).toEqual('Comment 1 again updated Text')
    expect(getComment(model, 1).text).toEqual('Comment 2 again updated Text')
    expect(comment1.text).toEqual('Comment 1 again updated Text')
    expect(comment2.text).toEqual('Comment 2 again updated Text')
    expect(comment1_2.text).toEqual('Comment 1 updated Text')
    expect(comment2_2.text).toEqual('Comment 2 updated Text')
  })
})
