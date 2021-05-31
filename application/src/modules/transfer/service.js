// requires transfer model
import TransferModel from './model'

// get all transfers
export const getAllTransfers = async () => await TransferModel.find({})

// get transfers from
export const getTransfersFrom = async from => await TransferModel.find({ from: from })

// get transfers to
export const getTransfersTo = async to => await TransferModel.find({ to: to })

// get transfers by amount
export const getTransfersAmount = async amount => await TransferModel.find({ amount: amount })

// get transfers by date
export const getTransfersDate = async date => await TransferModel.find({ date: date })

// make a new transfer
export const makeTransfer = async transfer => await TransferModel.create(transfer)


export const displayFormat = transfer => {
    return {
        to: transfer.to,
        from: transfer.from,
        amount: transfer.amount,
        date: transfer.date
    }
}

export default {
    getAllTransfers,
    getTransfersAmount,
    getTransfersDate,
    getTransfersFrom,
    getTransfersTo,
    makeTransfer,
    displayFormat
}