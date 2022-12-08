const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


app.use(express.json()); // permet de lire le corps des requêtes POST

//Ajout d'en-tête afin de corriger certaines faille de sécurité courantes.
app.use(helmet({
    crossOriginResourcePolicy: {policy : "cross-origin"} //pour pouvoir afficher les images.
}));

//cette middleware permet l'accès à notre API par tt le monde (possibilité d'avoir pluggin CORS, (npm i cors -> app.use(cors()) ... ))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;