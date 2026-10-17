import express from "express";
import { evaluateRisk } from "../controllers/riskController.js";
import { protect } from "../middleware/auth.js"; 

const router = express.Router();

router.use(protect);
router.get("/evaluate", evaluateRisk);


export default router;