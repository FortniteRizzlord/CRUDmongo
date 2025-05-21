import express from "express"
import logoutController from "../controllers/logoutContoller.js";

const router = express.Router();

router.route("/").post(logoutController.logout);

export default router;