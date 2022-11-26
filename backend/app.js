const express = require('express');

const app = express();


app.use(express.json()); // permet de lire le corps des requêtes POST

//cette middleware permet l'accès à notre API par tt le monde (possibilité d'avoir pluggin CORS, (npm i cors -> app.use(cors()) ... ))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/api/stuff', (req, res, next) => {
    const stuff = [
        {
            id: 94859385,
            name: "Mon premier Object",
            price: 3498
        },
        {
            id: 94859385,
            name: "Mon premier Object",
            price: 3498
        }
    ];
        res.status(200).json(stuff);
});

app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(300).json({msh: 'wsh'});
});

module.exports = app;