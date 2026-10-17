import express from "express";
import {
    addTransaction,
    getShopTransaction,
    deleteTransaction
} from "../controllers/transactionController.js";
import { protect, requireOwner } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
.post(addTransaction)
.get(getShopTransaction)

router.route("/:id")
.delete(requireOwner, deleteTransaction);

export default router;