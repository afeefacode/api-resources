# api-resources-client

Client for a schema driven API. The server describes its resources, actions, fields,
filters and validators; this client loads that description at runtime and builds the
requests from it.

## Install

```sh
npm install @afeefa/api-resources-client
```

The package is ESM only and expects `axios` to be resolvable.

## Getting data

```js
import { apiResources } from '@afeefa/api-resources-client'

apiResources
  .registerApi('shop', '/api')
  .defaultApi('shop')

await apiResources.schemasLoaded()

const response = await apiResources
  .createRequest({ resourceType: 'Shop.ArticleResource', actionName: 'list' })
  .params({ page: 1 })
  .send()

response.data // Model or Model[], depending on the action
response.meta // whatever the action put beside the data
```

`response.data` is a field, not a method. `createRequest()` returns `null` if the
schema has no such resource or action.

## Sending data

```js
const response = await apiResources
  .createRequest({ resourceType: 'Shop.ArticleResource', actionName: 'save' })
  .data({ title: 'A new article' })
  .send()
```

Further builder methods: `fields()` selects which fields the response should carry,
`filters()` passes the filters an action declares, `addParam()`, `addField()` and
`addFilter()` add single entries.

## Errors

`send()` does not throw. On a failed request it resolves with an `ApiError` instead of
an `ApiResponse`, so code that reaches straight for `response.data` gets `undefined`
and fails somewhere else. The class is not exported; check for its `error` field:

```js
if (response.error) {
  response.message              // message of the server, or the axios message
  response.detail               // error_details of the server, if any
  response.error.response.status // the raw axios error is kept as well
  response.isCancel             // true if the request was cancelled
}
```

## Building requests by hand

`apiResources.getAction({ resourceType, actionName })` returns the action itself, with
its declared params, filters and fields. `action.createRequest()` is what
`apiResources.createRequest()` calls internally.
