const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User =  require('../models/user')

// Serialize user id to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use('local.login' ,new LocalStrategy({
    usernameField: 'email', // Assuming you're using email as the username
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
  
      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Invalid username or password' });
      }

     
        return done(null, user);
  
    
    } catch (error) {
      return done(error);
    }
  }));