import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNewGroup, addExpenseToGroup } from "../controllers/group.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createNewGroup);
router.route("/:groupId/expenses").post(verifyJWT, addExpenseToGroup);

export default router;