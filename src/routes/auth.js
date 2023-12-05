const express = require("express");
const { protect, isAdmin, } = require("../middlewares/authMiddleware");
const router = express.Router();
const { 
    register, 
    getAllUsers, 
    getUser, 
    updateUser, 
    blockUser, 
    unblockUser, 
    handleRefreshToken, 
    logout, 
    forgotPasswordToken, 
    loginAdmin,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon
} = require("../controllers/user");

router.post("/register", register);
router.post("/admin-login", loginAdmin)
router.post('/logout', logout)
router.post('/forgot-password-token', forgotPasswordToken)
router.post('/cart',protect, userCart)
router.post('/cart/apply-coupon', protect, applyCoupon)

router.get('/refresh', handleRefreshToken)
router.get('/all-users',protect, isAdmin, getAllUsers)
router.get('/details-user/:id', protect, isAdmin, getUser)
router.get('/wishlist', protect, getWishList)
router.get('/cart', protect, getUserCart)

router.patch('/update-user/:id', protect, updateUser)
router.patch('/block-user/:id', protect, isAdmin, blockUser)
router.patch('/unblock-user/:id', protect, isAdmin, unblockUser)
router.patch('/password-update', protect, updateUser)
router.patch('/save-address', protect, saveAddress)

router.delete('/empty-cart', protect, emptyCart)


module.exports = router;
