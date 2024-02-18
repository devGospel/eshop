const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },  

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },

})
 
    UserSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    }



const user = mongoose.model('user', UserSchema);

module.exports = user;

