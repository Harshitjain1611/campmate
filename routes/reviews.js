const express=require('express');
const router=express.Router({mergeParams:true});
const catchasync=require('../utils/catchasync');
const Expresserror=require('../utils/apperror');

const {reviewSchema}=require('../schemas');

const Campground=require('../models/campground');
const Review = require('../models/review');
const reviews=require('../controllers/review');
const {Isloggedin, IsReviewAuthor}=require('../middleware');
// cosnt Review
const validatereview=(req,res,next)=>{
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
    // console.log("thrown by me")
    // console.log(data);
    // console.log(campgroundschema);
    const {error}=reviewSchema.validate(data);

    // console.log(wtf);
    // next();
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new Expresserror(msg,400);
    }
    next();
}

router.post('/',Isloggedin,validatereview,catchasync(reviews.postReview));

router.delete('/:reviewid',Isloggedin,IsReviewAuthor,catchasync(reviews.deleteReview));

module.exports=router;