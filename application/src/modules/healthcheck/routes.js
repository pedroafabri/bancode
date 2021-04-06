import HealthcheckController from './controller'

// HealthCheck route
export const ROUTE = '/healthcheck'

// Initialize healthcheck routes
export const initialize = (server) => {
  server.get(ROUTE, HealthcheckController.checkHealth)
}

export default {
  ROUTE,
  initialize
}
