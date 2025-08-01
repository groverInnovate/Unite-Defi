import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, Db } from 'mongodb'

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

// GET /api/orders/user/[userAddress] - Get user's orders
export async function GET(
  request: NextRequest,
  { params }: { params: { userAddress: string } }
) {
  try {
    const { userAddress } = params
    
    const database = await connectToDatabase()
    const collection = database.collection('orders')
    
    const orders = await collection
      .find({ userAddress: userAddress.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error getting user orders:', error)
    return NextResponse.json(
      { error: 'Failed to get user orders' },
      { status: 500 }
    )
  }
}
