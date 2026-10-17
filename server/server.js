import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import riskRoutes from "./routes/riskRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: ["https://njtechbakikhata-production.up.railway.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/risk", riskRoutes);


// testing 
app.get("/", (req, res) => {
    res.json({
        status: "Well Done",
        message: "Baki khata server is working"
    })
})

// DB connection  
const startServer = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Databse Connected successfully: ${conn.connection.host}`);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

startServer();