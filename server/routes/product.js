const Product = require('../../models/product');
const Category = require('../../models/category');
const User = require('../../models/user');
const session = require('./session')


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');



const authMiddleware = require('../../config/authMiddleware')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })
 

 


router.get('/products', async (req, res) =>{

    try {
 
        let categories = await Category.find()
        let productList = await Product.find() 

        res.render('user/products', {categories, productList})
    } catch (error) {
        res.render('pageError', {error})
    }
})


router.get('/product', async (req, res) =>{

    try {
    
       
        let productList = await Product.find() 

        res.render('admin/product', {productList})
    } catch (error) {
        res.render('pageError', {error})
    }
})


 

router.post(`/product`, uploadOptions.single('image'),  async (req, res) =>{

    let categories = await Category.find()
    let productList = await Product.find()

    const fileName = req.body.file
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
       
    let product = new Product({
        
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: `${basePath}${fileName}`, 
        categoryId : req.body.categoryId,
        dateCreated:  Date.now()
       
    })
     await product.save() 
     .then(createdProduct => {
        console.log('Created product', createdProduct)
    })
    .catch(err => {'Error ', err
    }) 

    if(!product)
    {
        res.render('notification', {notification:'Product cannot be created'})
    }   
        res.render('admin/product', {categories, productList})

})
 

 
router.get('/addProduct', async (req, res) => {
    
    let categories = await Category.find()
    let productList = await Product.find()
   
    res.render('addProduct', {categories, productList})
  })


  router.get('/editProduct/:productId', async (req, res) => {

    let productId = req.params.productId;
    let categories = await Category.find();
    // let productList = await Product.find();
   
    res.render('editProduct', {categories, productId})
  })

  router.get('/editProduct', async (req, res) => {
   
    res.render('/editProduct')
  })

  router.post('/editProduct/:productId', async (req, res) => {

    let categories = await Category.find()
    let productList = await Product.find()
   
    
    const productId = req.params.productId

    const product = await Product.findByIdAndUpdate(productId, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        // image: req.body.file,
        categoryId: req.body.categoryId,
    })
    .then(product => {
        res.render('admin/product', {categories, productList} )
    })
    .catch(error => {
        res.render('pageError', {error})
    } )
    

  })




router.get('/product-by-category/:id/:userId', async(req, res) => {

    try{
        const categories = await Category.find()   
        const categoryId = req.params.id
        const category = await Category.findById(categoryId)
        const userId = req.params.userId
        const user = await User.findById(userId)
        const productList = await Product.find( {categoryId: categoryId})

        res.render('product-by-category', {productList, user, userId, category, categories})

        }catch(error) {
             res.render('pageError', {error})
      
  }

})

router.post('/deleteProduct/:productId', async(req, res) => {
    const productId = req.params.productId;
    const userId = req.user;

    try {
        const productList = await Product.find()
        await Product.findByIdAndDelete(productId)
        res.render('admin/product', {productList, userId})
    }
    catch (error) {
        res.render('pageError', {error})
    }
   

})
 

module.exports = router;