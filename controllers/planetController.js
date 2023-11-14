const axios = require('axios');

// URL base da API SWAPI para planetas
const SWAPI_BASE_URL = 'https://swapi.dev/api/planets/';

// Armazenamento temporário em memória
let planetasTemporarios = [];
let proximoId = 11; // Começando do ID após o último planeta conhecido da API SWAPI

function gerarDadosAleatoriosParaPlaneta(nome) {
    return {
        name: nome,
        rotation_period: Math.floor(Math.random() * 40) + 10, 
        orbital_period: Math.floor(Math.random() * 5000) + 1000, 
        diameter: Math.floor(Math.random() * 20000) + 5000, 
        climate: ["temperate", "tropical", "arid", "frozen"][Math.floor(Math.random() * 4)],
        gravity: "1 standard",
        terrain: ["jungle", "rainforests", "desert", "mountainous"][Math.floor(Math.random() * 4)],
        surface_water: Math.floor(Math.random() * 100),
        population: Math.floor(Math.random() * 10000) + 1000 
    };
}

// Função para listar todos os planetas
exports.getAllPlanets = async (req, res) => {
    try {
      const response = await axios.get(SWAPI_BASE_URL);
      let combinedPlanets = response.data.results.concat(planetasTemporarios);
      
      const planetName = req.query.name;
      if (planetName) {
        combinedPlanets = combinedPlanets.filter(planet => planet.name.toLowerCase().includes(planetName.toLowerCase()));
      }
  
      res.json({ results: combinedPlanets });
    } catch (error) {
      res.status(500).send({ message: "Erro ao buscar planetas" });
    }
  };

// Função para buscar um planeta por ID
exports.getPlanetById = async (req, res) => {
    const planetId = parseInt(req.params.id);
  
    try {
      let planet;
      if (planetId < 10) {
        const response = await axios.get(`${SWAPI_BASE_URL}${planetId}/`);
        planet = response.data;
      } else {
        planet = planetasTemporarios.find(p => p.id === planetId);
      }
  
      if (planet) {
        res.json(planet);
      } else {
        res.status(404).send({ message: "Planeta não encontrado" });
      }
    } catch (error) {
      res.status(500).send({ message: "Erro ao buscar o planeta" });
    }
  };

// Função para adicionar um novo planeta (em memória)
exports.addPlanet = async (req, res) => {
  const nome = req.body.name;
  const newPlanet = gerarDadosAleatoriosParaPlaneta(nome);
  newPlanet.id = proximoId++; 
  planetasTemporarios.push(newPlanet);
  res.status(201).send({ message: "Planeta adicionado com sucesso", planet: newPlanet });
};

// Função para remover um planeta (em memória)
exports.removePlanet = async (req, res) => {
    const planetId = parseInt(req.params.id);
  
    // Verificar se o ID é igual a 10 para tratar localmente
    if (planetId <= 10) {
        // Simplesmente informe que o planeta com ID 10 foi removido temporariamente
        return res.send({ message: `Planeta com ID ${planetId} não pode ser removido` });
    }
  
    // Verificar se o ID é maior que 10
    if (planetId > 10) {
        // Verificar se o planeta existe na lista de planetas temporários
        const index = planetasTemporarios.findIndex(planet => planet.id === planetId);
        if (index !== -1) {
            planetasTemporarios.splice(index, 1);
            return res.send({ message: `Planeta com ID ${planetId} removido ` });
        }
    }
  
    // Se o ID for menor que 10 ou não for encontrado na lista temporária, retorne um erro 404 (Not Found)
    return res.status(404).send({ message: `Planeta com ID ${planetId} não encontrado` });
};
