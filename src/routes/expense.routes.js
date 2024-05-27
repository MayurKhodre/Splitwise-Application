import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addExpense } from "../controllers/expense.controller.js";

const router = Router();

router.route("/add-expense").post(verifyJWT, addExpense);

export default router;
