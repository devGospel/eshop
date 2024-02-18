const express = require('express')
const router = express.Router();
const Cart = require('../../models/cart');
const Order = require('../../models/order')
const Product = require('../../models/product');
const session = require('./session')
const flash = require('connect-flash')

router.use(flash())


router.get('/addToCart/:id',  async(req, res) => {

    try {
     const productId = req.params.id
    
 
      let cart = new Cart (req.session.cart ? req.session.cart: {items: {}});
  
      let product = await Product.findById(productId)
      let name = product.name
      let image = product.image
      cart.add(product, productId, name, image);
      req.session.cart = cart
      console.log(req.session.cart)

      res.render('cartItems', {products : cart.generateArray(), totalQty: cart.totalQty} ) 
  
    } catch (error) {
      
      res.render('pageError', {error})
    } 
    })   
  
  

router.get('/shopping-cart', (req, res) => {  
    try {

      if(!req.session.cart) {
        return res.render('shopping-cart', {products: null});
      }

      var cart = new Cart(req.session.cart)
      
      res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty})

    }catch(error) {
      res.render('pageError', {error})
        
    }
    })


router.post('/reduceQty/:id', async (req, res) => {
  try {
    const productId = req.params.id
 
    let cart = new Cart (req.session.cart ? req.session.cart: {items: {}});

    let product = await Product.findById(productId)
    let name = product.name
    let image = product.image
    cart.remove(product, productId, name, image);
      req.session.cart = cart
    console.log(req.session.cart)
    res.render('cartItems', {products : cart.generateArray(), totalQty: cart.totalQty}
   )

  }catch(error) {
    res.render('pageError', {error})
      
  }
  })
  
  
 router.get('/checkout', (req, res) => {

    try {
    if(!req.session.cart) {
      return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart)
    var errMsg = req.flash('error')[0]
    // res.render('checkout', {amount: cart.totalPrice})

    res.render('checkout', {amount: cart.totalPrice, errMsg: errMsg, noError: !errMsg})

  }catch(error) {
    console.log(error)
    res.render('pageNotFound')
      
  }
  })
   
router.post('/checkout', async (req, res) => {


  const PUBLISHABLE_KEY = 'pk_test_51Od966GbDUdT8ZzpfRAgDt1io0zcVmZiCMZxdWTgulE4vVbn0C89piInoPOmO9bulA2tPLdyAl8Qp4tW2vT50jmN00DSsYzTKg';
  const SECRET_KEY = 'sk_test_51Od966GbDUdT8ZzpYNd3Cb6B9P11idL7FUsojm01OEttSYnDfgQSckYuh9aTyRHKcS8sZbSDED2p7EygvlJ8gziS00T9ejKatP';
  
  const stripe = require('stripe') (SECRET_KEY) 
  
  const charge = await stripe.charges.create({
        amount: req.body.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken,
        description: "cart payment"
      }, function(err, charge) {
        if (err) {
          req.flash('error', err.message);
          // return res.redirect('/checkout');
        }
      })  

        order = new Order ({
          user: req.user,
          cart: req.session.cart,
          name: req.body.name,
          address: req.body.address,
          // paymentId: charge.id,
          dateOrdered: Date.now()
        }) 
        await order.save()
         

        req.flash('success', 'successfully purchased cart items!')
        req.session.cart = null;
        res.render('checkoutSuccess')
})
  

router.get('/checkoutSuccess', (req, res) => {
  var successMsg = req.flash('success')[0];

  res.render('checkoutSuccess', {successMsg: successMsg, noMessages: !successMsg})
})

router.get('/remita', (req, res) => {
  res.render('remita')
})



router.post('/clearCart', async(req, res) => {
  try{
    const userId = req.user
    const productList =  await Product.find()
    req.session.cart = null
    res.render('user/products', {userId, productList})
  } catch (error) {
  res.render('pageError', {error})
  }
})


module.exports = router