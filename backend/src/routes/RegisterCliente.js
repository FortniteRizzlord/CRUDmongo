import express from "express"
import registerClienteController from "../controllers/registerClientController.js"

const router = express.Router();

router.route("/").post(registerClienteController.register);

export default router;