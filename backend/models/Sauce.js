const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId : {type: String},
    name : {type: String},
    manufacturer : {type: String},
    description : {type: String},
    mainPepper : {type: String},
    imageUrl : {type: String},
    heat : {type: Number},
    likes : {type: Number},
    dislikes : {type: Number},
    usersLiked : [String],
    usersDisliked : [String]
});


module.exports = mongoose.model('Sauce', sauceSchema);