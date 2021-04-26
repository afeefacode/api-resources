<template>
  <div>
    <h3>
      {{ card.type }}
    </h3>

    <div class="meta">
      {{ card.meta }}
    </div>

    <div class="title">
      <router-link :to="{name: 'articles.detail', params: { articleId: model.id }}">
        {{ card.title }}
      </router-link>
    </div>

    <div
      v-for="(content, index) in card.contents"
      :key="index"
    >
      <template v-if="typeof content === 'function'">
        <component
          :is="content"
          :listConfig="listConfig"
          :model="model"
        />
      </template>

      <template v-if="typeof content === 'object'">
        <component
          :is="content.component"
          :model="model"
          v-on="getComponentEvents(content)"
        />
      </template>

      <template v-if="typeof content === 'string'">
        {{ content }}
      </template>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Tag from '../Tag'

@Component({
  props: ['listConfig', 'model'],
  components: {
    Tag
  }
})
export default class ListCard extends Vue {
  get card () {
    return this.model.toCard()
  }

  getComponentEvents (component) {
    if (component.events) {
      return component.events(this.listConfig)
    }
  }
}
</script>


<style lang="scss" scoped>
.meta {
  color: gray;
  font-size: .7rem;
}

.author {
  font-size: .9rem;
}

.title {
  font-weight: bold;
}

.tags {
  display: flex;
  gap: 1rem;
}
</style>
