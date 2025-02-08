//Gestionar un perfil existente de usuario
import User from "../user/user.model.js";
import { hash, verify } from "argon2"


 //Crear un nuevo usuario
 export const createUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, phone, profilePicture, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        console.log(password)
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            phone,
            profilePicture,
            role
        })

        await newUser.save();
        res.status(201).json(
            {
                message: "User created successfully", 
                user: newUser 
            }
        )
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
    }
}

//Obtener todo
export const getUsers = async(req,res)=>{
    try{
        //Configuraciones depaginación
        const {limit = 20, skip = 0} = req.query
        //Consultar
        const users=await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length === 0){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Users not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found:',
                users
            }
        )
            
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error',e})
    }
}


//Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error });
    }
}



 // Actualizar  usuario
export const update = async(req, res)=>{
    try {
        const { id } = req.params

        const data = req.body

        const update = await User.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )

        return res.send(
            {
                success: false,
                message: 'User updated',
                user: update

            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
}


// Actualizar contraseña del usuario
export const updatePassword = async (req, res) => {
    try {
        const { userLoggin, oldPassword, newPassword } = req.body;

        // Buscar el usuario por nombre de usuario o correo electrónico
        const user = await User.findOne({
            $or: [
                { email: userLoggin },
                { username: userLoggin }
            ]
        });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User  not found'
            });
        }

        // Verificar la contraseña antigua
        if (!await checkPassword(user.password, oldPassword)) {
            return res.status(400).send({
                success: false,
                message: 'Old password is incorrect'
            });
        }

        // Validar la nueva contraseña si esta no cumple con 8 caracteres
        if (newPassword.length < 8) {
            return res.status(400).send({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        // Encriptar la nueva contraseña
        user.password = await encrypt(newPassword); // Encriptar la nueva contraseña
        const updatedUser  = await user.save(); // Guardar el usuario con la nueva contraseña encriptada

        return res.send({
            success: true,
            message: 'Password updated successfully',
            user: updatedUser 
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with update password function', err });
    }
}


