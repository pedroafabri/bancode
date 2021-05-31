// Requires 'mongoose'
import mongoose from 'mongoose'

const transfer = mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  date: Date
})


export const TransferModel = mongoose.model('transfer', transfer)

export default {
  TransferModel
}