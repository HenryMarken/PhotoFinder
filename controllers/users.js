const User = require('../models/user');

module.exports.renderRegister =  (req,res) => {
    res.render('users/register')
}

module.exports.register = async(req,res, next) =>{ //catchasyc catches the error and sends us to the error handling page
    try{ //this try catch flashes a messsage at the top of the screen if there was an error such as a user already being made in the system 
        const {email,username,password} = req.body;
        const user = new User ({email, username})
        const registeredUser = await User.register(user,password); //passport: takes password and passes it through hash function and adds salt 
        req.login(registeredUser, err => { //stay logged in after registering 
            if(err) return next(err);
            req.flash('success', 'Welcome to PhotoFinder');
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res) =>{ 
    res.render('users/login')
}

module.exports.login = (req,res) =>{ // middleware passport.authenticate() specify strategy this strategy can be through facebook google twitter github
    //with the middleware if we make it in this body we know user was properly authenticated
    req.flash('success', 'Logged In')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) =>{
    req.logout()
    req.flash('success', "Logged Out");
    res.redirect('/campgrounds');
}