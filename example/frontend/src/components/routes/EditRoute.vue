<template>
  <div>
    <router-link
      class="button"
      :to="model.getLink()"
    >
      <v-btn>Ansehen</v-btn>
    </router-link>

    <component
      :is="Form"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class EditRoute extends Vue {
  get config () {
    return this.$routeDefinition.config.route
  }

  get Form () {
    return this.config.edit.Form
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
