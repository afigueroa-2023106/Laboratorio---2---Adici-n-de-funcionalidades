'use strict';

import { Router } from "express";
import { login, register, test, updatePassword } from "./auth.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { registerValidator, updatePasswordValidator } from "../../middlewares/validators.js";
import { uploadProflePicture } from "../../middlewares/multer.uploads.js";
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js";

const api = Router();

// Ruta para registrar usuario
api.post('/register', [
    uploadProflePicture.single("profilePicture"),
    registerValidator,
    deleteFileOnError
], register);

// Ruta para login
api.post('/login', login);

// Ruta protegida de prueba
api.get('/test', validateJwt, test);

// Ruta para actualizar la contraseña (requiere autenticación)
// Se espera en el body: { currentPassword, newPassword }
api.post('/update-password', validateJwt, updatePasswordValidator, updatePassword);

export default api;
