import express from 'express'
import { Register, Login, Update } from '../controllers/index.js'
import { TokenAuthorization } from '../middlewares/index.js'

const router = express.Router()
router.route('/register').post(Register)
router.route('/login').post(Login)
router.route('/update').patch(TokenAuthorization, Update)

export default router