const express = require("express");
const { protect, isAdmin, } = require("../middlewares/authMiddleware");
const router = express.Router();
const { 
    register, 
    login, 
    getAllUsers, 
    getUser, 
    updateUser, 
    blockUser, 
    unblockUser, 
    handleRefreshToken, 
    logout, 
    forgotPasswordToken 
} = require("../controllers/user");

router.post("/register", register);
router.post("/login", login)
router.post('/logout', logout)
router.post('/forgot-password-token', forgotPasswordToken)

router.get('/refresh', handleRefreshToken)
router.get('/all-users',protect, isAdmin, getAllUsers)
router.get('/details-user/:id', protect, isAdmin, getUser)

router.patch('/update-user/:id', protect, updateUser)
router.patch('/block-user/:id', protect, isAdmin, blockUser)
router.patch('/unblock-user/:id', protect, isAdmin, unblockUser)
router.patch('/password-update', protect, updateUser)


module.exports = router;
