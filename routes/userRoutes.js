const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

// Protected routes (login ke baad he access kr payengey )

// jo ye rooutes h  ye admin ke liye nhi h ok ye user ke liye h user mtlb student ke liye h teacher ke liye h dono ke liye h but admin ke liye nhi h
router.get('/me',protect,userController.getMyProfile)
router.put('/me',protect,userController.updateProfile)
// Ye sare routes admin ke liye h 
router.get('/',protect,userController.getAllUsers)
router.get('/:id',protect,userController.getUserById)
router.put('/:id',protect,userController.updateProfile)  // admin kisi bhi user ka profile update kr skta h


// ab inka jo protect middleware h wo kya krta h ki ye check krta h ki user login h ya nhi h agar login h to uska data req.user m store kr deta h aur agar login nhi h to error throw kr deta h
// ab inka url kese hoga ye depends krta h ki app.js m ye route kese use ho rha h agar app.js m app.use('/api/users', userRoutes) to iska url hoga /api/users/me , /api/users/:id etc.  ok

module.exports = router


