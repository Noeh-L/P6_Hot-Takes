const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //on vérifie  ça correspond
       const userId = decodedToken.userId; //on en extrait l'UserId pour l'injecter ensuite dans la requête. Cela sera utilisé par le frontend lors d'appel de route (fetch).
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({error: "Token invalide."});
   }
};