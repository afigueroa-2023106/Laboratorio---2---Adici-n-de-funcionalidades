'use strict';

import { validationResult } from "express-validator";

// Middleware para validar errores generados por express-validator
export const validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return next(errors);
    }
    next();
};

export const validateErrorsWithoutFiles = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).send({
            success: false,
            message: 'Error with validations',
            errors: errors.array()
        });
    }
    next();
};
