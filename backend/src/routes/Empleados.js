import express from "express";
import empleadoController from "../controllers/empleadoController.js";
const router = express.Router();
router.route("/")
.get(empleadoController.getEmployees);
router.route("/:id")
.put(empleadoController.updateEmployee)
.delete(empleadoController.deleteEmployee);

export default router;