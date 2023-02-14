import { StatusCodes } from 'http-status-codes'
import { Item, User } from '../models/index.js'

const CreateItem = async (request, response, next) => {
  const user = await User.findOne({ _id: request.item.userId })
  if (!user)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Vendor ID!' }

  if (request.user.role !== 'admin')
    if (request.user._id.toString() !== request.item.userId)
      throw { status: StatusCodes.UNAUTHORIZED, message: 'You Are Unauthorized To Perform This Operation!' }
    else if (request.user.status.toString().toLowerCase() !== 'approved')
      throw { status: StatusCodes.UNAUTHORIZED, message: 'You\'re Account Is Not Approved To Perform This Operation!' }

  const item = await Item.create(request.item)
  await item.populate('tags unitOfMeasure attributes._id')
  response.status(StatusCodes.OK).json(item)
}

const UpdateItem = async (request, response, next) => {
  if (!request.params.itemId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const item = await Item.findOne({ _id: request.params.itemId })
  if (!item)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Item ID!' }

  await item.populate('userId')

  if (!request.item.userId || !item.userId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Item Vendor Not Found!' }

  if (request.user.role !== 'admin')
    if (item.userId._id.toString() !== request.item.userId)
      throw { status: StatusCodes.UNAUTHORIZED, message: 'You Are Unauthorized To Perform This Operation!' }
    else if (request.user.status.toString().toLowerCase() !== 'approved')
      throw { status: StatusCodes.UNAUTHORIZED, message: 'You\'re Account Is Not Approved To Perform This Operation!' }

  if (request.user.role === 'admin') {
    const user = await User.findOne({ _id: request.item.userId })
    if (user.role !== 'vendor')
      throw { status: StatusCodes.BAD_REQUEST, message: 'Item Owner Can Only Be Vendor' }
    else
      item.userId = request.item.userId
  }

  item.name = request.item.name
  item.minOrderNumber = request.item.minOrderNumber
  item.description = request.item.description
  item.tags = request.item.tags.map(tag => tag._id)
  item.unitOfMeasure = request.item.unitOfMeasure._id
  item.pictures = request.item.pictures
  item.priceSlabs = request.item.priceSlabs

  item.attributes = request.item.attributes.map(attribute => {
    return { _id: attribute._id, value: attribute.value }
  })

  if (request.user.role === 'admin')
    item.status = request.item.status

  await item.save().then(() => {
    response.status(StatusCodes.OK).json({
      _id: item._id,
      userId: item.userId._id,
      name: item.name,
      description: item.description,
      minOrderNumber: item.minOrderNumber,
      unitOfMeasure: request.item.unitOfMeasure,
      tags: request.item.tags,
      attributes: request.item.attributes,
      pictures: request.item.pictures,
      priceSlabs: request.item.priceSlabs,
      status: item.status
    })
  }).catch(error => next(error))
}

const DeleteItem = async (request, response, next) => {
  if (!request.params.itemId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const options = { _id: request.params.itemId }
  if (request.user.role === 'vendor') {
    if (request.user.status.toString().toLowerCase() !== 'approved')
      throw { status: StatusCodes.UNAUTHORIZED, message: 'You\'re Account Is Not Approved To Perform This Operation!' }
    options.userId = request.user._id.toString()
  }

  const output = await Item.deleteOne(options)
  if (output.deletedCount > 0)
    response.status(StatusCodes.OK).json({ message: `Item ${request.params.itemId} Deleted Successfully!` })
  else
    response.status(StatusCodes.NOT_FOUND).json({ message: `Item ${request.params.itemId} Not Found!` })
}

const GetItem = async (request, response, next) => {
  if (!request.params.itemId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const options = { _id: request.params.itemId }
  if (request.user.role === 'retailer')
    options.status = 'enabled'

  const item = await Item.findOne(options)
  if (!item)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Item Not Found!' }

  await item.populate('tags unitOfMeasure attributes._id')
  response.status(StatusCodes.OK).json(item)
}

const GetAllVendorItems = async (request, response, next) => {
  if (!request.params.userId)
    throw { status: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const options = { userId: request.params.userId }

  if (request.user.role === 'retailer') {
    options.status = 'enabled'
  } else if (request.user.role === 'admin' && request.query.status) {
    options.status = request.query.status
  } else if (request.user.role === 'vendor' && request.query.status) {
    options.status = request.query.status
    options.userId = request.user._id
  }

  const items = await Item.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id')

  response.status(StatusCodes.OK).json({ count: items.length, items })
}

const GetAllItems = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const tag = request.query.tag || ''
  const options = {}

  if (request.query.minOrderNumber)
    if (isNaN(request.query.minOrderNumber))
      throw { status: StatusCodes.BAD_REQUEST, message: 'MinOrderNumber Should Be Numeric Only!' }
    else if (request.query.minOrderNumber)
      options.minOrderNumber = { '$lte': `${request.query.minOrderNumber}` }

  if (request.user.role === 'admin' && request.query.status)
    options.status = request.query.status

  if (request.query.name)
    options.name = { '$regex': `${request.query.name}`, '$options': 'i' }

  const items = await Item.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id')

  const filteredItems = items.filter(item => {
    return (!tag) ? item : item.tags.map(tag => tag.name).includes(tag)
  })

  response.status(StatusCodes.OK).json({ page, limit, count: filteredItems.length, filteredItems })
}

export { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems }