import { Router } from 'express'
import { createOrder, getOrderByHash } from '../controllers/orderController.js'

const router = Router()

router.post('/orders', createOrder)
router.get('/orders/:orderHash', getOrderByHash)

export default router
