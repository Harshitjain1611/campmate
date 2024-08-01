const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index=async(req,res,next)=>{
    
    
    const camps=await Campground.find({});
    res.render('campgrounds/index.ejs',{camps});
    
};

module.exports.renderNewForm=async (req,res)=>{
    // res.send("hello");
    // res.render('home.ejs');
    // const camps=await Campground.find({});
    // if(!req.isAuthenticated()){
    //     req.flash('error','you need to login first');
    //     return res.redirect('/login');
    // }
    res.render('campgrounds/new.ejs');
};

module.exports.postCampground=async(req,res)=>{
    // res.send("hello");
    // res.render('home.ejs');
    // const camps=await Campground.find({});
    // res.render('campgrounds/new.ejs');
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // console.log(geoData.body.features[0].geometry);
    // console.log(geoData.body.features);
    // return res.send('hi');
    const images=req.files.map(f=> ({url:f.path,filename:f.filename}));
    const data=req.body;
    // console.log(data);
    // const campgroundschema=Joi.object({
    //     campground:Joi.object({
    //         title:Joi.string().required(),
    //         price:Joi.number().min(56).required(),
    //         location:Joi.string().required(),
    //         image:Joi.string().required(),
    //         description:Joi.string().required()
    //     }).required()
    // })
    // const result=campgroundschema.validate(data);
    // const msg=result.error.details.map(e=>e.message).join(',');
    // console.log(result)
    // throw new Expresserror(msg,400);
    // console.log(msg);
    // res.send('for testing purpose');
    if(!data.campground) throw new Expresserror('no that found',402);
    const n_data=new Campground({...data.campground});
    n_data.geometry=geoData.body.features[0].geometry;
    n_data.author=req.user._id;
    n_data.images=images;
    await n_data.save()
    const {_id}=n_data;    
    // .then((m)=>{
    //     console.log(m)
    // });
    // res.send('received');
    // console.log(id);
    console.log(n_data);
    req.flash('success','successfully made a campground');
    res.redirect(`/campgrounds/${_id}`);
    // res.redirect('/campgrounds')
};


module.exports.viewcamp=async (req,res)=>{
    // res.render('home.ejs');
    const {id}=req.params;
    const campground=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(campground);
    if(!campground){   
    req.flash('error','the campground doesnt exists');
        return res.redirect('/campgrounds');
    }
    // console.log(campground);
    // console.log(`this is from show campgrounds   : `,req.user);
    // if(!req.user || re)
    // const cuser=req.user;
    // console.log('from this ',cuser,campground.author,cuser.username==campground.author.username,'to this ');
    res.render('campgrounds/view.ejs',{campground});

};

module.exports.changeform=async (req,res)=>{
    // res.render('home.ejs');
    const {id}=req.params;
    // console.log(req.body);
    // console.log(camp.author);
    const images=req.files.map(f=> ({url:f.path,filename:f.filename}));
    const data=req.body;
    const camp=await Campground.findByIdAndUpdate(id,{...data.campground});
    camp.images.push(...images);

    if(data.deleteImages){
        for(let img of data.deleteImages){
            await cloudinary.uploader.destroy(img)
            console.log('deleted',img);
        }
        await camp.updateOne({ $pull: {images:{filename:{ $in :  data.deleteImages}}}});
    }
    
    
    // res.send(data);
    await camp.save();
    req.flash('success','Successfully updated the campground');
    res.redirect(`/campgrounds/${id}`);
    // res.render('campgrounds/view.ejs',{camp});

};

module.exports.deletecamp=async (req,res)=>{
    // res.render('home.ejs');
    const {id}=req.params;
    
    
    // const data=req.body;
    await Campground.findByIdAndDelete(id);

    // res.send(data);
    req.flash('success','Successfully deleted a campground');
    res.redirect(`/campgrounds`);
    // res.render('campgrounds/view.ejs',{camp});

};


module.exports.renderEditForm=async (req,res)=>{
    // res.render('home.ejs');
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp){
    req.flash('error','the campground doesnt exists');
    return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit.ejs',{camp});

};