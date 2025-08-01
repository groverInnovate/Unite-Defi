import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, Db } from 'mongodb'
import { Order, OrderStatus } from '@/types/order'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DATABASE_NAME = process.env.DATABASE_NAME || 'cosmic_defi'

let client: MongoClient
let db: Db

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db(DATABASE_NAME)
  }
  return db
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Generate order hash if not provided
    if (!orderData.orderHash) {
      orderData.orderHash = generateOrderHash(orderData)
    }
    
    // Set timestamps
    const now = new Date()
    orderData.createdAt = now
    orderData.updatedAt = now
    
    // Set default status
    if (!orderData.status) {
      orderData.status = OrderStatus.PENDING
    }
    
    // Set expiry (24 hours from now if not provided)
    if (!orderData.expiry) {
      orderData.expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }

    const database = await connectToDatabase()
    const collection = database.collection('orders')
    
    const result = await collection.insertOne(orderData)
    
    return NextResponse.json({
      success: true,
      orderId: result.insertedId.toString(),
      orderHash: orderData.orderHash
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get all orders (with pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')
    
    const database = await connectToDatabase()
    const collection = database.collection('orders')
    
    const orders = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error getting orders:', error)
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    )
  }
}

// Helper function to generate order hash
function generateOrderHash(orderData: any): string {
  const hashInput = `${orderData.maker}-${orderData.makerAsset}-${orderData.makingAmount}-${orderData.takerAsset}-${orderData.takingAmount}-${Date.now()}`
  
  // Simple hash for hackathon (use proper keccak256 in production)
  let hash = 0
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`
}
