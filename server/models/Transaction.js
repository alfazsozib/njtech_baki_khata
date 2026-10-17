import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
            required: [true, "Customer id is required"]
        },
        shopOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        type: {
            type: String,
            enum: {
                values: ["credit", "payment"],
                message: "Type must be either credit or payment",
            },
            required: [true, "Transaction type is required"],
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [1, "Amount must be at least 1 taka"],
        },
        note: {
            type: String,
            default: "",
            trim: true,
        },

        // Which staff or owner physically typed and saved this transaction
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


// search by customer and shop 
transactionSchema.index({shopOwner:1, date: -1});

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;