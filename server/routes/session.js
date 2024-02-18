const express = require('express')
const router = express.Router();
const MongoStore = require('connect-mongo') 
const session = require('express-session')  
 
const store = MongoStore.create({
  mongoUrl: 'mongodb://127.0.0.1:27017/E-SHOP_API_DB',
  collection: "mySessions",
});


router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store, 
})); 

module.exports = router