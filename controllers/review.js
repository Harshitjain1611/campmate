// const { model } = require('mongoose');
const Review=require('../models/review');
const Campground=require('../models/campground');
module.exports.postReview=async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id; 
    camp.reviews.push(review);
    // console.log(review);
    await camp.save();
    await review.save();
    req.flash('success','Successfully made a review');
    // r/0es.send('received fine!!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview=async(req,res)=>{
    const {id,reviewid}=req.params;
    // const {re}
    // res.send(reviewid);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    // console.log(Campground.findById(id));
    // res.send('this is me ');
    req.flash('success','Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
};