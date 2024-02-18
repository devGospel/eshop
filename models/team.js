const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    id: {
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

    dateJoined: {
        type: Date,
        Default: Date.now
    },
    dateDeparted: {
        type: Date,
        Default: Date.now
    }
})

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;

 