const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }, 
    
    cart: {
        type: Object,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },
 
/*     paymentId: {
        type: String,
        required: true
    },   */
    dateOrdered: {
        type: Date,
        required: true
    },
})



const order = mongoose.model('order', orderSchema)

module.exports = order
