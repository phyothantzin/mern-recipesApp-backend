import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').status(401)
      throw new Error('Not authorized, token failed')
    }
  } else {
    res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').status(401)
    throw new Error('Not authorized, no token')
  }
})

export { protect }
