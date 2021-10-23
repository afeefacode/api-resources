import { apiResources } from '@afeefa/api-resources-client'

export function breadcrumbs ({BREADCRUMB, BREADCRUMBSET}) {
  return [
    BREADCRUMBSET({
      name: 'authors',
      titles: {
        list: 'Autoren',
        detail: 'Autor'
      },
      getTitle: getBreadcrumbTitleFunction('Author', 'authorId', 'get_author', {first_name: true, last_name: true})
    }),

    BREADCRUMBSET({
      name: 'articles',
      titles: {
        list: 'Artikel',
        detail: 'Artikel'
      },
      getTitle: getBreadcrumbTitleFunction('Article', 'articleId', 'get_article', {title: true}),

      children: [
        BREADCRUMBSET({
          name: 'comments',
          titles: {
            list: 'Comments',
            detail: 'Comment'
          },
          getTitle: getBreadcrumbTitleFunction('Comment', 'commentId', {title: true})
        })
      ]
    })
  ]
}

function getBreadcrumbTitleFunction (resourceType, idKey, action, fields) {
  return async routeParams => {
    const result = await apiResources.createRequest({resource: `Example.${resourceType}Resource`, action})
      .params({id: routeParams[idKey]})
      .fields(fields)
      .send()
    // await sleep(1)
    return result.data && result.data.getTitle()
  }
}
