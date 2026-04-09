// const jwt = require('jsonwebtoken')
// exports.protect = async  (req, res, next) => {
//     try {
//       let token; 
//       if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
//         token = req.headers.authorization.split(' ')[1]
//       }  
//       if(!token){
//         return res.status(401).json({message: "Not Authorized"})
//       }
//       const decoded = jwt.verify(token, process.env.JWT_SECRET)
//       req.user = decoded
//       next()
//     } catch (error) {
//                 return res.status(401).json({message: "Not Authorized"})
//     }
// }


// exports.authorize = (...roles)=>{
//     return (req, res, next) => {
//         if(!roles.includes(req.user.role)){
//             return res.status(403).json({message: "Access Denied"})
//         }
//         next()
//     }
// }

const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if Authorization header exists and starts with Bearer
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token found
        if (!token) {
            console.log("No token provided in request");
            return res.status(401).json({
                success: false,
                message: "Not Authorized - No token provided"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extra safety check
        if (!decoded || !decoded.id) {
            console.log("Token decoded but id not found");
            return res.status(401).json({
                success: false,
                message: "Not Authorized - Invalid token payload"
            });
        }

        // Set user in request
        req.user = decoded;
        
        console.log(`User authenticated: ${decoded.id} | Role: ${decoded.role || 'N/A'}`); // Helpful for debugging

        next();

    } catch (error) {
        console.error("JWT Authentication Error:", error.name, "-", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again."
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }

        // Default error
        return res.status(401).json({
            success: false,
            message: "Not Authorized - Authentication failed"
        });
    }
};

// Authorize middleware (isko bhi thoda better bana diya)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Extra safety: agar req.user nahi hai to pehle hi block kar do
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized - Please login first"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access Denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};


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

