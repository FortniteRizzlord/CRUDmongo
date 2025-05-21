import movieModel from "../models/peliculas.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

// Configurar Cloudinary con los datos del archivo de configuración
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret
});

// Objeto controlador para las operaciones relacionadas con películas
const peliculaController = {};

// Obtener todas las películas desde la base de datos
peliculaController.getMovies = async (req, res) => {
    const movies = await movieModel.find();
    res.json(movies);
};

// Eliminar una película por su ID
peliculaController.deleteMovie = async (req, res) => {
    await movieModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
};

// Actualizar los datos de una película, incluyendo una nueva imagen si se proporciona
peliculaController.updateMovie = async (req, res) => {
    const { titulo, descripcion, director, genero, anio, duracion } = req.body;
    let imageUrl = "";

    // Si se incluye una imagen, se sube a Cloudinary
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "movies",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"]
        });
        imageUrl = result.secure_url;
    }

    // Se actualiza la película con los nuevos datos
    const updatedMovie = await movieModel.findByIdAndUpdate(
        req.params.id, 
        {
            titulo,
            descripcion,
            director,
            genero,
            anio,
            duracion,
            imagen: imageUrl || undefined
        },
        { new: true }
    );

    res.json({ message: "Movie updated", movie: updatedMovie });
};

// Insertar una nueva película con imagen incluida (opcional)
peliculaController.insertMovie = async (req, res) => {
    const { titulo, descripcion, director, genero, anio, duracion } = req.body;
    let imageUrl = "";

    // Si hay imagen, subirla a Cloudinary
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "movies",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "avif"]
        });
        imageUrl = result.secure_url;
    }

    // Crear una nueva película con los datos recibidos
    const newMovie = new movieModel({
        titulo,
        descripcion,
        director,
        genero,
        anio,
        duracion,
        imagen: imageUrl
    });

    await newMovie.save();

    res.json({ message: "Pelicula guardada", movie: newMovie });
};

export default peliculaController;
