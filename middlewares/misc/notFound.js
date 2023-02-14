import { StatusCodes } from 'http-status-codes'

const NotFoundMiddleware = (request, response) => {
  return response.status(StatusCodes.NOT_FOUND).json({
    message: 'End-Point Not Found!'
  })
}

export default NotFoundMiddleware
