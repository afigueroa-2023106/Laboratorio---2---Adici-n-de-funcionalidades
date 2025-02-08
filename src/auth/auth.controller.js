'use strict';

import User from '../user/user.model.js';
import { encrypt, checkPassword } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

// Endpoint de prueba para rutas protegidas
export const test = (req, res) => {
    console.log('Test is running');
    res.send({ message: 'Test is running' });
};

// Registrar usuario
export const register = async (req, res) => {
    try {
        const data = req.body;
        const user = new User(data);
        // Encriptar la contraseña
        user.password = await encrypt(user.password);
        // Asignar rol por defecto
        user.role = 'CLIENT';
        // Asignar profilePicture si se sube
        user.profilePicture = req.file?.filename || null;
        await user.save();
        return res.send({ message: `Registered successfully, can log in with username: ${user.username}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with user registration', err });
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
        const { userLoggin, password } = req.body;
        // Buscar usuario por email o username
        const user = await User.findOne({
            $or: [
                { email: userLoggin },
                { username: userLoggin }
            ]
        });
        // Verificar contraseña
        if (user && await checkPassword(user.password, password)) {
            const loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            };
            const token = await generateJwt(loggedUser);
            return res.send({
                message: `Welcome ${user.name}`,
                loggedUser,
                token
            });
        }
        return res.status(400).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with login function', err });
    }
};

// Actualizar la contraseña utilizando la contraseña actual
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        // Se asume que el middleware validateJwt añade "req.user" con la propiedad "uid"
        const userId = req.user.uid;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        // Verificar que la contraseña actual sea correcta
        const isMatch = await checkPassword(user.password, currentPassword);
        if (!isMatch) {
            return res.status(400).send({ message: "Incorrect current password" });
        }
        // Encriptar la nueva contraseña y actualizar
        user.password = await encrypt(newPassword);
        await user.save();
        return res.send({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Error updating password", err });
    }
};
