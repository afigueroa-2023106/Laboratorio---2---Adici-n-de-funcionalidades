//Importar el modelo de animales
import Animal from '../animal/animal.model.js';


 
 // Crear un nuevo animal

export const createAnimal = async (req, res) => {
    try {
        const { name, description, age, type, keeper } = req.body;
        const newAnimal = new Animal({ name, description, age, type, keeper });
        await newAnimal.save();
        res.status(201).json(newAnimal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating animal', error });
    }
};

 //Obtener todos los animales
export const getAnimals = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;

        
        const animals = await Animal.find()
            .skip(Number(skip))
            .limit(Number(limit))
            .populate("keeper", "name -_id"); 

        if (animals.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'No animals found'
            });
        }
        return res.send({
            success: true,
            message: 'Animals found:',
            animals
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: 'General error', error: e });
    }
};

 //Obtener un animal por ID
export const getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id).populate('keeper', 'name username email');
        if (!animal) return res.status(404).json({ message: 'Animal not found' });
        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving animal', error });
    }
};


// Actualizar un animal
export const updateAnimal = async (req, res) => {
    try {
        //Extraemos los campos permitidos
        const { name, description, age,keeper } = req.body;
        const updateFields =  {};

        if(name !== undefined) updateFields.name = name;
        if(description !== undefined) updateFields.description = description;
        if(age !== undefined) updateFields.age = age;
        if(keeper !== undefined) updateFields.keeper = keeper;

        //Si no hay campos validos entonces devuelve un error
        if(Object.keys(updateFields).length === 0){
            return res.status(400).json({message: 'No valid fields provided for update :|'})
        }
        
        // Buscamos y actualizamos
        const updatedAnimal = await Animal.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true}
        )

        if (!updatedAnimal) return res.status(404).json({ message: 'Animal not found' });       
        res.status(200).json(updatedAnimal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating animal', error });
    }
};

//Eliminar un animal
export const deleteAnimal = async (req, res) => {
    try {
        const deletedAnimal = await Animal.findByIdAndDelete(req.params.id);
        if (!deletedAnimal) return res.status(404).json({ message: 'Animal not found' });
        res.status(200).json({ message: 'Animal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting animal', error });
    }
};
