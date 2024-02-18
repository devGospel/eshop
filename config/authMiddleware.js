const session = require('../server/routes/session')

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
  
  module.exports = authMiddleware;