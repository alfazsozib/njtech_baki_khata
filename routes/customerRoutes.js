import express from "express";
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controllers/customerController";
import { protect, requireOwner } from "../middleware/auth";

const router = express.Router();

router.use(protect);

router.route("/")
.post(createCustomer)
.get(getCustomers)

router.route("/:id")
.get(getCustomerById)
.put(updateCustomer)
.delete(requireOwner, deleteCustomer)

export default router;