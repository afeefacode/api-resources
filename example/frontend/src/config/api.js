import { models } from '@/models'
import { apiResources } from '@afeefa/api-resources-client'

export default apiResources
  .registerModels(models)
  .registerApi('backendApi', '/backend-api')
