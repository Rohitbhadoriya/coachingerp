const jwt = require('jsonwebtoken')
exports.protect = async  (req, res, next) => {
    try {
      let token; 
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
      }  
      if(!token){
        return res.status(401).json({message: "Not Authorized"})
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
                return res.status(401).json({message: "Not Authorized"})
    }
}
// agr sirf admin ko access dena hai to
// exports.admin = (req, res, next) => {
//     if(req.user.role !== 'admin'){
//         return res.status(403).json({message: "Admin Access Only"})
//     }
//     next()
// }


// agr admin or teacher dono ko access dena hai to
// exports.adminOrTeacher = (req, res, next) => {
//     if(req.user.role !== 'admin' && req.user.role !== 'teacher'){
//         return res.status(403).json({message: "Admin or Teacher Access Only"})
//     }
//     next()
// }

exports.authorize = (...roles)=>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access Denied"})
        }
        next()
    }
}