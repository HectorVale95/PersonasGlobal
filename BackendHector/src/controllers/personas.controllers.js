const Personas = require('../models/personas')
const { Op } = require('sequelize')
const sequelize = require('../util/connect')

const getAll = async(req, res) =>{
    try {
        // Parámetros de paginación
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit
        
        // Parámetros de búsqueda
        const { nombre, apellido_paterno, apellido_materno } = req.query
        
        // Construir condiciones de búsqueda
        const whereClause = {}
        
        if (nombre) {
            whereClause.nombre = {
                [Op.iLike]: `%${nombre}%`
            }
        }
        
        if (apellido_paterno) {
            whereClause.apellido_paterno = {
                [Op.iLike]: `%${apellido_paterno}%`
            }
        }
        
        if (apellido_materno) {
            whereClause.apellido_materno = {
                [Op.iLike]: `%${apellido_materno}%`
            }
        }
        
        // Realizar consulta con paginación y filtros
        const results = await Personas.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['nombre', 'ASC']]
        })
        
        // Calcular información de paginación
        const totalPages = Math.ceil(results.count / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        
        return res.json({
            data: results.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: results.count,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            }
        })
    } catch (error) {
        console.error('Error en getAll:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

const create = async(req, res) =>{
    const results = await Personas.create(req.body)
    return res.status(201).json(results)
}
const getOne = async (req, res) => {
    const {id} = req.params
    const results = await Personas.findByPk(id)
    if(!results) return res.sendStatus(404)
    return res.json(results)
}
const remove = async (req, res)=>{
    const {id} = req.params
    await Personas.destroy({where: {id}})
    return res.sendStatus(204);
}

const update = async (req, res)=>{
    const {id} = req.params
    const results = await Personas.update(req.body, {where: {id}, returning: true})
    return res.json(results)
}

const search = async (req, res) => {
    try {
        // Parámetros de paginación
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit
        
        // Parámetro de búsqueda general
        const { search } = req.query
        
        // Construir condiciones de búsqueda
        const whereClause = {}
        
        if (search && search.trim() !== '') {
            const searchTerm = search.trim()
            whereClause[Op.or] = [
                {
                    nombre: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                },
                {
                    apellido_paterno: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                },
                {
                    apellido_materno: {
                        [Op.iLike]: `%${searchTerm}%`
                    }
                },
                {
                    // Búsqueda por nombre completo (nombre + apellidos)
                    [Op.and]: [
                        sequelize.literal(`CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) ILIKE '%${searchTerm}%'`)
                    ]
                }
            ]
        }
        
        // Realizar consulta con paginación y filtros
        const results = await Personas.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['nombre', 'ASC'], ['apellido_paterno', 'ASC']]
        })
        
        // Calcular información de paginación
        const totalPages = Math.ceil(results.count / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1
        
        return res.json({
            data: results.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: results.count,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            },
            search: search || ''
        })
    } catch (error) {
        console.error('Error en search:', error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}


module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    search
}