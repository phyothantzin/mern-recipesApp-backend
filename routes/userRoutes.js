import express from 'express'
import {
  getUserProfile,
  updateUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'
import cors from 'cors'

const router = express.Router()
router.all('*', cors());

// User Auth Routes
router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router
