import DetailMeta from '@/components/detail/DetailMeta'
import DetailTitle from '@/components/detail/DetailTitle'
import EditForm from '@/components/form/EditForm'
import FormField from '@/components/form/FormField'
import ListCard from '@/components/list/ListCard'
import ListFilter from '@/components/list/ListFilter'
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

Vue.component('EditForm', EditForm)
Vue.component('FormField', FormField)

Vue.component('ModelContainer', ModelContainer)

Vue.component('TagList', TagList)
