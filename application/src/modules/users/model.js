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
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  operations: [Operation],
  createdAt: {
    type: Date,
    default: new Date().toString()
  },
  updatedAt: Date,
  deletedAt: Date
})

// Exports the models functionality so it can be used by controller
export const UserModel = mongoose.model('User', userSchema)

export default UserModel