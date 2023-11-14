const express = require('express');
const bodyParser = require('body-parser');
const planetRoutes = require('./routes/planetRoutes');

const app = express();

// Middleware para analisar JSON
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota raiz para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rotas para manipulação de planetas
app.use('/planets', planetRoutes);

// Definir a porta e iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
