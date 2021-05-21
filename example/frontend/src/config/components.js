import DetailMeta from '@/components/detail/DetailMeta'
import DetailTitle from '@/components/detail/DetailTitle'
import ListCard from '@/components/list/ListCard'
import ListMeta from '@/components/list/ListMeta'
import ListTitle from '@/components/list/ListTitle'
import ListView from '@/components/list/ListView'
import TagList from '@/components/models/tag/TagList'
import EditForm from '@avue/components/form/EditForm'
import FormField from '@avue/components/form/FormField'
import ListFilter from '@avue/components/list/ListFilter'
import ModelContainer from '@avue/components/routes/ModelContainer'
import Vue from 'vue'

Vue.component('ListCard', ListCard)
Vue.component('ListMeta', ListMeta)
Vue.component('ListTitle', ListTitle)
Vue.component('ListView', ListView)

Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)

Vue.component('ListFilter', ListFilter)
Vue.component('EditForm', EditForm)
Vue.component('FormField', FormField)
Vue.component('ModelContainer', ModelContainer)

Vue.component('TagList', TagList)
