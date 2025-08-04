import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNewGroup, addExpenseToGroup, getGroupExpense,
    getUserGroups, getGroupMembers, deleteGroupExpense, getGroupExpenseById, editGroupExpense} from "../controllers/group.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createNewGroup);
router.route("/:email").get(verifyJWT, getUserGroups);
router.route("/:groupId/expenses").post(verifyJWT, addExpenseToGroup);
router.route("/:groupId/expenses").get(verifyJWT, getGroupExpense);
router.route("/:groupId/expenses").get(verifyJWT, getGroupMembers);
router.route("/:groupId/members").get(verifyJWT, getGroupMembers);
router.route("/:groupId/delete/:expenseId").delete(verifyJWT, deleteGroupExpense);
router.route("/:groupId/:expenseId").get(verifyJWT, getGroupExpenseById);
router.route("/:groupId/edit/:expenseId").put(verifyJWT, editGroupExpense);

export default router;
