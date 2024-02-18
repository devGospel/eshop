const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ReplySchema = new Schema({
    body: String
})

const reply = mongoose.model("reply", ReplySchema)

module.exports = reply