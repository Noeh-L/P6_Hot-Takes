const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.voteSauce = (req, res, next) => {
    const voterId = req.body.userId;
    const vote = req.body.like;

    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            
            if (vote === 1) {
                
                Sauce.updateOne({_id: req.params.id},
                    {
                        $inc: { likes: 1 }, 
                        $push: { usersLiked: voterId } 
                    })
                        .then(() => res.status(200).json({message : "User liked."}))
                        .catch(error => res.status(401).json({ error }));

            } else if (vote === -1) {
                
                Sauce.updateOne({_id: req.params.id},
                    {
                        $inc: { dislikes: 1 }, 
                        $push: { usersDisliked: voterId } 
                    })
                        .then(() => res.status(200).json({message : "User disliked."}))
                        .catch(error => res.status(401).json({ error }));

            } else {
                
                if (sauce.usersLiked.includes(voterId)) {
                    Sauce.updateOne({_id: req.params.id},
                        {
                            $inc: { likes: -1 }, 
                            $pull: { usersLiked: voterId } 
                        })
                            .then(() => res.status(200).json({message : "User's like canceled."}))
                            .catch(error => res.status(401).json({ error }));
                } else {
                    Sauce.updateOne({_id: req.params.id},
                        {
                            $inc: { dislikes: -1 }, 
                            $pull: { usersDisliked: voterId } 
                        })
                            .then(() => res.status(200).json({message : "User's dislike canceled."}))
                            .catch(error => res.status(401).json({ error }));
                };
            };
        }) 
        .catch((error) => {
            res.status(400).json({ error });
        });
    
    
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });

    sauce.save()
        .then((sauce) => {res.status(201).json({sauce})})
        .catch(error => {res.status(400).json({error})})
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId; //pour éviter qu'une autre personne puisse modifier la sauce, par sécurité on supprime l'userId du modificateur (i.e. celui qui clique sur "modifier").
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message : 'Non autorisé'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                    .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => {
            res.status(400).json({error});
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
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



