const Sauce = require('../models/Sauce');
const fs = require('fs');


function updateLikeInDB(req, res, incrementNumber, voterId) {
    return Sauce.updateOne({_id: req.params.id},
        {
            $inc: { likes: incrementNumber }, 
            $push: { usersLiked: voterId } 
        })
            .then(() => res.status(200).json({ message: "Vote updated !" }))
            .catch(error => res.status(401).json({ error }));
};

function updateDislikeInDB(req, res, incrementNumber, voterId) {
    return Sauce.updateOne({_id: req.params.id},
        {
            $inc: { dislikes: incrementNumber }, 
            $push: { usersDisliked: voterId } 
        })
            .then(() => res.status(200).json({ message: "Vote updated !" }))
            .catch(error => res.status(401).json({ error }));
};

function updateUnlikeInDB(req, res, incrementNumber, voterId) {
    return Sauce.updateOne({_id: req.params.id},
        {
            $inc: { likes: incrementNumber }, 
            $pull: { usersLiked: voterId } 
        })
            .then(() => res.status(200).json({ message: "Vote updated !" }))
            .catch(error => res.status(401).json({ error }));
};

function updateUndislikeInDB(req, res, incrementNumber, voterId) {
    return Sauce.updateOne({_id: req.params.id},
        {
            $inc: { dislikes: incrementNumber }, 
            $pull: { usersDisliked: voterId } 
        })
            .then(() => res.status(200).json({ message: "Vote updated !" }))
            .catch(error => res.status(401).json({ error }));
};




exports.getOneSauce = (req, res, next) => {
    const id = req.params.id
    const regex = /^[A-Za-z0-9]{24}$/;
    //je vérifie si l'id envoyé par le client est bien une string de 24 caractere. Et ce avant que le code ait eu le temps de rentré dans la BDD, pour éviter des injection pirate.
    if (!regex.test(id)) {
        res.status(400).json({message: "Bad request."});
        return 
    }

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(500).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(500).json({error}));
};

exports.voteSauce = async (req, res, next) => {
    const voterId = req.body.userId;
    const vote = req.body.like;

    Sauce.findOne({_id: req.params.id})
        .then(async (sauce) => {
            
            if (vote === 1) {
                    updateLikeInDB(req, res, 1, voterId);
            } else if (vote === -1) {              
                    updateDislikeInDB(req, res, 1, voterId);
            } else {  
                
                if (sauce.usersLiked.includes(voterId)) {                   
                    updateUnlikeInDB(req, res, -1, voterId);                       
                } else {
                    updateUndislikeInDB(req, res, -1, voterId);
                };
                
            };
        }) 
        .catch((error) => {
            res.status(400).json({ error });
        });
    
    
};

exports.createSauce = (req, res, next) => {


    // Si qqun essaye d'envoyer une requete autrement qu'avec l'objet sauce, alors erreur. Si req.file existe (i.e que l'user a ajouté un fichier), alors parser, sinon prendre req.body comme tel.
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._id;
    delete sauceObject.userId; //par précaution, mais c'est écrasé par la suite (const sauce = new Sauce...)

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });

    sauce.save()
        .then((sauce) => {res.status(201).json({sauce})})
        .catch(error => {res.status(400).json({error})})
};

exports.modifySauce = (req, res, next) => {

    const id = req.params.id
    const regex = /^[A-Za-z0-9]{24}$/;

    //je vérifie si l'id envoyé par le client est bien une string de 24 caractere
    if (!regex.test(id)) {
        res.status(400).json({message: "Bad request."});
        return 
    }

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId; //pour éviter qu'une autre personne puisse modifier la sauce, par sécurité on supprime l'userId du modificateur (i.e. celui qui clique sur "modifier").

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // Par sécurité, on vérifie que c'est bien l'user qu iessaye de supprimer, sinon renvoi d'une erreur 403 (forbiden)
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message : 'User unauthorized !'});
                return;
            }

            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                .catch(error => res.status(403).json({error}));
        })
        .catch(error => res.status(400).json({error}))
            
};

exports.deleteSauce = (req, res, next) => {
    const id = req.params.id
    const regex = /^[A-Za-z0-9]{24}$/;
    //je vérifie si l'id envoyé par le client est bien une string de 24 caractere. Et ce avant que le code ait eu le temps de rentré dans la BDD, pour éviter des injection pirate.
    if (!regex.test(id)) {
        res.status(400).json({message: "Bad request."});
        return 
    }
    
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {

            // Par sécurité, on vérifie que c'est bien l'user qu iessaye de supprimer, sinon renvoi d'une erreur 403 (forbiden)
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({message : 'User unauthorized !'});
                return;
            }

            const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => {res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({error}));
                });
                
        })
        .catch((error) => {
            res.status(400).json({error});
        });
};



