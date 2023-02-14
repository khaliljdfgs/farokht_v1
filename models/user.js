import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { Item } from './index.js'

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    minLength: [3, 'First name is too short!'],
    maxLength: [20, 'First name is too long!'],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'First name should only contains alphabets!'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
    minLength: [3, 'Last name is too short!'],
    maxLength: [20, 'Last name is too long!'],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'Last name should only contains alphabets!'],
  },
  phoneNumber1: {
    type: String,
    required: [true, 'Phone number 1 is required!'],
    minLength: [10, 'Invalid phone number!'],
    maxLength: [10, 'Invalid phone number!'],
    trim: true,
    match: [/^[0-9]+$/, 'Phone number 1 should only contains digits!'],
    unique: true,
  },
  phoneNumber2: {
    type: String,
    minLength: [10, 'Invalid phone number!'],
    maxLength: [10, 'Invalid phone number!'],
    trim: true,
    match: [/^[0-9]+$/, 'Phone number 2 should only contains digits!'],
  },
  landline: {
    type: String,
    minLength: [10, 'Invalid landline number!'],
    maxLength: [10, 'Invalid landline number!'],
    trim: true,
    match: [/^[0-9]+$/, 'Landline number should only contains digits!'],
  },
  email: {
    type: String,
    minLength: [5, 'Email is too short!'],
    maxLength: [50, 'Email is too long!'],
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email!'
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minLength: [8, 'Password is too short!'],
    select: false, // TODO: Yeh Kya Karta Hai???
  },
  role: {
    type: String,
    required: [true, 'Role is required!'],
    enum: {
      values: ['admin', 'vendor', 'retailer'],
      message: '{VALUE} is an invalid role!'
    },
    lowercase: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required!'],
    minLength: [3, 'Company name is too short!'],
    manLength: [50, 'Company name is too long!'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required!'],
    minLength: [3, 'Location is too short!'],
    manLength: [50, 'Location is too long!'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required!'],
    minLength: [3, 'Address is too short!'],
    manLength: [50, 'Address is too long!'],
    trim: true,
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment is required!'],
    minLength: [3, 'Payment is too short!'],
    manLength: [50, 'Payment is too long!'],
    trim: true,
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required!'],
    minLength: [3, 'Bank name is too short!'],
    manLength: [50, 'Bank name is too long!'],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'Bank name should only contains alphabets!'],
  },
  bankBranchCode: {
    type: String,
    required: [true, 'Bank branch code is required!'],
    minLength: [4, 'Bank branch code is too short!'],
    manLength: [7, 'Bank branch code is too long!'],
    trim: true,
    match: [/^[0-9]+$/, 'Bank branch code should only contains digits!'],
  },
  bankAccountNumber: {
    type: String,
    required: [true, 'Bank account number is required!'],
    minLength: [10, 'Bank account number is too short!'],
    manLength: [15, 'Bank account number is too long!'],
    trim: true,
    match: [/^[0-9]+$/, 'Bank account number should only contains digits!'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'suspended'],
      message: '{VALUE} is an invalid status!'
    },
    default: 'pending',
    lowercase: true,
  }
}, { timestamps: true })

UserSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const userDocument = await this.model.findOne(this.getFilter())
  await Item.deleteMany({ userId: userDocument._id })
  next()
})

UserSchema.methods.ComparePassword = async function (candidatePassword) {
  const isMatched = await bcrypt.compare(candidatePassword, this.password)
  return isMatched
}

export default mongoose.model('user', UserSchema)