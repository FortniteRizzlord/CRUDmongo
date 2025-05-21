import express from "express";
import clienteController from "../controllers/clienteController.js";
const router = express.Router();
router.route("/")
.get(clienteController.getClients);
router.route("/:id")
.put(clienteController.updateClient)
.delete(clienteController.deleteClients);

export default router;
