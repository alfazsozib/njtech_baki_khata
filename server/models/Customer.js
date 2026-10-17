import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Customer phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    creditLimit: {
      type: Number,
      default: 15000, 
    },
    notes: {
      type: String,
      default: "", 
      trim: true,
    },
    // Links this customer to the specific shopkeeper/store
    shopOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

customerSchema.index({showOwwner: 1, phone: 1}, {unique: true});

const Customer = mongoose.model("customer", customerSchema);


export default Customer;