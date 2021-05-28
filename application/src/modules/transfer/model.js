// Requires 'mongoose'
import mongoose from 'mongoose'

// Creates an operation model wich will store OPERATIONS TYPES, AMOUNT and OPERATION DATE
const Operation = mongoose.Schema({
  operationType: {
    String,
    enum: ['deposit', 'withdrawal']
  },
  amount: Number,
  date: Date
})

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


export const UserTransfer = mongoose.model('transfer', transfer)

export default {
    UserTransfer
  }