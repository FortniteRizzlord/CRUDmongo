import nodemailer from "nodemailer";
import { config } from "../config.js";

// Paso 1: Configuramos el transporte del correo usando Gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        user: config.emailUser.email_user,     
        pass: config.emailUser.email_password 
    }
});

// Paso 2: Función principal para enviar el correo
const sendEmail = async (to, subject, text, code) => {
    try {
        const info = await transporter.sendMail({
            from: '"Soporte PROYECTO FORMATIVO" <xamarevir@gmail.com>', 
            to,                                            
            subject,                                        
            text,                                           
            html: HTMLRecoveryEmail(code)                 
        });

        return info; 
    } catch (error) {
        console.error("Ocurrió un error al enviar el correo:", error);
    }
};

// Paso 3: Función que genera el HTML del correo con estilo moderno
const HTMLRecoveryEmail = (code) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Código de Recuperación</title>
        <style>
            body {
                background: linear-gradient(to right, #667eea, #764ba2);
                font-family: 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
            }
            .email-card {
                background: #ffffff;
                border-radius: 12px;
                max-width: 500px;
                width: 100%;
                padding: 40px 30px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            }
            h1 {
                font-size: 24px;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
                text-align: center;
            }
            .code {
                background-color: #f1f5ff;
                border: 2px dashed #4a6ee0;
                padding: 15px;
                font-size: 26px;
                font-weight: bold;
                letter-spacing: 6px;
                text-align: center;
                color: #4a6ee0;
                border-radius: 8px;
                margin: 0 auto 25px;
                width: fit-content;
            }
            .footer {
                font-size: 13px;
                color: #888;
                text-align: center;
                margin-top: 30px;
            }
            .footer a {
                color: #4a6ee0;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-card">
                <h1>Restablece tu contraseña</h1>
                <p>Hola,</p>
                <p>Usa el siguiente código para recuperar el acceso a tu cuenta:</p>
                <div class="code">${code}</div>
                <p>Este código estará disponible por los próximos 15 minutos.</p>
                <p>Si no solicitaste este código, simplemente ignora este mensaje.</p>
                <div class="footer">
                    ¿Necesitas ayuda? Escríbenos a <a href="mailto:support@example.com">support@example.com</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export { sendEmail, HTMLRecoveryEmail };

