const Joi=require('joi');


const imageSchema=Joi.object({
    
})
const campgroundschema=Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().min(0).required(),
        location:Joi.string().required(),
        // image:Joi.string().required(),
        description:Joi.string().required(),
        
    }).required(),
    deleteImages: Joi.array()
})

exports.campgroundschema=campgroundschema;

const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        body:Joi.string().required()
    }).required()
})

exports.reviewSchema=reviewSchema;