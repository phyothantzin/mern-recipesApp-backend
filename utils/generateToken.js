import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })

  res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com').cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  })
}

export default generateToken
