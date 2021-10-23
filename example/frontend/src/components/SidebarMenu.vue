<template>
  <app-sidebar-menu :config="config" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import AppSidebarMenu from '@a-admin/components/SidebarMenu'
import { MenuConfig } from '@/config/MenuConfig'

@Component({
  components: {
    AppSidebarMenu
  }
})
export default class SidebarMenu extends Vue {
  config = null

  created () {
    this.config = new MenuConfig()
  }
}
</script>
