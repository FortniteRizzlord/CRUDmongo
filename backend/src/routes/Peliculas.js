import express from "express";
import peliculaController from "../controllers/peliculaController.js"
import multer from "multer";

const router = express.Router();
const upload = multer({dest: "public/"})
router.route("/")
.get(peliculaController.getMovies)
.post (upload.single("imagen"), peliculaController.insertMovie)
router.route("/:id").put(upload.single("imagen"), peliculaController.updateMovie)
.delete(peliculaController.deleteMovie)



export default router;