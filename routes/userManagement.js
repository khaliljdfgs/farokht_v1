import express from 'express'
import { CreateUser, UpdateUser, DeleteUser, GetUser, GetAllUsers } from '../controllers/index.js'

const router = express.Router()
router.route('/create').post(CreateUser)
router.route('/update/:userId').patch(UpdateUser)
router.route('/delete/:userId').delete(DeleteUser)
router.route('/get/:userId').get(GetUser)
router.route('/getAll').get(GetAllUsers)

export default router