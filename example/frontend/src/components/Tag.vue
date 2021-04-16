<template>
  <div class="tag">
    <div class="border" />

    <div class="content">
      {{ tag.name }}
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
    justify-content: space-around;
    flex-direction: column;
  }
}
</style>
