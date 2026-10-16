import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";


// add transaction 
// POST /api/transaction 

export const addTransaction = async (req, res) =>{
    try {
        const { customerId, type, amount, note, date } = req.body;

        if(!customerId || !type || !amount){
            return res.status(400).json({message: "Customer, type and amount are required"});
        }

        const numAmount = Number(amount);
        if(isNaN(numAmount) || numAmount <= 0){
            return res.status(400).json({message: "Amount must be greater that 0"});
        }

        // check if customer exist 
        const customer = await Customer.findOne({
            _id: customerId,
            shopOwner: req.user._id
        });

        if(!customer){
            return res.status(404).json({message: "Customer not found"});
        }

        // implement business rules 
        if(type === "payment"){
            const pastTransaction = await Transaction.find({customer: customer._id});

            const totalCredit = pastTransaction
            .filter((t) => t.type === "credit")
            .reduce((sum, t) => sum + t.amount, 0);

            const currentDue = Math.max(0, totalCredit - totalPaid);
            if (numAmount > currentDue) {
                return res.status(400).json({
                message: `Payment of ৳${numAmount} cannot exceed current due of ৳${currentDue}`,
                currentDue,
                });
            }
        }

    } catch (error) {
        console.error("Faile to add transaction ", error );
        res.status(500).json({message: "Failed to add transaction ", error: error.message});
    }   
}