<template>
  <div>
    <v-row>
      <v-col cols="3">
        <list-filter tag_id />
      </v-col>

      <v-col cols="3">
        <list-filter q />
      </v-col>

      <v-col cols="3">
        <list-filter page_size />
      </v-col>

      <v-col cols="3">
        <list-filter order />
      </v-col>
    </v-row>

    <list-filter page />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['count', 'filters']
})
export default class AuthorsFilters extends Vue {
}
</script>
