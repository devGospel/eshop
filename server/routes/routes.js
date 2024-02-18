const express = require('express')
const Product = require('../../models/product');
const session = require('./session');
const router = express.Router();




const authMiddleware = (req, res, next ) => {
  try {
    if(req.session.authMiddleware) {   
      next()
    } else {
      res.redirect('/')
    }
    
  }catch (err) {
    console.log(err)
    res.redirect('/')

    }
}





router.get('/about', (req, res) => {
  res.render('about', {currentRoute: '/about'})
})

router.get('/services', (req, res) => {
  res.render('services', {currentRoute: '/services'})
})


router.get('/contact', (req, res) => {
  res.render('contact', {currentRoute: '/contact'})
})


router.get('/message', (req, res) => {
    res.render('message')
})

 


router.post('/message', async (req, res) => {
try{
  const message = new Message({
    title: req.body.title,
    body: req.body.body
  });

   await Message.create(message);
   res.redirect('/message')
} 
  catch (error) {
    console.log(error)
  }
});

router.post('/search', async (req, res) => {
   

  try{
     let searchTerm = req.body.searchTerm;
     const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

     const foundProducts = await Product.find({
      $or: [
        {name: {$regex: new RegExp(searchNoSpecialChar, 'i') }},
        {description: {$regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]

     }
     );

   res.render("search", { foundProducts});

  }
  catch (error) {
   console.log(error);
   res.render('pageError')
  } 
});


 router.get('/search/:id', async (req, res) => {

  try {
  let productId = req.params.id
  let product = await Product.findById(productId)
  res.render('searchedProduct', {product})
  }catch (error) {
    console.log(error)
    res.render('pageError', {error})

  }
 })

router.get('/pageNotFound', (req, res) => {
  res.render('pageNotFound')
})


/* router.get("/edit:/id", (req, res, next) => {
  res.render("edit");

}) */

module.exports = router