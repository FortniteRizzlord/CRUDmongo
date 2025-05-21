import bcrypt from "bcryptjs";
import clientsModel from "../models/clientes.js";

// Controlador para el registro de clientes
const registerClientsController = {};

// Función para registrar un nuevo cliente
registerClientsController.register = async (req, res) => {
    // Extraer datos del cuerpo de la solicitud
    const { nombre, correo, contrasena, telefono, direccion, DUI } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !contrasena || !telefono || !direccion || !DUI) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Mostrar en consola los datos recibidos (para depuración)
        console.log("Datos recibidos: ", req.body);

        // 1. Verificar si el cliente ya está registrado
        const existsClient = await clientsModel.findOne({ correo });

        if (existsClient) {
            return res.status(400).json({ message: "El cliente ya existe" });
        }

        // 2. Encriptar la contraseña
        const passwordHash = await bcrypt.hash(contrasena, 10);

        // 3. Crear y guardar el nuevo cliente
        const newClient = new clientsModel({
            nombre,
            correo,
            contrasena: passwordHash,
            telefono,
            direccion,
            DUI: DUI || null 
        });

        await newClient.save();

        // 4. Enviar respuesta exitosa
        res.status(201).json({
            message: "Cliente registrado exitosamente",
            clientId: newClient._id
        });

    } catch (error) {
        console.error("Error al registrar cliente:", error);
        res.status(500).json({
            message: "Error al registrar el cliente",
            error: error.message || error
        });
    }
};

export default registerClientsController;
