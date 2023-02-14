import mongoose, { Schema } from 'mongoose'

const notEmpty = (array) => array.length !== 0

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    minLength: [3, 'Name is too short!'],
    maxLength: [25, 'Name is too long!'],
    trim: true,
    match: [/^[a-zA-Z0-9-|&\s]+$/, 'Name should only contains alphabets and digits!'],
  },
  minOrderNumber: {
    type: Number,
    required: [true, 'Minimum order number is required!'],
    min: [1, 'Minimum order number is too short!'],
  },
  description: {
    type: String,
    required: [true, 'Description is required!'],
    minLength: [10, 'Description is too short!'],
    maxLength: [255, 'Description is too long!'],
    trim: true,
  },
  pictures: {
    type: [{
      type: String,
      unique: true,
      trim: true,
    }],
    validate: [notEmpty, 'Pictures are required!'],
  },
  tags: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'tag',
    }],
    validate: [notEmpty, 'Tags are required!'],
  },
  unitOfMeasure: {
    type: Schema.Types.ObjectId,
    ref: 'unitOfMeasure',
    required: [true, 'Unit of measure is required!'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID is required!'],
  },
  attributes: {
    type: [{
      _id: { type: Schema.Types.ObjectId, ref: 'attributeOfItem', },
      value: {
        type: String,
        required: [true, 'Attribute value is required!'],
        minLength: [3, 'Attribute value is too short!'],
        maxLength: [75, 'Attribute value is too long!'],
        trim: true,
      }
    }],
    validate: [notEmpty, 'Attributes are required!'],
  },
  status: {
    type: String,
    enum: {
      values: ['disabled', 'enabled'],
      message: '{VALUE} is an invalid status!'
    },
    default: 'enabled',
    lowercase: true,
  },
  priceSlabs: {
    type: [{
      slab: {
        type: Number,
        required: [true, 'Price slab is required!'],
        min: [1, 'Price slab is too short!'],
      },
      price: {
        type: Number,
        required: [true, 'Price slab is required!'],
        min: [1, 'Price slab is too short!'],
      }
    }],
    validate: [notEmpty, 'Price slabs are required!'],
  }
}, { timestamps: true })

export default mongoose.model('item', ItemSchema)