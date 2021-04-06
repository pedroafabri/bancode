// Requires 'mongoose'
import mongoose from 'mongoose'

// Creates an operation model wich will store OPERATIONS TYPES, AMOUNT and DATE
const Operation = mongoose.Schema({
  operationType: {
    String,
    enum: ['deposit', 'withdrawal']
  },
  amount: Number,
  date: Date
})

// Creates the user model wich will store users basics informations including its operations and account balance
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  cpf: String,
  verified: {
    Boolean,
    default: false
  },
  password: String,
  balance: Number,
  operations: [Operation],
  createdAt: {
    Date,
    default: new Date().toString()
  },
  updatedAt: {
    Date,
    default: new Date().toString()
  },
  deletedAt: Date
})

// Exports the models functionality so it can be used by controller
export const UserModel = mongoose.model('User', userSchema)

export default UserModel
