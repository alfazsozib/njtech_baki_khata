import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";
import { predictCustomerRisk } from "../utils/mlRiskClassifier.js";

export const evaluateRisk = async (req, res) => {
    try {
        const customers = await Customer.find({ shopOwner: req.user._id });
        const transactions = await Transaction.find({ shopOwner: req.user._id });

        let lowCount = 0;
        let mediumCount = 0;
        let highCount = 0;
        const highRiskAccounts = [];

        // Evaluate each customer inside the map loop
        const evaluations = customers.map((c) => {
            const userTx = transactions.filter((t) => t.customer.toString() === c._id.toString());

            const totalCredit = userTx
                .filter((t) => t.type === "credit")
                .reduce((sum, t) => sum + t.amount, 0);

            const totalPaid = userTx
                .filter((t) => t.type === "payment")
                .reduce((sum, t) => sum + t.amount, 0);

            const currentDue = Math.max(0, totalCredit - totalPaid);

            // Calculate overdue days from the oldest unpaid credit
            let oldestUnpaidDays = 0;
            if (currentDue > 0) {
                const creditTransactions = userTx.filter((t) => t.type === "credit");
                if (creditTransactions.length > 0) {
                    const oldestDate = new Date(
                        Math.min(...creditTransactions.map((t) => new Date(t.date)))
                    );
                    oldestUnpaidDays = Math.floor(
                        Math.abs(new Date() - oldestDate) / (1000 * 60 * 60 * 24)
                    );
                }
            }

            // Run prediction
            const prediction = predictCustomerRisk({
                currentDue,
                creditLimit: c.creditLimit || 15000,
                oldestUnpaidDays,
                totalCredit,
                totalPaid,
            });

            // Count statistics
            if (prediction.riskLevel === "Low") lowCount++;
            if (prediction.riskLevel === "Medium") mediumCount++;
            if (prediction.riskLevel === "High") {
                highCount++;
                highRiskAccounts.push({
                    customerId: c._id,
                    name: c.name,
                    phone: c.phone,
                    currentDue,
                    creditLimit: c.creditLimit,
                    defaultProbability: prediction.defaultProbability,
                    recommendation: prediction.recommendation,
                });
            }

            return {
                customerId: c._id,
                name: c.name,
                phone: c.phone,
                currentDue,
                ...prediction,
            };
        });

        // Send back summary & full evaluations
        res.status(200).json({
            success: true,
            summary: {
                totalCustomers: customers.length,
                lowRisk: lowCount,
                mediumRisk: mediumCount,
                highRisk: highCount,
            },
            highRiskAccounts,
            allEvaluations: evaluations,
        });

    } catch (error) {
        console.error("Risk Evaluation Error: ", error);
        res.status(500).json({
            message: "Failed to evaluate credit risk",
            error: error.message,
        });
    }
};
