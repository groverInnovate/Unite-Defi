import Order from '../models/Order.js'


export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err })
  }
}

export const getOrderByHash = async (req, res) => {
  try {
    const order = await Order.findOne({ orderHash: req.params.orderHash })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order', details: err })
  }
}
