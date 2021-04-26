<template>
  <div
    class="tagList"
  >
    <a
      v-for="tag in model.tags"
      :key="tag.id"
      href=""
      @click.prevent="clickTag(tag)"
    >
      <tag :tag="tag" />
    </a>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Tag from '../Tag'

@Component({
  props: ['model'],
  components: {
    Tag
  }
})
export default class TagList extends Vue {
  clickTag (tag) {
    this.$emit('clickTag', tag)
  }
}
</script>


<style lang="scss" scoped>
.tagList {
  display: flex;
  gap: 1rem;
}
</style>
