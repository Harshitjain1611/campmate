if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
}
console.log(process.env.CLOUDINARY_SECRET);

const express=require('express');
const app=express();

// const path=require('path');
const mongoose = require('mongoose');
const methodOverride=require('method-override');
const Campground=require('./models/campground');

const ejsmate=require('ejs-mate');

const catchasync=require('./utils/catchasync');
const Expresserror=require('./utils/apperror');
const Joi=require('joi');
const {campgroundschema,reviewSchema}=require('./schemas');
const Review=require('./models/review');
const session=require('express-session');
const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/reviews');

const userRoutes=require('./routes/users');
const flash=require('connect-flash');
const passport=require('passport');
const localstrategy=require('passport-local');

const MongoStore = require('connect-mongo');

const dbUrl=process.env.DB_URL;

// console.log(dbUrl);

// const {Isloggedin}=require('./middleware');

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});

const sessionconfig={
  store,
  secret:'this is a secret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires: Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionconfig));
main().catch(err => console.log(err));
// 'mongodb://127.0.0.1:27017/yelp-camp'
async function main() {
  await mongoose.connect(dbUrl);
    console.log("mongo working")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const path=require('path');
const user = require('./models/user');
// const campground = require('./models/campground');

app.engine('ejs',ejsmate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());

passport.deserializeUser(user.deserializeUser());


// app.set('method-override','_method');

app.use(methodOverride('_method'));
// app.use()
app.use(express.urlencoded({extended:true}));

// app.use('ejs','ejs-mate')
app.use(express.static(path.join(__dirname,'public')));

app.use(flash());
  
app.use((req,res,next)=>{
  // console.log(req.user);
  // console.log(req.session);

  // res.locals.returnto=req.session.returnto
  res.locals.currentuser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  // console.log('so that was an error');
  next();
})

app.get('/',(req,res)=>{
    // res.send("hello");
    res.render('home.ejs');
})

// app.get('/user',async(req,res)=>{
//   const u=new user({email:'harshit@123',username:'hj'});
//   const cu=await user.register(u,'harshit');
//   res.send(cu);
// })

app.use('/',userRoutes);

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.all('*',(req,res,next)=>{
    next(new Expresserror('this page is not defined',404));
})

app.use((err,req,res,next)=>{
    // res.send('there is an error');
    const {statusCode=500}=err;
    if(!err.message) err.message='there is an error';
    res.status(statusCode).render('error',{err});
})

// app.get('/makecampground', async (req,res)=>{
//     const camp = new Campground({title:'MY background',description:'good for'})
//     await camp.save();
//     res.send(camp);
// })

app.listen(3000,()=>{
    console.log('listening');
})