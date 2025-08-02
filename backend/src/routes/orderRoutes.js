import { Router } from 'express'
import { createOrder, getOrderByHash, getAllOrders} from '../controllers/orderController.js'

const router = Router()

router.post('/orders', createOrder)
router.get('/orders/:orderHash', getOrderByHash)
router.get('/orders', getAllOrders)

export default router
