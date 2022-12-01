const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}
    
    //"unique:true" fait qu'il est impossible de s'inscrire avec le même mail. Mias ça reste insufisant (possibilité d'erreur de la part de mangoDB), donc on ajoute le plugin "mongoose-unique-validator".
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);