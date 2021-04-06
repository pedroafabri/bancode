import { ServiceUnavailableError } from 'restify-errors'

// Controller to send healthcheck signal
export const checkHealth = (req, res, next) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }

  try {
    res.send(healthcheck)
  } catch (error) {
    next(new ServiceUnavailableError(error.message))
  }
}

// Export as default object
export default {
  checkHealth
}
