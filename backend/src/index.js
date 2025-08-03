import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

connectDB()
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(express.json())

app.use('/api', orderRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
