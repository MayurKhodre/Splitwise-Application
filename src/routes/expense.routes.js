import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addExpense, editExpense } from "../controllers/expense.controller.js";

const router = Router();

router.route("/edit-expense/:expenseId").put(verifyJWT, editExpense);
router.route("/add-expense").post(verifyJWT, addExpense);

export default router;
