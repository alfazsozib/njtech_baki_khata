# NJTech Baki Khata (ডিজিটাল বাকি খাতা)
> Full stack application Baki Khata

---

## Overview

Traditional retail shops in Bangladesh rely on paper notebooks to record customer credit (*baki*). This leads to lost records, calculation errors, delayed collections, and unpredicted customer defaults.

**NJTech Baki Khata** replaces manual paper ledgers with a cloud-synced system featuring:
- **Instant Due Tracking**: Log credit  and cash repayments in real time.
- **Embedded AI/ML Risk Engine**: Predicts the probability of customer credit default before new credit is issued.
- **Multi-Tenant Shop Isolation**: Secure data scoping where each shopkeeper and their staff only see their own store's data.
- **Role-Based Access Control (RBAC)**: Shop owners have full privileges (create, update, delete), while staff can only record transactions and view balances.

---

## The AI / ML Component (Credit Default Risk Engine)

To prevent bad debts, the system embeds a **Supervised Logistic Regression Classifier** running natively inside the Node.js backend.

### 1. Mathematical Formulation
$$\text{Probability of Default } P(\text{Default}) = \frac{1}{1 + e^{-(\mathbf{w} \cdot \mathbf{x} + b)}}$$

### 2. Feature Engineering
The model extracts three core behavioral features from customer transaction history:
1. **$x_1$ — Credit Utilization** ($\frac{\text{Current Due}}{\text{Credit Limit}}$): Measures debt exposure against their credit ceiling (Weight: $+2.5$).
2. **$x_2$ — Overdue Aging** (Days since oldest unpaid credit): Measures how long debt has lingered (Weight: $+0.06$).
3. **$x_3$ — Repayment Discipline** ($\frac{\text{Total Paid}}{\text{Total Credit}}$): Historic repayment ratio (Weight: $-3.0$, strongly lowers risk).
4. **$b$ — Baseline Intercept** ($-1.2$).

### 3. Classification Thresholds
- **Low Risk** ($P < 35\%$): Safe customer. Regular credit allowed.
- **Medium Risk** ($35\% \le P < 65\%$): Moderate risk. Smaller credit allowed with active follow-up.
- **High Risk** ($P \ge 65\%$ or $>100\%$ limit or $>30$ days overdue): Freeze new credit; trigger urgent collection.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Poppins Font, React Router DOM.
- **Backend**: Node.js, Express 5.3 (ES Modules).
- **Database**: MongoDB Atlas with Mongoose schemas and compound indexes.
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing.
- **Deployment**: Railway / Docker ready.

---

## Project Structure

```text
njtech_baki_khata/
├── src/                      # React Frontend
│   ├── components/           # Navbar, Footer, UI components
│   ├── pages/                # Home, Login, Register, Dashboard
│   ├── App.jsx               # Client Routing
│   └── main.jsx
├── server/                   # Express Backend
│   ├── config/               # Database connection
│   ├── controllers/          # authController, customerController, transactionController, riskController
│   ├── middleware/           # auth.js (JWT verify & requireOwner)
│   ├── models/               # Customer.js, Transaction.js, Users.js
│   ├── routes/               # authRoutes, customerRoutes, transactionRoutes, riskRoutes
│   ├── utils/                # mlRiskClassifier.js, generateToken.js
│   └── server.js             # Express server entry point
├── package.json              # Frontend scripts & dependencies
└── README.md
