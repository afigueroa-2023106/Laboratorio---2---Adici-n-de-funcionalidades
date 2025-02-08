import Appointment from "./appointment.model.js";
import Animal from "../animal/animal.model.js";
import User from "../user/user.model.js";


// Crear una cita
export const addAppointment = async (req, res) => {
    try {
        const { date, animal, client, status } = req.body;

        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0);

        // Verifica que el animal exista 
        const existingAnimal = await Animal.findById(animal);
        if (!existingAnimal) {
            return res.status(404).json({ message: "Animal does not exits" });
        }

        // Verifica que el cliente existe 
        const existingClient = await User.findById(client);
        if (!existingClient) {
            return res.status(404).json({ message: "client does not exist" });
        }

        // Verifica que solo haya una cita por fecha 
        const existingAppointment = await Appointment.findOne({ date: appointmentDate });
        if (existingAppointment) {
            return res.status(400).json({ message: "There is already an appointment" });
        }

        // Crear la nueva cita
        const newAppointment = new Appointment({
            date: appointmentDate,animal,client,status
        })

        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error creating appointment", error });
    }
}