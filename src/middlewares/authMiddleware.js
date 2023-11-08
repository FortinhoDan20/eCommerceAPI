const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')


const protect = asyncHandler(async(req, res, next ) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ){
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1]

                if(token){

                    // Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
                    // Get user from the token
                    req.user = await User.findById(decoded.id).select('-password')

                    next()
                }else{
                    res.status(500).json({message: "Vous n'êtes pas autorisé, no token"})
                }

               
            } catch (error) {
               
                res.status(401)
                res.status(500).json({message: "Votre token a expiré"})
            }

        }

})

const isAdmin = asyncHandler(async(req, res, next ) => {
    try {
        const { email } =  req.user
        const user = await User.findOne({ email })
        if(user.role !== "admin"){
            res.status(500).json({message: "Vous n'avez pas un rôle admin"})
        }else {
            next()
        }
    } catch (e) {
        
    }
})
module.exports = { protect, isAdmin }