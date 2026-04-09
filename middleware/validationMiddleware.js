// const { validationResult } = require('express-validator')
// exports.validationResult = (req,res,next)=>{
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//   return res.status(400).json({
//     success:false,
//     message:"Validation Error",
//     errors:errors.array().map(err=>({
//         field:err.path,
//         message:err.msg
//     }))
//   })
//     }
//     next()
// }


const { validationResult } = require('express-validator')

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};
// ye humne is liye banaya h ki jab bhi hum validation middleeare call krnge agr koi error to show kr dega nhi hogi to wo next ()
// ye middleware jab kaam krega jab koi field validation me fail hoga to ye middleware error ko catch krke usko format krke response me bhej dega
// isme humne validationResult ko import kiya h express-validator se jo ki validation ke errors ko handle krta h 
// agr koi error h to hum status 400 bhejenge jiska matlab bad request h or message me validation error show krenge or errors me hum array of errors bhejenge jisme har error ka field or message hoga