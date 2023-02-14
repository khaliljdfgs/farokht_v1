import { Tag, UnitOfMeasure, AttributeOfItem } from '../../models/index.js'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'

const ProcessTags = async (tags) => {
  if (tags.length < 1)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Tags are Required!' }

  const itemTags = []
  for (const _tag of tags) {
    const tag = await Tag.findOne({ name: _tag.trim() })

    if (!tag) {
      const object = await Tag.create({ name: _tag.trim() })
      itemTags.push({ _id: object._id, name: object.name })
    } else {
      itemTags.push({ _id: tag._id, name: tag.name })
    }
  }

  return itemTags
}

const ProcessAttributes = async (attributes) => {
  if (attributes.length < 1)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Attributes are Required!' }

  const itemAttributes = []
  for (const _attribute of attributes) {
    if (!_attribute.name || !_attribute.value)
      throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Attribute Data-Shape!' }

    const attributeOfItem = await AttributeOfItem.findOne({ name: _attribute.name.trim() })
    if (!attributeOfItem) {
      const object = await AttributeOfItem.create({ name: _attribute.name.trim() })
      itemAttributes.push({ _id: object._id, name: object.name, value: _attribute.value.trim() })
    } else {
      itemAttributes.push({ _id: attributeOfItem._id, name: attributeOfItem.name, value: _attribute.value.trim() })
    }
  }

  return itemAttributes
}

const ProcessPriceSlabs = (priceSlabs) => {
  if (priceSlabs.length < 1)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Price Slabs are Required!' }

  priceSlabs.forEach(priceSlab => {
    if (!priceSlab.slab || !priceSlab.price)
      throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Price Slab Data-Shape!' }
  })

  return priceSlabs
}

const ProcessUnitOfMeasure = async (unitOfMeasure) => {
  let itemUnitOfMeasure = await UnitOfMeasure.findOne({ name: unitOfMeasure.trim() })
  if (!itemUnitOfMeasure) {
    const object = await UnitOfMeasure.create({ name: unitOfMeasure.trim() })
    itemUnitOfMeasure = { _id: object._id, name: object.name }
  } else {
    itemUnitOfMeasure = { _id: itemUnitOfMeasure._id, name: itemUnitOfMeasure.name }
  }

  return itemUnitOfMeasure
}

// FIXME: Remove Karna Hai, Jab Hum Image Store Finalize Kar Lain Gye!
const ProcessPictureURLs = (pictures) => {
  if (pictures.length < 1)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Pictures are Required!' }

  const pictureURLs = []
  for (let i = 0; i < 5; ++i)
    pictureURLs.push(`Image ${i + 1} Random ID: ${uuidv4()}`)

  return pictureURLs
}

const ItemPrepare = async (request, response, next) => {
  const { name, minOrderNumber, description, userId, tags, attributes, unitOfMeasure,
    pictures, status, priceSlabs } = JSON.parse(request.body.data)

  if (!name || !minOrderNumber || !description || !pictures || !tags || !unitOfMeasure || !attributes || !userId || !priceSlabs)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (!Array.isArray(pictures) || !Array.isArray(tags) || !Array.isArray(attributes) || !Array.isArray(priceSlabs))
    throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Request Data-Shape!' }

  const itemTags = await ProcessTags(tags)
  const itemAttributes = await ProcessAttributes(attributes)
  const itemPriceSlabs = ProcessPriceSlabs(priceSlabs)
  const itemUnitOfMeasure = await ProcessUnitOfMeasure(unitOfMeasure)
  const itemPictureURLs = ProcessPictureURLs(pictures)

  request.item = {
    name, userId, description, minOrderNumber, tags: itemTags,
    attributes: itemAttributes, unitOfMeasure: itemUnitOfMeasure,
    priceSlabs: itemPriceSlabs, pictures: itemPictureURLs
  }

  if (request.user.role === 'admin')
    if (!status) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status!' }
    else request.item.status = status

  return next()
}

export default ItemPrepare