const User = require("../models/user");
const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilis/validateMongodbId");
const sendEmail = require("./email");

const register = asyncHandler(async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({ ...req.body, password: hashedPassword });
      await user.save();

      res.status(201).json({ data: user, success: true });
    } else {
      res.status(200).json({
        message: "L'email a déjà été prise Veuillez Changer l'adresse",
        success: false,
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });
    if(admin.role !== "admin" )throw new Error('Not Authorised')
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const refreshToken = await generateRefreshToken(admin._id)
      const updateUser = await User.findByIdAndUpdate(admin._id, { refreshToken: refreshToken }, { new: true })
      const token = generateToken(admin._id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000
      })
      res.json({
        success: true,
        data: { admin, token },
      });
    } else {
      res.status(500).json({ message: "Vos identifiants sont incorrects " });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const handleRefreshToken  = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('No Refresh  Token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if(!user) throw new Error('No Refresh token present in db or not matched')
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => { 
      
      if(err || user.id !== decoded.id){
        throw new Error('There is something wrong with refresh token')
      }else {
        const accessToken = generateToken(user.id)
        res.status(200).json({ accessToken })
      }
    })
   // console.log(cookie)

  } catch (e) {
    res.status(500).json({ state: false, message: e.message });
  }
});

const logout = asyncHandler(async(req, res) => {
  try {
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    
    
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
   // console.log(user);
    await User.findByIdAndUpdate(user._id, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
 
  } catch (e) {
    res.status(500).json({ state: false, message: e.message });
  }
})

const passwordUpdate = asyncHandler(async(req, res) => {
  try {
      const user = await User.findById(req.user._id)
      const oldPassword = req.body.oldPassword
      const newPassword = req.body.password

      const isMatch = await bcrypt.compare(oldPassword, user.password)

      if(isMatch){
        res.status(200).send({
          state: false,
          message: "Le mot de passe que vous avez saisie est incorrect"
      })
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findByIdAndUpdate(req.user._id, { password: hashedPassword }, { new: true })

      res.status(201).json({
        state: true,
        message: "Le mot de passe a été mis à jour avec succès"
      })
      }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ state: true, data: users });
  } catch (e) {
    res.status(500).json({ state: false, message: e.message });
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    validateMongoDbId(req.params.id)
    const user = await User.findById(req.params.id);
    res.status(200).json({ data: user, success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      await user.findByIdAndUpdate(req.params.id, req.body, { new: true });

      res.status(200).json({
        message: `Votre compte a été mis à jour avec succès`,
      });
    } else {
      res.status(500).json({ message: "Votre id n'existe plus" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const editProfile = asyncHandler(async(req, res) => {

})

const blockUser = asyncHandler(async(req, res) => {
  try {
    const block = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true })
    res.status(200).json({ data: block, success: true, message: "Votre compte est bloqué" });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
  
})
const unblockUser = asyncHandler(async(req, res) => {
  try {
    const unblock = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true })
    res.status(200).json({ data: unblock, success: true, message: "Votre compte est débloqué" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
})
const forgotPasswordToken = asyncHandler(async(req, res) => {
  try {
    
    const { email } = req.body

    const user = await User.findOne({ email })

    if(!user) throw new Error("User not found with this email")

  
      const token = await user.createPasswordResetToken()
      await user.save()
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      
      sendEmail(data);
    res.json(token);
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

const getWishList = asyncHandler(async(req, res) => {
  try {

  const { _id } = req.user

  const user = await User.findById(_id).populate('wishlist')

  res.status(200).json(user)

  } catch (e) {
    
    res.status(500).json({ message: e.message })
  }
})

const saveAddress = asyncHandler(async(req, res) => {
  try {
    const { _id } = req.user
    validateMongoDbId(_id)
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true })

    res.status(200).json(user)
  } catch (e) {
    res.status(500).json({
      message: e.message
    })
  }
})


const userCart = asyncHandler(async(req, res) => {
  try {
    const { cart } = req.body
    const { _id }  = req.user
    let = products = []
    validateMongoDbId(_id)

    const user = await User.findById(_id)

    const alreadyExistCart = await Cart.findOne({ orderby: user._id })
    if(alreadyExistCart) {
      alreadyExistCart.remove()
    }
    for (let i = 0; i < cart.length; i++){
      let object = {}
      object.product = cart[i]._id
      object.count = cart[i].count
      object.color = cart[i].color
      let getPrice = await Product.findById(cart[i]._id).select('price').exec()
      object.price = getPrice.price
      products.push(object)

    } 
    let cartTotal = 0
    for (let i = 0; i < products.length; i++){
      cartTotal = cartTotal + products[i].price * products[i].count
    }
    let newCart = await new Cart({ products, cartTotal, orderby: user?._id }).save()

    res.status(201).json(newCart)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

const getUserCart = asyncHandler(async(req, res) => {
  try {
    const { _id }  = req.user
    validateMongoDbId(_id)
    
    const cart = await Cart.findOne({ orderby: _id}).populate('products.product')

    if(!cart) {
      res.status(200).json({ message: "Le panier est vide"})
    }
    else{

      res.status(200).json(cart)
    }
  } catch (e) {
    res.status(500).json({ message: e.message})
  }
})

const emptyCart = asyncHandler(async(req, res) => {
  try {
    const { _id }  = req.user
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    const cart = await Cart.findOneAndRemove({ orderby: user._id })

    res.status(200).json(cart)
  } catch (e) {
    res.status(500).json({ message: e.message})
  }
} )

const applyCoupon = asyncHandler(async(req, res) => {
  try {
    const { coupon } = req.body
    validateMongoDbId(_id)

    const validCoupon = await Coupon.findOne({ name: coupon })

  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d"});
};
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d"});
};

module.exports = { 
  register, 
  loginAdmin, 
  getAllUsers, 
  getUser, 
  updateUser, 
  blockUser, 
  unblockUser,
  handleRefreshToken,
  logout,
  passwordUpdate,
  forgotPasswordToken,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon
 };
