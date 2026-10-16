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
        const transactions = await Transaction.find({ shopOwner: req.user._id });

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

        res.status(200).json({ success: true, count: customerList.length, customers: customerList });

    } catch (error) {
        console.error("Get Customers Error: ", error);
        res.status(500).json({ message: "Failed to fetch customers", error: error.message });
    }
};


// get single customer with transaction 
// GET /api/customers/:id 

export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            shopOwner: req.user._id
        });

        if (!customer) {
            res.status(404).json({ message: "Customer not found" });
        }

        const transactions = await Transaction.find({ customer: customer._id })
            .populate("recordedBy", "name role")
            .sort({ date: -1 });

        const totalCredit = transactions
            .filter((t) => t.type === "credit")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalPaid = transactions
            .filter((t) => t.type === "payment")
            .reduce((sum, t) => sum + t.amount, 0);


        const currentDue = Math.max(0, totalCredit - totalPaid);
        res.status(200).json({
            success: true,
            customer,
            summary: {
                totalCredit,
                totalPaid,
                currentDue,
                creditLimit: customer.creditLimit,
                status: currentDue === 0 ? "Clear" : "Due",
            },
            transactions,
        });

    } catch (error) {
        console.error("Get Customer Detail Error: ", error);
        res.status(500).json({ message: "Failed to get customer detail", error: error.message });

    }
}


// update customer details 
// PUT /api/customers/:id 

export const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            shopOwner: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const { name, phone, address, creditLimit, notes } = req.body;

        if (name) customer.name = name.trim();
        if (phone) customer.phone = phone.trim();
        if (address !== undefined) customer.address = address.trim();
        if (creditLimit !== undefined) customer.creditLimit = creditLimit;
        if (notes !== undefined) customer.notes = notes.trim();

        await customer.save();

        res.status(200).json({ message: "Customer Updated Successfully" });
    } catch (error) {
        console.error({ message: "Update Customer Error ", error: error.message })
        res.status(500).json({ message: "Failed to update customer", error: error.message });

    }
};

// delete customer and all their transactions 
// DELETE /api/customer/:id

export const deleteCustomer = async (req, res) =>{
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            shopOwner: req.user._id
        })

        if(!customer){
            return res.status(404).json({message: "Customer not found"});
        }

        // remove the transactions of that customer 
        await Transaction.deleteMany({customer: customer._id});
        await Customer.deleteOne({_id: customer._id});

        res.status(200).json({message: "Customer deleted"});

    } catch (error) {
        console.error("Delete Customer Error ", error);
        res.status(500).json({message: "Failed to delete", error: error.message})
    }
}
