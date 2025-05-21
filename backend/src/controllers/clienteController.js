import clientsModel from "../models/clientes.js";
const clienteController = {};

// Obtener todos los clientes
clienteController.getClients = async (req, res) => {
    const clients = await clientsModel.find();
    res.json(clients);
};

// Eliminar un cliente por ID
clienteController.deleteClients = async (req, res) => {
    await clientsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminado" });
};

// Actualizar un cliente por ID
clienteController.updateClient = async (req, res) => {
    const {
        nombre,
        correo,
        contrasena,
        telefono,
        direccion,
        DUI
    } = req.body;

    const updatedClient = await clientsModel.findByIdAndUpdate(
        req.params.id,
        {
            nombre,
            correo,
            contrasena,
            telefono,
            direccion,
            DUI
        },
        { new: true }
    );

    res.json({ message: "Cliente actualizado" });
};

export default clienteController;

