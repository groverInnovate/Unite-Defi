import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, Db } from 'mongodb'
import { OrderStatus } from '@/types/order'

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

// GET /api/orders/[orderHash] - Get specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { orderHash: string } }
) {
  try {
    const { orderHash } = params
    
    const database = await connectToDatabase()
    const collection = database.collection('orders')
    
    const order = await collection.findOne({ orderHash })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error getting order:', error)
    return NextResponse.json(
      { error: 'Failed to get order' },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[orderHash] - Update order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderHash: string } }
) {
  try {
    const { orderHash } = params
    const updateData = await request.json()
    
    // Always update the timestamp
    updateData.updatedAt = new Date()
    
    const database = await connectToDatabase()
    const collection = database.collection('orders')
    
    const result = await collection.updateOne(
      { orderHash },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
