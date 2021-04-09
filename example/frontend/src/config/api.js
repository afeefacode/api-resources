import { apiResources } from '@afeefa/api-resources-client'
import { ApiResourcesPlugin } from '@avue/plugins/api-resources/ApiResourcesPlugin'
import Vue from 'vue'

Vue.use(ApiResourcesPlugin)

apiResources.registerApis({
  backendApi: '/backend-api'
})

export default apiResources
