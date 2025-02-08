//Modelo de usuario

import { Schema, model } from "mongoose";

//Método con paréntesis.
const userSchema = Schema(
    {
        //Propiedad
        name: {
            //Subpropiedades o características
            type: String,
            //Mongo Validations (middleware / intermediario que valida el parámetro antes de guardar)
            required: [true, 'Name is required'],
            maxLength: [25, `Can´t be overcome 25 characters`]
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, `Can´t be overcome 25 characters`]
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: [true, 'Username is already taken'], //NO SE PUEDE DUPLICAR EL VALOR
            lowercase: true, 
            maxLength: [15, `Can´t be overcome 15 characters`]
        }, 
        email: {
            type: String,
            required: [true, 'Email is required'],
            //Vamos a ver que pasa si no es único
            unique: true
            //Validación personalizada:
                    /* Regex */
            //match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g] //Regex para validar Email (Momentaneo)
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, `Password must be 8 characters`],
            maxLength: [100, `Can´t be overcome 100 characters`],
            //match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/gm]
        },
        profilePicture: {
            type: String
        },
        phone: {
            type: String, 
            required: [true, 'Phone is required'],
            minLength: [8, `Can´t be overcome 16 characters`],
            maxLength: [15, 'Phone must be 15 numbers'],
            //match: [/^\+[0-9]{1,3} [0-9]{3,5}-[0-9]{4}$/]
        },
        role: {
            type: String, 
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN', 'CLIENT']
        }
    }
)

//Modificar el toJason -> toObject para excluir datos en la respuesta
userSchema.methods.toJSON = function(){
    const { __v, password, ...user } = this.toObject()//Sirve para convertir un documento de mongoDB a Objeto de JS
    return user
}
//Crear y exportar el modelo
export default model('User', userSchema)