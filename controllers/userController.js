const User = require('../models/User')
// get all users for admin 
exports.getAllUsers = async (req, res)=>{
    try {
        const {role} = req.query;  // role= teacher chae wo role student ho wo sare ke sare aako dikha dikha dega admin ko 
        let query = {}
        if(role){
            query.role = role
        }
        // yha ye kya work kr rha h bato qyery.role = agr esa h to wo kya krge aapko qery me role add krna hoga agr role query me h to 
        // ab y query kya h kya query ki jgh hun or kuch use kr skte ho kya h but isme ek problem h ki hume phir 
        // ese krna pass krna higa  const {teacher} = req.teacher ese krna se kya hoga esa krne se aap sirf teacher ko he filer kr pangey smj gaye aap 
        // 

        const users = await User.find(query)
        .select('-password')
        .sort({createdAt: -1})
        res.json(users)
    } catch (error) {
          res.status(500).json({message: error.message})
        
    }
}
// get single user by id
 exports.getUserById = async (req, res) =>{
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({message: "User Not Found"})
        }
        res.json(user)
    } catch (error) {
         res.status(500).json({message: error.message})
    }
 }


 // Get Current user logging profile 
 exports.getMyProfile = async(req,res) =>{
    try {
        const user  = await User.findById(req.user.id).select('-password')
        if(!user){
            return res.status(404).json({message: "User Not Found"})
        }
        res.json(user)
    } catch (error) {
      res.status(500).json({message: error.message})  
    }

 }


 // update user profile 
 exports.updateProfile  = async(req, res) =>{
    try {
        const {name,phone} = req.body
        const updateUser = await User.findByIdAndUpdate(req.user.id,
            {name,phone},
            {new:true, runValidators:true}

        ).select('-password')
        res.json({
            message:'Profile Update Suceesfully',
            user:updateUser
        })
    } catch (error) {
        res.status(500).json({message: error.message})  
    }
 }
// Admin can update user or role details 
exports.updateUser = async(req,res)=>{
    try {
        const {name,phone,role} = req.body
        const user = await User.findByIdAndUpdate(req.params.id,
            {name,phone,role},
               {new:true, runValidators:true}

        ).select('-password')
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }
        res.json({
            message:"User Update SucessFully",
            user
        })
    } catch (error) {
        res.status(500).json({message: error.message})  
    }
}
// Delete User by Admin
exports.deleteUser = async(req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id).select('-password')
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }
        res.json({
            message:"User Deleted SucessFully",
            user
        })
    } catch (error) {
        res.status(500).json({message: error.message})  
    }
}



// Deactivate User by Admin
exports.deactiVateUser = async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            active:false
        },{new:true}).select('-password')
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }
        res.json({
            message:"User Deactivated SucessFully",
            user
        })
    } catch (error) {
        res.status(500).json({message: error.message})  
    }
}

// Activated by Admin
exports.activeUser = async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            active:true
        },{new:true}).select('-password')
        if(!user){
            return res.status(404).json({message:'User Not Found'})
        }
        res.json({
            message:"User Activated SucessFully",
            user
        })
    } catch (error) {
        res.status(500).json({message: error.message})  
    }
} 

// multiple user Add krna ho by admin 

// exports.addMultipleUsers = async(req,res)=>{
//     try {
//         const {users} = req.body
//         const createdUsers = await User.insertMany(users)
//         res.json({
//             message:"Users Created SucessFully",
//             users: createdUsers
//         })
//     } catch (error) {
//         res.status(500).json({message: error.message})  
//     }
// }


// jese ki maan lo kisi lecturted approved krna 

// exports.approvedLectures = async(req,res)=>{
//     try {
//         const {lecturesId} = req.body
//         const lectures = await lectures.findByIdAndUpdate(lecturesId,{
//             approved:true
//         },{new:true})
//         res.json({
//             message:"Lecture Approved SucessFully",
//             lectures
//         })
//     } catch (error) {
//         res.status(500).json({message: error.message})  
//     }
// }
