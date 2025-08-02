import mongoose from 'mongoose'

const CrossChainPayloadSchema = new mongoose.Schema({
  salt: { type: String, required: true },
  maker: { type: String, required: true },
  makingAmount: { type: String, required: true },
  takingAmount: { type: String, required: true },
  makerAsset: { type: String, required: true },
  takerAsset: { type: String, required: true },

  timeLocks: {
    srcWithdrawal: { type: String, required: true },
    srcPublicWithdrawal: { type: String, required: true },
    srcCancellation: { type: String, required: true },
    srcPublicCancellation: { type: String, required: true },
    dstWithdrawal: { type: String, required: true },
    dstPublicWithdrawal: { type: String, required: true },
    dstCancellation: { type: String, required: true },
  },

  srcChainId: { type: Number, required: true },
  dstChainId: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'ESCROWED', 'FILLED', 'CANCELLED'], default: 'PENDING' },
  Safety_deposit: { type: String, required: true }, // Assumes stringified BigInt or Address

  timestamp: { type: Number, required: true },

  resolverAddress: { type: String, required: true },

  nonce: { type: String, required: true },
  signature: { type: String, required: true },
  orderHash: { type: String, required: true },
  secret: { type: String, required: true }
})

export default mongoose.model('CrossChainPayload', CrossChainPayloadSchema)
