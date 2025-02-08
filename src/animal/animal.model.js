    //Modelo de animal

import { Schema, model } from "mongoose"


//Método con paréntesis.
const userSchema = Schema(
    {
        //Propiedad
        name:{
            //Subpropiedades o características
            type: String,
            //Mongo Validations (middleware / intermediario que valida el parámetro antes de guardar)
            required: [false, 'Name is not required'],
            maxLength: [25, `Can´t be overcome 25 characters`]
        },
        description:{
            type: String,
            maxLength: [256, 'Can´t be overcome 256 characters']
        },
        age:{
            type: Number,
            required: [false, 'Age is not required'],
            min: [0, 'Age must be a positive number']
        }, 
        type:{
            type: String,
            required: [true, 'Type is required'],
            //enum: ['Dog', 'Cat', 'Bird', 'Reptile', 'Other']
        }, 
        keeper:{
            type: Schema.Types.ObjectId,
            ref: 'User', // Hace referencia a la colección de usuarios
            required: [true, 'Keeper (responsable) is required']
        }
    },
    { timestamps: true } // Agrega createdAt y updatedAt automáticamente
)

//Crear y exportar el modelo
export default model('Animal', userSchema)