const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Admin = mongoose.model('admins');
const Secy = mongoose.model('secies');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId:profile.id})
    .then((existingUser)=>{
        console.log('email: ',profile.emails[0].value);
        if(!existingUser){
            new User({googleId:profile.id,username:profile.emails[0].value}).save()
            .then((user)=>{
                done(null,user);
            })
        }else{
            done(null,existingUser);
        }
    })
    
  }
));