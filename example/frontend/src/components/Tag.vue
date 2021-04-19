<template>
  <div class="tag">
    <div class="border" />

    <div class="content">
      {{ tag.name }}
      <div
        v-if="tag.count_users"
        class="hint"
      >
        ({{ tag.count_users }})
      </div>
    </div>
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['tag']
})
export default class Tag extends Vue {
}
</script>


<style lang="scss" scoped>
.tag {
  background: #F4F4F4;
  white-space: nowrap;
  font-size: .8rem;
  display: flex;
  align-items: stretch;
  padding-right: .2rem;

  .border {
    flex: 0 0 5px;
    background: #999999;
  }

  .content {
    padding: 0.2rem .7rem;
    display: flex;
    align-items: center;
    gap: .3rem;
  }

  .hint {
    font-size: .7rem;
    color: #999999;
  }
}
</style>
