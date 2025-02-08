import { Router } from "express";
import { 
        getUsers, 
        getUserById, 
        createUser, 
        deleteUser, 
        update
} from "./user.controller.js";
import { registerValidator } from "../../middlewares/validators.js";
import { uploadProflePicture } from "../../middlewares/multer.uploads.js";
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { updateUserValidators } from "../../middlewares/validators.js";

const api = Router()


api.get("/", getUsers); // Obtener todos los usuarios
api.get("/:id", getUserById); // Usuario por ID

// Rutas protegidas 
api.post("/", 
        [
                uploadProflePicture.single("profilePicture"),
                //Validador errores
                registerValidator,
                //Ejecutar la validación de errores (delete.file.on.errors.js)
                deleteFileOnError 
        ],
        createUser
); 

api.put("/:id", 
        [
                validateJwt, 
                updateUserValidators
        ], 
        update
); 



api.delete("/:id", deleteUser); 


export default api
