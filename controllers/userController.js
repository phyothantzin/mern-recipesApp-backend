import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

//@desc Register user and set token
//route api/users/
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({ username, email, password })

  if (user) {
    generateToken(res, user._id)

    res.status(201).header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').json({
      _id: user._id,
      name: user.username,
      email: user.email,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//@desc Register user and set token
//route api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').json({
      _id: user._id,
      name: user.username,
      email: user.email,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc Logout user and destroy cookie
//route api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').json({ message: 'Logged out successfully' })
})

//@desc Get user profile
//route api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc Update user profile
//route api/users/update
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
}
