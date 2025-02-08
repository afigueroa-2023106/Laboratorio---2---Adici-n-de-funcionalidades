//Gestionar las imágenes
import multer, { diskStorage } from "multer";

//Directorio, extensión y unir
import { dirname, extname, join } from 'path'
//Unir carpeta de archivos a una página
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const MIMETYPES = ["image/jpeg", "image/png", "image/jpg"]
const MAX_SIZE = 10000000//Bytes (10MB)

const multerConfig = (destinationPath) => {
    return multer(
        {
            storage: diskStorage(
                {
                    destination: (req, file, cb)=> { //Donde guardar
                        const fullPath = join(CURRENT_DIR, destinationPath)
                        req.filePath = fullPath
                        cb(null, fullPath)
                    },
                    filename: (req, file, cb)=>{ //Con qué nombre
                        const fileExtension = extname(file.originalname)
                        const fileName = file.originalname.split(fileExtension)[0]
                        cb(null, `${fileName}-${Date.now()}${fileExtension}`) //futbol-51581351.png
                    }
                }
            ),      
                                // cb: call back.
            fileFilter: (req, file, cb) =>{ //Validaciones de extensión
                if(MIMETYPES.includes(file.mimetype)) cb(null, true)
                   else cb(new Error(`Only ${MIMETYPES.join(" ")} are allowed`))
            },
            limits: { //Tamaño máximo
                fileSize: MAX_SIZE
            }
        }
    )
}

export const uploadProflePicture = multerConfig('../uploads/img/users')