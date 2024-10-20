import { Router } from "express";
import { loginUser, logoutUser, registerUser, getGroups, getUser, getAllUsers } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    upload.fields([ // upload.single (for one file)
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/:groupId/expenses").get(verifyJWT, getGroups);
router.route("/get-user/:email").get(verifyJWT, getUser);
router.route("/get-all-users").get(verifyJWT, getAllUsers);

export default router;