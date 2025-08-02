import mongoose from 'mongoose'

const CrossChainOrderSchema = new mongoose.Schema({
  salt: String,
  maker: String,
  makingAmount: String,
  takingAmount: String,
  makerAsset: String,
  takerAsset: String,
  
  hashLock: String,
  timeLocks: Object,
  srcChainId: Number,
  dstChainId: Number,
  srcSafetyDeposit: String,
  dstSafetyDeposit: String,

  auction: {
    initialRateBump: Number,
    points: [Object],
    duration: String,
    startTime: String
  },
  whitelist: [{
    address: String,
    allowFrom: String
  }],
  resolvingStartTime: String,

  nonce: String,
  allowPartialFills: Boolean,
  allowMultipleFills: Boolean,

  signature: String,
  orderHash: String,
  secret: String
}, { timestamps: true })

export default mongoose.model('Order', CrossChainOrderSchema)
