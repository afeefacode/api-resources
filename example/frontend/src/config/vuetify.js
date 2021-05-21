import {
  mdiChevronRight,
  mdiClose,
  mdiThumbUpOutline
} from '@mdi/js'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
    values: {
      chevronRightIcon: mdiChevronRight,
      thumbsUpIcon: mdiThumbUpOutline,
      closeIcon: mdiClose
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm'
  }
})
