<template>
  <div>Autor FORM</div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class AuthorForm extends Vue {
  get author () {
    return this.model
  }
}
</script>
