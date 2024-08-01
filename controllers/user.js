const User=require('../models/user');


module.exports.renderRegisterForm=async(req,res)=>{
    res.render('users/register');
};

module.exports.registerForm=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
    // res.send(data);
    const user=new User({email,username});
    const newuser=await User.register(user,password);
    // console.log(newuser);
    req.login(newuser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','created a user');
        res.redirect('/campgrounds');
    })
    // req.flash('success','created a user');
    // res.redirect('/campgrounds');
    } catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
};

module.exports.renderLoginForm=(req,res)=>{
    // <res className="render"></res>('users/login');
    res.render('users/login');
};

module.exports.afterLogin=(req,res)=>{
    // <res className="render"></res>('users/login');
    // res.render('users/login');

    // console.log(res.locals.returnto);
    req.flash('success','hey ! wassup');
    // console.log(req.session);
    const toreturn= res.locals.returnto || '/campgrounds';
    res.redirect(toreturn);
};

module.exports.renderLogout=(req,res)=>{
    // req.logOut();
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','goodbye');
        res.redirect('/campgrounds');
    })
    // req.flash('success','goodbye');
    // res.redirect('/campgrounds');
};
