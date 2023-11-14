const express = require('express');
const router = express.Router();
const planetController = require('../controllers/planetController');

// Rota para listar todos os planetas
router.get('/', planetController.getAllPlanets);

// Rota para buscar planeta por ID
router.get('/:id', planetController.getPlanetById);

// Rota para adicionar um novo planeta
router.post('/', planetController.addPlanet);

// Rota para remover um planeta
router.delete('/:id', planetController.removePlanet);

module.exports = router;
