import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import clientModel from "../models/clientes.js";
import employeeModel from "../models/empleados.js";
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import { config } from "../config.js";

// Objeto con funciones para recuperación de contraseña
const RecoveryPasswordController = {};

// Solicita un código de verificación y lo envía por correo
RecoveryPasswordController.requestCode = async (req, res) => {
    const { correo } = req.body;

    try {
        let userFound;
        let userType;

        // Buscar usuario en la base de datos (cliente o empleado)
        userFound = await clientModel.findOne({ correo });

        if (userFound) {
            userType = "client";
        } else {
            userFound = await employeeModel.findOne({ correo });
            if (userFound) {
                userType = "employee";
            }
        }

        // Si no se encuentra el usuario
        if (!userFound) {
            return res.json({ message: "User not found" });
        }

        // Generar un código de verificación aleatorio de 5 dígitos
        const code = Math.floor(10000 + Math.random() * 90000).toString();

        // Crear token JWT con el código
        const token = jsonwebtoken.sign(
            { correo, code, userType, verified: false },
            config.JWT.secret,
            { expiresIn: "20m" } // Token válido por 20 minutos
        );

        // Guardar token en cookie
        res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

        // Enviar correo con el código de verificación
        await sendEmail(
            correo,
            "Password recovery code",
            `Your verification code is: ${code}`,
            HTMLRecoveryEmail(code)
        );

        res.json({ message: "Verification code sent" });
    } catch (error) {
        console.log("error " + error);
    }
};

// Verifica que el código ingresado sea correcto
RecoveryPasswordController.verifyCode = async (req, res) => {
    const { code } = req.body;

    try {
        const token = req.cookies.tokenRecoveryCode;

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        // Verifica si el código coincide
        if (decoded.code !== code) {
            return res.json({ message: "Invalid code" });
        }

        // Genera un nuevo token con la verificación confirmada
        const newToken = jsonwebtoken.sign(
            {
                correo: decoded.correo,
                code: decoded.code,
                userType: decoded.userType,
                verified: true
            },
            config.JWT.secret,
            { expiresIn: "20m" }
        );

        res.cookie("tokenRecoveryCode", newToken, { maxAge: 20 * 60 * 1000 });

        res.json({ message: "Code verified successfully" });
    } catch (error) {
        console.log("error " + error);
    }
};

// Permite al usuario establecer una nueva contraseña
RecoveryPasswordController.newPassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
        const token = req.cookies.tokenRecoveryCode;

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        // Verifica si el código ya fue validado previamente
        if (!decoded.verified) {
            return res.json({ message: "Code not verified" });
        }

        const { correo, userType } = decoded;

        // Encripta la nueva contraseña
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        let updatedUser;

        // Actualiza la contraseña según el tipo de usuario
        if (userType === "client") {
            updatedUser = await clientModel.findOneAndUpdate(
                { correo },
                { password: hashedPassword },
                { new: true }
            );
        } else if (userType === "employee") {
            updatedUser = await employeeModel.findOneAndUpdate(
                { correo },
                { password: hashedPassword },
                { new: true }
            );
        }

        // Eliminar cookie con token
        res.clearCookie("tokenRecoveryCode");

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("error " + error);
    }
};

export default RecoveryPasswordController;
