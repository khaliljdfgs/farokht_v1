import express from 'express'
import { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems } from '../controllers/index.js'
import { AdminAuthorization, VendorAuthorization, RetailerAuthorization, ItemPrepare } from '../middlewares/index.js'

const router = express.Router()
// CREATE ITEM ROUTES
router.route('/admin/create').post(AdminAuthorization, ItemPrepare, CreateItem)
router.route('/vendor/create').post(VendorAuthorization, ItemPrepare, CreateItem)

// UPDATE ITEM ROUTES
router.route('/admin/update/:itemId').patch(AdminAuthorization, ItemPrepare, UpdateItem)
router.route('/vendor/update/:itemId').patch(VendorAuthorization, ItemPrepare, UpdateItem)

// DELETE ITEM ROUTES
router.route('/admin/delete/:itemId').delete(AdminAuthorization, DeleteItem)
router.route('/vendor/delete/:itemId').delete(VendorAuthorization, DeleteItem)

// FETCH SINGLE-ITEM ROUTES
router.route('/admin/get/:itemId').get(AdminAuthorization, GetItem)
router.route('/vendor/get/:itemId').get(VendorAuthorization, GetItem)
router.route('/retailer/get/:itemId').get(RetailerAuthorization, GetItem)

// FETCH ALL-USER-ITEMS ROUTES
router.route('/admin/getAll/:userId').get(AdminAuthorization, GetAllVendorItems)
router.route('/vendor/getAll/:userId').get(VendorAuthorization, GetAllVendorItems)
router.route('/retailer/getAll/:userId').get(RetailerAuthorization, GetAllVendorItems)

// FETCH ALL-ITEMS
router.route('/admin/getAll').get(AdminAuthorization, GetAllItems)
router.route('/vendor/getAll').get(VendorAuthorization, GetAllItems)
router.route('/retailer/getAll').get(RetailerAuthorization, GetAllItems)

export default router