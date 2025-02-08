'use strict';

import { hash, verify } from "argon2";

// Encriptar la contraseña
export const encrypt = async (password) => {
    try {
        return await hash(password);
    } catch (err) {
        console.error(err);
        return err;
    }
};

// Verificar la contraseña
export const checkPassword = async (hashedPassword, password) => {
    try {
        return await verify(hashedPassword, password);
    } catch (err) {
        console.error(err);
        return err;
    }
};
