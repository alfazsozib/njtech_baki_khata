import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



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