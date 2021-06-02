// Requires user controller
import TransferController from './controller'

import { emptyBodyValidator } from '../../middlewares/emptyBodyValidator'
import { jwtAuthenticator } from '../../middlewares/jwtAuthenticator'

// Defines base route
export const TRANSFER_ROUTE = '/transfer'

// Defines route METHODS
export const initialize = (server) => {

    server.post(`${TRANSFER_ROUTE}`, emptyBodyValidator, jwtAuthenticator, TransferController.makeTransfer)

    server.get(`${TRANSFER_ROUTE}`, TransferController.getAllTransfers)

    server.get(`${TRANSFER_ROUTE}/:id`, TransferController.getTransferId)

    server.get(`${TRANSFER_ROUTE}/from/:id`, TransferController.getTransfersFrom)

    server.get(`${TRANSFER_ROUTE}/to/:id`, TransferController.getTransfersTo)

    server.get(`${TRANSFER_ROUTE}/amount`, TransferController.getTransfersAmount)

    server.get(`${TRANSFER_ROUTE}/date`, TransferController.getTransfersDate)
}

export default {
    TRANSFER_ROUTE,
    initialize
}