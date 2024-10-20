import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addExpense, deleteExpense, editExpense, getExpenses, getExpenseById } from "../controllers/expense.controller.js";

const router = Router();

router.route("/edit-expense/:expenseId").put(verifyJWT, editExpense);
router.route("/add-expense").post(verifyJWT, addExpense);
router.route("/").get(verifyJWT, getExpenses);
router.route("/delete-expense/:expenseId").delete(verifyJWT, deleteExpense);
router.route("/get-expense/:expenseId").get(verifyJWT, getExpenseById);

export default router;
