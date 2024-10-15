const express = require('express')
const router = express.Router();
const UserModel = require('../../models/user')
const Order = require('../../models/order')
const Product = require('../../models/product')
const jwt = require('jsonwebtoken')
const session = require('./session')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Category = require('../../models/category')
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = require('../../config/authMiddleware')
const passport = require('passport')
const flash = require('connect-flash')




router.use(passport.initialize());
router.use(passport.session());
router.use(flash());
 

  
  /*
      * POST /
      * USER - REGISTER
  */
  router.post('/register', async (req, res) => {

    try {
     
      const  {username, email, password} = req.body;
  
      let user = await UserModel.findOne({email})
  
      if(user) {
         res.send('User email already exist');
         return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 12)
      user = new UserModel({
        username,
        email,
        password: hashedPassword,
      })
  
      await user.save()  
      res.redirect('/')

    } catch (error) {
      res.render('pageError', {error})
    }
  });
  
  
  
  /*
      * POST /
      * USER - DASHBOARD
  */
 
    router.post('/login', passport.authenticate('local.login', { failureRedirect: '/pageError' }), async (req, res) => {
      // Successful authentication, redirect to a different page or send a response
    
      try {
        let categories = await Category.find()
        let users = await UserModel.find()
        let orders = await Order.find()
        const user = req.user

        if(user.email === 'ozchange2002@gmail.com') {
          return res.render('admin/adminDashboard', {categories, user, users, orders});
        }
       
        res.render('user/dashboard', {categories, user});

      }
         catch (error) {   
        res.render('pageError', {error})
        }
      }); 



   /*    router.get('/login-failure', (req, res) => {
        // Retrieve the flash message and display it in your view
        const errorMessage = req.flash('error')[0] || 'Invalid username or password';
        res.render('login-failure', { errorMessage });
      }); */
  
  
  
  /*
      * GET /
      * USER - DASHBOARD
  */
  router.get('/dashboard', authMiddleware, (req, res) => {

    try {
     res.render('dashboard')
      if (error) {
       return res.render('pageNotFound')
      }
    } catch (error) {
      res.render('pageNotFound')
    }  
  
  })


   


   
  
  
  /*
  * POST /
  * USER -  LOG-OUT
  */
  
  
  
  
   router.post('/logout', (req, res) => {

    if (req.session.cart) {
      req.session.cart = null
    }

   req.session.destroy((err) => {
    if(err) throw err;
    res.redirect('/')
   });
  }); 
  
  /*
  * GET /
  * HOME 
  */
  
  router.get('/', (req, res) => {
    res.render('index', {currentRoute: '/'})
  
  })
  router.get('/pageError', (req, res) => {
    const error = req.flash('error')[0] || 'Invalid username or password';
    res.render('pageError', {error} )
  
  })

  
  
  
   
router.get('/forgot-password', (req, res) => {
  try {
    res.render('forgot-password')
  }catch(error) {
    res.render('pageError', {error})
      
  }
  
  })
  
router.post('/forgot-password', (req, res) => {

    try {
        const{email}= req.body;
        UserModel.findOne({email: email})
          .then(user => {
  
        if(!user){
        res.send('User not registered')
        return
       }
  
      //  console.log(user._id)
      //  console.log(user.password)
  
       const userId = user._id;
  
    //User exist, now create a one time link for 15 minutes
     const secret = JWT_SECRET + userId
    const token = jwt.sign({id: user._id}, secret, {expiresIn: '15m'})
    const link = `http://localhost:5000/reset-password/${userId}/${token}`
  
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:  'ozchange2002@gmail.com',
      pass: 'zlrc jbll qgnp uryf'
    }
  });
  
  var mailOptions = {
    from: 'ozchange2002@gmail.com',
    to: email,
    subject: 'RESET PASSWORD',
    text: link,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
     console.log(link);
    res.render("index", {message: "'Password reset link has been sent to your email...'"})  
    
  })
  } catch (error) {
    res.render('pageError', {error})

  }
  })
  
  
  
  
router.get('/reset-password/:id/:token', async (req, res, next) => {
  
    const {id, token} = req.params;
    let user = await UserModel.findById(id)
    const userId = user._id
    
    if(!user) {
      res.send('Invalid ID')
      return
    }
  
    // UserID verified
    const secret = JWT_SECRET + userId;
  
    try{
      const payload = jwt.verify(token, secret)
      res.render('reset-password', {email: user.email})
    }
    catch(error) {
      
      res.render('pageError', {error});
    }
   
  })
  
  
router.post('/reset-password/:id/:token', async (req, res, next) => {
  
    const {id, token} = req.params;
    let user = await UserModel.findById(id)
  
    const {password, password2} = req.body;
    
    if (password !== password2) {
      return res.send('Password entered do not match')
    }
  
    const userId = user._id;
   
  
    const secret = JWT_SECRET + userId;
    jwt.verify(token, secret, (err, decoded) => {
      if(err) {
        return res.json({Status: "Error with token"})
  
      } else {
        bcrypt.hash(password, 10)
        .then(hash => {
          UserModel.findByIdAndUpdate({_id: id}, {password: hash})
            .then(message => res.render('notification', { notification: "Password successfully changed! Go to login page"}))
              .catch(err => res.send({Status: err}))
        })
        .catch(error => res.render('pageError', {error}))
      }
    })
  })







  module.exports = router;