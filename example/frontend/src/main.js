import './config/components'

import * as models from '@/models'
import { bootstrap } from '@a-admin/bootstrap'

import routing from './config/routing'

bootstrap({
  apis: {
    backendApi: '/backend-api'
  },
  models: Object.values(models),
  routing
})
