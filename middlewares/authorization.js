import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const TokenAuthorization = (request, response, next) => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer'))
    throw { status: StatusCodes.UNAUTHORIZED, message: 'Invalid Authorization Token!' }

  const token = authorizationHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    request.user = { userId: payload.userId }

    return next()
  } catch (error) {
    throw { status: StatusCodes.UNAUTHORIZED, message: 'Invalid Authorization Token!' }
  }
}

const AdminAuthorization = async (request, response, next) => {
  const user = await User.findOne({ _id: request.user.userId })

  if (user.role !== 'admin')
    throw { status: StatusCodes.UNAUTHORIZED, message: 'You Are Not Authorized To Access This Resource!' }

  request.user = user
  return next()
}

const VendorAuthorization = async (request, response, next) => {
  const user = await User.findOne({ _id: request.user.userId })

  if (user.role !== 'vendor')
    throw { status: StatusCodes.UNAUTHORIZED, message: 'You Are Not Authorized To Access This Resource!' }

  request.user = user
  return next()
}

const RetailerAuthorization = async (request, response, next) => {
  const user = await User.findOne({ _id: request.user.userId })

  if (user.role !== 'retailer')
    throw { status: StatusCodes.UNAUTHORIZED, message: 'You Are Not Authorized To Access This Resource!' }

  request.user = user
  return next()
}

export { TokenAuthorization, AdminAuthorization, VendorAuthorization, RetailerAuthorization }