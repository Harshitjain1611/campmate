const mongoose =require('mongoose');
const Review = require('./review');
const Schema= mongoose.Schema;
const ImageSchema=new Schema({
        url:String,
        filename:String  
});

ImageSchema.virtual('thumbnail').get(function(){
    // console.log('this',this.url,'this');
    return this.url.replace('/upload','/upload/w_200');
});
const CampgroundSchema = new Schema({
    title:String,
    price: Number,
    description: String,
    location: String,
    images:[ImageSchema],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

// CampgroundSchema.pre('findOneAndDelete',async function(data){
    // console.log('this is reached')
// });
CampgroundSchema.post('findOneAndDelete',async function(data){
    // console.log('this is reached post')

    // console.log(data);
    const result=await Review.deleteMany({_id:{$in:data.reviews}});
    console.log(result);
});
module.exports = mongoose.model('Campground',CampgroundSchema);