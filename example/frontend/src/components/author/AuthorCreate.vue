<template>
  <create-page v-bind="$attrs">
    <template #fields>
      <form-field-text
        name="name"
        label="Name"
      />
    </template>
  </create-page>
</template>


<script>
import { Author } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthorCreate extends Vue {
  static get createRouteConfig () {
    return {
      ModelClass: Author,

      createAction: Author.getAction('save_author'),

      fields: {
        name: true
      }
    }
  }
}
</script>
