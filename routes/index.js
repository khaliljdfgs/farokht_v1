import express from 'express'
import { AdminAuthorization, TokenAuthorization } from '../middlewares/index.js'
import AuthRouter from './authorization.js'
import ItemRouter from './item.js'
import UserManagementRouter from './userManagement.js'

const router = express.Router()
router.use('/auth/', AuthRouter)
router.use('/item/', TokenAuthorization, ItemRouter)
router.use('/user/', TokenAuthorization, AdminAuthorization, UserManagementRouter)

export default router