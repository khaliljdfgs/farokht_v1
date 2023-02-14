import { StatusCodes } from 'http-status-codes'
import { Register, Update } from "./authorization.js"
import { User } from '../models/index.js'

const CreateUser = async (request, response, next) => {
  await Register(request, response, next)
}

const UpdateUser = async (request, response, next) => {
  const userId = request.params.userId
  if (!userId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  request.updateUserId = userId
  await Update(request, response, next)
}

const DeleteUser = async (request, response, next) => {
  const userId = request.params.userId
  if (!userId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const output = await User.deleteOne({ _id: userId })
  if (output.deletedCount > 0)
    response.status(StatusCodes.OK).json({ message: `User ${userId} Deleted Successfully!` })
  else
    response.status(StatusCodes.NOT_FOUND).json({ message: `User ${userId} Not Found!` })
}

const GetUser = async (request, response, next) => {
  const userId = request.params.userId
  if (!userId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const user = await User.findOne({ _id: userId })
  if (!user)
    throw { status: StatusCodes.BAD_REQUEST, message: 'User Not Found!' }

  user.password = undefined
  response.status(StatusCodes.OK).json(user)
}

const GetAllUsers = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const options = {}

  if (request.query.status) options.status = request.query.status
  if (request.query.firstName) options.firstName = { '$regex': `${request.query.firstName}`, '$options': 'i' }
  if (request.query.lastName) options.lastName = { '$regex': `${request.query.lastName}`, '$options': 'i' }
  if (request.query.phoneNumber1) options.phoneNumber1 = { '$regex': `${request.query.phoneNumber1}`, '$options': 'i' }
  if (request.query.phoneNumber2) options.phoneNumber2 = { '$regex': `${request.query.phoneNumber2}`, '$options': 'i' }
  if (request.query.role) options.role = { '$regex': `${request.query.role}`, '$options': 'i' }
  if (request.query.companyName) options.companyName = { '$regex': `${request.query.companyName}`, '$options': 'i' }
  if (request.query.location) options.location = { '$regex': `${request.query.location}`, '$options': 'i' }
  if (request.query.address) options.address = { '$regex': `${request.query.address}`, '$options': 'i' }
  if (request.query.paymentMethod) options.paymentMethod = { '$regex': `${request.query.paymentMethod}`, '$options': 'i' }
  if (request.query.bankName) options.bankName = { '$regex': `${request.query.bankName}`, '$options': 'i' }
  if (request.query.branchCode) options.branchCode = { '$regex': `${request.query.branchCode}`, '$options': 'i' }
  if (request.query.bankAccountNumber) options.bankAccountNumber = { '$regex': `${request.query.bankAccountNumber}`, '$options': 'i' }

  const __users = await User.find(options)
    .limit(limit)
    .skip((page - 1) * limit)

  const users = __users.forEach(user => {
    user.password = undefined
    return user
  })

  response.status(StatusCodes.OK).json({ page, limit, count: users.length, users })
}

export { CreateUser, UpdateUser, DeleteUser, GetUser, GetAllUsers }