import DetailMeta from '@/components/detail/DetailMeta'
import DetailTitle from '@/components/detail/DetailTitle'
import ListFilter from '@/components/filter/ListFilter'
import ListCard from '@/components/list/ListCard'
import ListMeta from '@/components/list/ListMeta'
import ListTitle from '@/components/list/ListTitle'
import ListView from '@/components/list/ListView'
import ModelContainer from '@/components/model/ModelContainer'
import TagList from '@/components/models/tag/TagList'
import Vue from 'vue'

Vue.component('ListCard', ListCard)
Vue.component('ListMeta', ListMeta)
Vue.component('ListTitle', ListTitle)
Vue.component('ListView', ListView)
Vue.component('ListFilter', ListFilter)

Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)

Vue.component('ModelContainer', ModelContainer)

Vue.component('TagList', TagList)
