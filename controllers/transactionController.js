import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";


// add transaction 
// POST /api/transaction 

export const addTransaction = async (req, res) => {
    try {
        const { customerId, type, amount, note, date } = req.body;

        if (!customerId || !type || !amount) {
            return res.status(400).json({ message: "Customer, type and amount are required" });
        }

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ message: "Amount must be greater that 0" });
        }

        // check if customer exist 
        const customer = await Customer.findOne({
            _id: customerId,
            shopOwner: req.user._id
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // implement business rules 
        if (type === "payment") {
            const pastTransaction = await Transaction.find({ customer: customer._id });

            const totalCredit = pastTransaction
                .filter((t) => t.type === "credit")
                .reduce((sum, t) => sum + t.amount, 0);

            const totalPaid = pastTransaction
                .filter((t) => t.type === "payment")
                .reduce((sum, t) => sum + t.amount, 0);

            const currentDue = Math.max(0, totalCredit - totalPaid);
            if (numAmount > currentDue) {
                return res.status(400).json({
                    message: `Payment of ৳${numAmount} cannot exceed current due of ৳${currentDue}`,
                    currentDue,
                });
            }
        }

        const newTransaction = await Transaction.create({
            customer: customer._id,
            shopOwner: req.user._id,
            type,
            amount: numAmount,
            note: note ? note.trim() : "",
            recordedBy: req.user._id,
            date: date ? new Date(date) : new Date(),
        })

        res.status(201).json({
            success: true,
            message: type === "credit" ? "Baki Added successfully" : "Payment recorded successfully",
            transaction: newTransaction,
        })


    } catch (error) {
        console.error("Faile to add transaction ", error);
        res.status(500).json({ message: "Failed to add transaction ", error: error.message });
    }
}

// get transactions 
// GET /api/transactions 
export const getShopTransaction = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 20;
        const transactions = await Transaction.find({ shopOwner: req.user._id })
            .populate("customer", "name phone")
            .populate("recordedBy", "name role")
            .sort({ date: -1 })
            .limit(limit)

        res.status(200).json({ success: true, count: transactions.length, transactions });

    } catch (error) {
        console.error("get Transactions Error: ", error);
        res.status(500).json({ mesage: "Failed to fetch transactions ", error: error.message });
    }
};


// delete a transaction
// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            shopOwner: req.user._id,
        })

        if (!transaction) {
            return res.status(404).json({ message: "Transaction removed successfully" });
        }

        await Transaction.deleteOne({ _id: transaction._id });

        res.status(200).json({ success: true, message: "Transaction removed successfully" });
    } catch (error) {
        console.error("Delete Transaction Error: ", error);
        res.status(500).json({ message: "Failed to delete transaction ", error: error.message });
    }
};