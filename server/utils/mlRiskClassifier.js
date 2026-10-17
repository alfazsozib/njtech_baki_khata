//  * Probability = 1 / (1 + e^-(Weighted Sum + Bias))

// turns any number into 0 to 100% probability 
const sigmoid = (z) => {
    return 1 / (1 + Math.exp(-z));
};

const WEIGHTS = {
    utilization: 2.5,
    overdueAging: 0.06,
    repaymentRate: -3.0,
    bias: -1.2
}

export const predictCustomerRisk = ({
    currentDue = 0,
    creditLimit = 15000,
    oldestUnpaidDays = 0,
    totalCredit = 0,
    totalPaid = 0,
}) => {
    // If the customer has zero due, risk is 0%
    if (currentDue <= 0) {
        return {
            riskLevel: "Low",
            defaultProbability: "0.0%",
            confidenceScore: 100,
            features: {
                utilization: "0%",
                daysOverdue: 0,
                repaymentRate: totalCredit > 0 ? `${((totalPaid / totalCredit) * 100).toFixed(0)}%` : "100%",
            },
            recommendation: "Account clear. Safe to provide new credit.",
        };
    }


    // credit utilization 
    const safeLimit = creditLimit > 0 ? creditLimit : 15000;
    const x1_utilization = currentDue / safeLimit;

    // overdue days 
    const x2_aging = oldestUnpaidDays;

    // repayment history 
    const x3_repayment = totalCredit > 0 ? totalPaid / totalCredit : 0;

    // Linear score ( z = w1*x1 + w2*x2 + w3*x3 + bias)

    const z =
        WEIGHTS.utilization * x1_utilization +
        WEIGHTS.overdueAging * x2_aging +
        WEIGHTS.repaymentRate * x3_repayment +
        WEIGHTS.bias;

    // consvert score to percent 
    const probability = sigmoid(z);
    const probPercent = (probability * 100).toFixed(1);


    let riskLevel = "Low";
    let recommendation = "Good repayment habit. Regular credit allowed.";

    if (probability >= 0.65 || x1_utilization > 1.0 || x2_aging > 30) {
        riskLevel = "High";
        recommendation = "High risk! Pause new balance";
    } else if (probability >= 0.35) {
        riskLevel = "Medium";
        recommendation = "Moderate risk. Allow small balance"
    }

    return {
        riskLevel,
        defaultProbability: `${probPercent}`,
        confidenceScore: Math.round(Math.abs(probability - 0.5) * 200),
        features: {
            utilization: `${(x1_utilization * 100).toFixed(1)}%`,
            daysOverdue: x2_aging,
            repaymentRate: `${(x3_repayment * 100).toFixed(1)}%`,
        },
        recommendation,

    };
};

