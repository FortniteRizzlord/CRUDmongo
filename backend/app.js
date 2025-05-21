import express from 'express';
import cookieParser from 'cookie-parser';

// Importar rutas 
import clientsRoutes from "./src/routes/Clientes.js";
import employeeRoutes from "./src/routes/Empleados.js";
import loginRoutes from "./src/routes/Login.js";
import logoutRoutes from "./src/routes/Logout.js";
import moviesRoutes from "./src/routes/Peliculas.js";
import recoveryPasswordRoutes from "./src/routes/RecoveryPassword.js";
import registerClientRoutes from "./src/routes/RegisterCliente.js";
import registerEmployeeRoutes from "./src/routes/RegisterEmpleado.js";

const app = express();

// Middleware para parsear JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Definir rutas con sus prefijos
app.use("/api/clientes", clientsRoutes);
app.use("/api/empleados", employeeRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/peliculas", moviesRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);
app.use("/api/registerCliente", registerClientRoutes);
app.use("/api/registerEmpleadoss", registerEmployeeRoutes);

export default app;
