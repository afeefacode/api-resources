import {
  mdiChevronRight
} from '@mdi/js'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
    values: {
      chevronRightIcon: mdiChevronRight
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
