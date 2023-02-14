import { StatusCodes } from 'http-status-codes'

const ErrorHandlerMiddleware = (error, request, response, next) => {
  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || 'Something Went Wrong, Try Again Later!',
  }

  if (error.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.message = []

    Object.values(error.errors).forEach(value => {
      defaultError.message.push({ field: value.path, message: value.message })
    })
  }

  if (error.code && error.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST
    defaultError.message = `${Object.keys(error.keyValue)} field has to be unique!`
  }

  response.status(defaultError.statusCode).json({ message: defaultError.message })
}

export default ErrorHandlerMiddleware