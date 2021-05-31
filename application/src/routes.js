import { HealthcheckRoutes } from './modules/healthcheck'
import { UserRoutes } from './modules/users'
import { TransferRoutes } from './modules/transfer'

// Export every route as an array
export default [
  UserRoutes,
  HealthcheckRoutes,
  TransferRoutes
]
