const Category = require('../../models/category');
const Product = require('../../models/product')
const User = require('../../models/user')
const Order = require('../../models/order')
const express = require('express');
const router = express.Router();

router.get('/addCategory', async (req, res) => {

    try
    {
        const users = await User.find()
        res.render("addCategory", {users})
    }
    catch(error) {
        res.render('pageError', {error})
    }
})


 
router.post('/addCategory', async (req,res)=>{ 

    try {
        
        const users = await User.find();
        const user = req.user; 
        const categories = await Category.find();
        const orders = await Order.find();

        const category = new Category({
            name: req.body.name,  
        })
        category.save();
        
        res.render('admin/adminDashboard', {user, users, categories, orders})

        if( error) {
            return res.render('pageError', {error})
        }
    }
    catch(error) {
        console.log(error)
        res.render('pageError', {error} )
    }
    
})

 

module.exports =router;















































































