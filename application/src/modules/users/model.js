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

// Creates the user model wich will store users informations
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  cpf: String,
  verified: {
    type: Boolean,
    default: false
  },
  password: String,
  balance: Number,
  operations: [Operation],
  createdAt: {
    type: Date,
    default: new Date().toString()
  },
  updatedAt: {
    type: Date,
    default: new Date().toString()
  },
  deletedAt: Date
})

// Exports the models functionality so it can be used by controller
export const UserModel = mongoose.model('User', userSchema)

export default UserModel
