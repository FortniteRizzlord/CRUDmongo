import employeeModel from "../models/empleados.js"; 
import bcryptjs from "bcryptjs"; 


const registerEmployeeController = {};

// Función para registrar un nuevo empleado
registerEmployeeController.register = async (req, res) => {
    // Extraer los datos enviados en la solicitud
    const { nombre,
         correo,
          contrasena, 
          telefono, 
          direccion, 
          puesto, 
          fecha_contratacion, 
          salario, 
          DUI } = req.body;

    // Validar que todos los campos estén completos
    if (!nombre || !correo || !contrasena || !telefono || !direccion || !puesto || !fecha_contratacion || !salario || !DUI) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // 1. Verificar si el correo ya está registrado para un empleado
        const employeeExist = await employeeModel.findOne({ correo });

        if (employeeExist) {
            return res.status(400).json({ message: "El empleado ya está registrado" });
        }

        // 2. Encriptar la contraseña antes de guardarla
        const passwordHash = await bcryptjs.hash(contrasena, 10);

        // 3. Crear una nueva instancia del empleado
        const newEmployee = new employeeModel({
            nombre,
            correo,
            contrasena: passwordHash,
            telefono,
            direccion,
            puesto,
            fecha_contratacion,
            salario,
            DUI: DUI || null // Si DUI no se proporciona, se asigna null
        });

        // 4. Guardar el nuevo empleado en la base de datos
        await newEmployee.save();

        // 5. Enviar respuesta indicando éxito
        res.status(201).json({ message: "Empleado registrado exitosamente" });

    } catch (error) {
        // Mostrar el error en consola y responder con mensaje de error
        console.log("Error: " + error);
        res.status(500).json({ message: "Error al registrar el empleado", error: error.message || error });
    }
};

export default registerEmployeeController;
