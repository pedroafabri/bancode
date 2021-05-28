// Requires user controller
import TransferController from './controller'

import { emptyBodyValidator } from '../../middlewares/emptyBodyValidator'
import { jwtAuthenticator } from '../../middlewares/jwtAuthenticator'

// Defines base route
export const TRANSFER_ROUTE = '/transfer'

// Defines route METHODS
export const initialize = (server) => {

    server.post(`${TRANSFER_ROUTE}`, emptyBodyValidator, jwtAuthenticator, TransferController.transfer)

}

export default {
    TRANSFER_ROUTE,
    initialize
}