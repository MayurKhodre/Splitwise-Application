import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addExpense, editExpense, getExpenses } from "../controllers/expense.controller.js";

const router = Router();

router.route("/edit-expense/:expenseId").put(verifyJWT, editExpense);
router.route("/add-expense").post(verifyJWT, addExpense);
router.route("/").get(verifyJWT, getExpenses);

export default router;
