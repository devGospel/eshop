
const Order = require('../../models/order');
const express = require('express');;
const  User  = require('../../models/user');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/order', (req, res) => { 
    try {
        res.render('order')
    }catch (error) {
    res.render('pageError', {error})

  }
   
 
})

 
module.exports = router;

