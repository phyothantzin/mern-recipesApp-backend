import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import recipesRoutes from './routes/recipesRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

dotenv.config()
connectDB()
const port = process.env.PORT || 5500

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
var whitelist = ['https://therecipesapp.onrender.com']
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use('/api/users', userRoutes)
app.use('/api/recipes', recipesRoutes)
app.use('/api/like', likeRoutes)

const __dirname = path.resolve()
app.use('/images', express.static(path.join(__dirname, '/images')))

// if (process.env.NODE_ENV === 'production') {
//   const __dirname = path.resolve()
//   app.use(express.static(path.join(__dirname, 'frontend/dist')))

//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')),
//   )
// } else {
//   app.get('/', (req, res) => res.status(200).send('Server running'))
// }
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'https://therecipesapp.onrender.com');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.get('/', (req, res) => res.status(200).send('Server running'))
app.post('/api/upload', upload.single('image'), (req, res) =>
  res.status(200).json('image uploaded'),
)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server Running: ${port} on ${process.env.NODE_ENV} mode`))
