import empleadoModel from "../models/empleados.js";
const empleadoController = {};


// Obtener todos los empleados
empleadoController.getEmployees = async (req, res) => {
    const employees = await empleadoModel.find();
    res.json(employees);
};

// Eliminar un empleado por ID
empleadoController.deleteEmployee = async (req, res) => {
    await empleadoModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Empleado Eliminado" });
};

// Actualizar un empleado por ID
empleadoController.updateEmployee = async (req, res) => {
    const {
        nombre,
        correo,
        contrasena,
        telefono,
        direccion,
        puesto,
        fecha_contratacion,
        salario,
        DUI
    } = req.body;

    await empleadoModel.findByIdAndUpdate(
        req.params.id,
        {
            nombre,
            correo,
            contrasena,
            telefono,
            direccion,
            puesto,
            fecha_contratacion,
            salario,
            DUI
        },
        { new: true }
    );

    res.json({ message: "Empleado actualizado" });
};

export default empleadoController;
