import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNewGroup, addExpenseToGroup, getGroupExpense, getUserGroups } from "../controllers/group.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createNewGroup);
router.route("/:userId").get(verifyJWT, getUserGroups);
router.route("/:groupId/expenses").post(verifyJWT, addExpenseToGroup);
router.route("/:groupId/expenses").get(verifyJWT, getGroupExpense);

export default router;