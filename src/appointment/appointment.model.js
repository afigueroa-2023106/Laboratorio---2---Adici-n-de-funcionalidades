import { Schema, model } from "mongoose";

const appointmentSchema = Schema(
    {
        date: {
            type: Date,
            required: [true, 'Date is required'],
            unique: true 
        },
        status: {
            type: String,
            enum: ['pendiente', 'confirmado', 'cancelado'],
            default: 'pendiente'
        },
        animal: {
            type: Schema.Types.ObjectId,
            ref: 'Animal',
            required: [true, 'Animal is required'],
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Client is required'],
        }
    },
);


export default model('Appointment', appointmentSchema);
