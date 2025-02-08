'use strict';

import { body } from "express-validator";
import { validateErrors, validateErrorsWithoutFiles } from "./validate.errors.js";
import { existEmail, existUsername, notRequiredField } from "../utils/db.validators.js";

// Validaciones para el registro de usuario
export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('email', 'Email cannot be empty')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
            .withMessage('Password must be strong')
        .isLength({ min: 8 })
            .withMessage('Password need at least 8 characters'),
    body('phone', 'Phone cannot be empty')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
];

// Validaciones para actualizar datos del usuario (excepto contraseña)
export const updateUserValidators = [
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom((username, { req }) => existUsername(username, req.user)),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom((email, { req }) => existEmail(email, req.user)),
    body('password')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    body('profilePicture')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    body('role')
        .optional()
        .notEmpty()
        .custom(notRequiredField),
    validateErrorsWithoutFiles
];

// Validaciones para actualizar la contraseña
export const updatePasswordValidator = [
    body('currentPassword', 'Current password cannot be empty')
        .notEmpty(),
    body('newPassword', 'New password must be at least 8 characters long and strong')
        .isLength({ min: 8 })
        .withMessage('New password need at least 8 characters')
        .isStrongPassword()
        .withMessage('New password must be strong'),
    validateErrors
];



