//Validar los tokens
//Declarar variables y funciones antes de usarlas.
'use strict'

import jwt from 'jsonwebtoken'

//parámetro "next" lo vuelve middleware
export const validateJwt = async(req, res, next)=>{
    try {
        //Obtener la llave de acceso privada al token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers (cabeceras)
        let {authorization} = req.headers
        //Verificamos que venga el token
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let user = jwt.verify(authorization, secretKey)
        //Inyectar en la solicitud un nuevo parámetro
        req.user = user
        //next() = todo salió bien por acá, que pase a la sigueinte función
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({message: 'Invalid credentials'})
    }
}
