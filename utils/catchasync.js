function catchasync(func){
    return function(req,res,next){
        func(req,res,next).catch(e=>next(e));
    }
}

module.exports=catchasync;