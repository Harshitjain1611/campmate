const Campground=require('./models/campground');
// condt 
const Review=require('./models/review');
const {campgroundschema,reviewSchema}=require('./schemas');
const Expresserror=require('./utils/apperror');
module.exports.Isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){

        // console.log(req.originalUrl);
        req.session.returnto=req.originalUrl;
        req.flash('error','login first');
        return res.redirect('/login');
    }
    next();
};

module.exports.setreturnto=(req,res,next)=>{
    res.locals.returnto=req.session.returnto;

    next();
};

module.exports.IsAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campg=await Campground.findById(id);
    if(!(campg.author.equals(req.user._id))){
        req.flash('error','you dont have permission');
       return res.redirect(`/campgrounds/${id}`);
    }
     next();
};
module.exports.IsReviewAuthor=async(req,res,next)=>{
    const {id,reviewid}=req.params;
    const review=await Review.findById(reviewid);
    if(!(review.author.equals(req.user._id))){
        req.flash('error','you dont have permission');
       return res.redirect(`/campgrounds/${id}`);
    }
     next();
};

module.exports.validatecampground=(req,res,next)=>{
    const data=req.body;
    // console.log(data);
    // const campgroundschema=Joi.object({
    //     campground:Joi.object({
    //         title:Joi.string().required(),
    //         price:Joi.number().min(0).required(),
    //         location:Joi.string().required(),
    //         image:Joi.string().required(),
    //         description:Joi.string().required()
    //     }).required()
    // })
    // console.log('phoch to rha hai');
    const {error}=campgroundschema.validate(data);
    // console.log(error);
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new Expresserror(msg,400);
    }
    next();
}