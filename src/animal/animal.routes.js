import { Router } from "express";
import { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal } from "./animal.controller.js";

const api = Router()

api.get('/', getAnimals)
api.get('/:id', getAnimalById)
api.post('/', createAnimal)
api.put('/:id', updateAnimal )
api.delete('/:id', deleteAnimal)

export default api
