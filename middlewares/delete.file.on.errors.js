//Eliminar archivos si algo sale mal
import { unlink } from 'fs/promises' //Eliminar archivos
import { join } from 'path' //Unir carpetas o archivos a carpetas

//Middleware de eliminar
export const deleteFileOnError = async(error, req, res, next)=>{
    if(req.file && req.filePath){
                            //c://dev/adopsys/uploads/img/users / 
        const filePath = join(req.filePath, req.file.filename)
        try {
            await unlink(filePath)
        } catch (unlinkErr) {
            console.error('Error deleting file', unlinkErr)
        }
    }
    if(error.status === 400 || error.errors){ //=== Igualdad estricta | == abstracto
        return res.status(400).send(
            {
                success: false,
                message: 'Error registering user',
                error
            }
        )
    }
    return res.status(500).send(
        {
            success: false,
            message: error.message
        }
    )
}