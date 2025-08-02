import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from './config/db.js'
import orderRoutes from './routes/order.js'

dotenv.config()

const app = express() 

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json())
app.use('/routes', orderRoutes)

connectDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
