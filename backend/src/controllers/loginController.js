import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import clientModel from "../models/clientes.js";
import employeeModel from "../models/empleados.js";
import { config } from "../config.js";

// Objeto con las funciones del login
const loginController = {};

// Inicio de sesión
loginController.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        let userFound;
        let userType;

        // Verificar si es el admin
        if (correo === config.admin.email && contrasena === config.admin.password) {
            userType = "admin";
            userFound = { _id: "admin" };
        } else {
            // Buscar en empleados
            userFound = await employeeModel.findOne({ correo });
            userType = "employee";

            // Si no es empleado, buscar en clientes
            if (!userFound) {
                userFound = await clientModel.findOne({ correo });
                userType = "client";
            }
        }

        if (!userFound) {
            return res.json({ message: "User not found" });
        }

        // Verificar contraseña (no aplica a admin)
        if (userType !== "admin") {
            const isMatch = await bcrypt.compare(contrasena, userFound.contrasena);
            if (!isMatch) {
                return res.json({ message: "Invalid password" });
            }
        }

        // Generar token JWT
        jsonwebtoken.sign(
            { id: userFound._id, userType },
            config.JWT.secret,
            { expiresIn: config.JWT.expires },
            (error, token) => {
                if (error) {
                    console.log("error " + error);
                    return res.status(500).json({ message: "Token error" });
                }

                // Guardar token en cookie
                res.cookie("authToken", token);
                res.json({ message: "Login successful", token });
            }
        );
    } catch (error) {
        console.log("error " + error);
        res.status(500).json({ message: "Server error", error: error.message || error });
    }
};

export default loginController;
