const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

// // (cours 1.4)
// const normalizePort = val => {
//     const port = parseInt(val, 10);

//     if (isNaN(port)) {
//       return val;
//     }
//     if (port >= 0) {
//       return port;
//     }
//     return false;
// };

// const port = normalizePort(process.env.PORT || '3000');
// app.set('port', port);

mongoose.connect('mongodb+srv://noeh:nectarinepommepoire@cluster0.el0grmo.mongodb.net',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connexion à MongoDB réussie !')
        app.listen(process.env.PORT || 3000, () => {
            console.log('Listening on port 3000');
        });
    })
    .catch(() => console.log('Connexion à MongoDB échouée !'));



// // (cours 1.4)
// const errorHandler = error => {
//     if (error.syscall !== 'listen') {
//         throw error;
//     }
//     const address = server.address();
//     const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
//     switch (error.code) {
//         case 'EACCES':
//             console.error(bind + ' requires elevated privileges.');
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(bind + ' is already in use.');
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// };

// const server = http.createServer(app);

// // (cours 1.4)
// server.on('error', errorHandler);
// server.on('listening', () => {
//     const address = server.address();
//     const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
//     console.log('Listening on ' + bind);
// });

// server.listen(port);



/** cours 1.4 :
 * amélioration du server, pour le rendre plus "constant et facile à déboguer".
 * normalisation du port + gestion d'erreur et du logging basique
 */