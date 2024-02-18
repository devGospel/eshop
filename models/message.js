const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    
    reply: [{ type: Schema.Types.ObjectId, ref: "reply"}] 

})

MessageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});



const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;

 