import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";


// create a new customer 
// POST /api/customers 
export const createCustomer = async(req, res) =>{
    try {
        const { name, phone, address, creditLimit, notes } = req.body;
        if(!name || !phone){
            return res.status(400).json({message: "Name and phone number are required"});
        }

        // check if customer number already in the list 
        const existCustomerPhone = await Customer.findOne({shopOwner: req.user._id, phone: phone.trim()});
        if(existCustomerPhone){
            return res.status(400).json({message: "Customer already in database"});
        }

        const newCustomer = await Customer.create({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            creditLimit: creditLimit || 15000,
            notes: notes || "",
            shopOwner: req.user._id
        })

        res.status(200).json({success: true, customer});
    } catch (error) {
        console.error("Create Customer Error: ", error);
        res.status(500).json({messager: "Failed to create customer", error: error.message});
    }   
};

