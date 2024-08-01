const express=require('express');
const router=express.Router();
// const catchasync=require('../utils/catchasync');
const catchasync=require('../utils/catchasync');
const Expresserror=require('../utils/apperror');
// const path=require('path');
const Campground=require('../models/campground');
// router.engine('ejs',ejsmate);
const {campgroundschema}=require('../schemas');
const {Isloggedin,IsAuthor,validatecampground}=require('../middleware');
// router.set('view engine','ejs');
// router.set('views',path.join(__dirname,'../views'));
const campgrounds=require('../controllers/campground');
const multer  = require('multer');
const {storage}=require('../cloudinary');
const upload = multer({ storage})

router.route('/')
                .get(catchasync(campgrounds.index))
                .post(Isloggedin,upload.array('image'),catchasync(campgrounds.postCampground));
                // .post(upload.array('image'),(req,res)=>{
                //     // console.log(req.body,req.file);
                //     console.log(req.body,req.files);
                //     res.send('ok!!!!');
                // })


router.get('/create',Isloggedin,catchasync(campgrounds.renderNewForm));
router.route('/:id')
                    .get(catchasync(campgrounds.viewcamp))
                    .put(Isloggedin,IsAuthor,upload.array('image'),validatecampground,catchasync(campgrounds.changeform))
                    .delete(Isloggedin,IsAuthor,catchasync(campgrounds.deletecamp));

router.get('/:id/edit',Isloggedin,IsAuthor,catchasync(campgrounds.renderEditForm));

module.exports=router;
