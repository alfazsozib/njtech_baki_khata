import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";


// create a new customer 
// POST /api/customers 
export const createCustomer = async (req, res) => {
    try {
        const { name, phone, address, creditLimit, notes } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone number are required" });
        }

        // check if customer number already in the list 
        const existCustomerPhone = await Customer.findOne({ shopOwner: req.user._id, phone: phone.trim() });
        if (existCustomerPhone) {
            return res.status(400).json({ message: "Customer already in database" });
        }

        const newCustomer = await Customer.create({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            creditLimit: creditLimit || 15000,
            notes: notes || "",
            shopOwner: req.user._id
        })

        res.status(200).json({ success: true, newCustomer });
    } catch (error) {
        console.error("Create Customer Error: ", error);
        res.status(500).json({ messager: "Failed to create customer", error: error.message });
    }
};

// Get all customers with calculated due and status 
// GET /api/customers 

export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ shopOwner: req.user._id }).sort({ createdAt: -1 });
        const transactions = await transactions.find({ shopOwner: req.user._id });

        // map all customers and calculate dues 
        const customerList = customers.map((c) => {
            const userTransaction = transactions.filter((t) => t.customer.toString() === c._id.toString());

            const totalCredit = userTransaction
                .filter((t) => t.type === "credit")
                .reduce((sum, t) => sum + t.amount, 0);

            const totalPaid = userTransaction
                .filter((t) => t.type === "payment")
                .reduce((sum, t) => sum + t.amount, 0);

            const currentDue = Math.max(0, totalCredit - totalPaid);

            return {
                _id: c._id,
                name: c.name,
                phone: c.phone,
                address: c.address,
                creditLimit: c.creditLimit,
                notes: c.notes,
                createdAt: c.createdAt,
                totalCredit,
                totalPaid,
                currentDue,
                status: currentDue === 0 ? "Clear" : "Due",
            };
        });

        res.status(200).json({success: true, count: customerList.length, customers: customerList});

    } catch (error) {
        console.error("Get Customers Error: ", error);
        res.status(500).json({message: "Failed to fetch customers", error: error.message});
    }
};

