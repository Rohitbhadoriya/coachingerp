const express  = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
// ENV Load krne ke liye hum .env file ko load kr lenge 
dotenv.config()
connectDB()


// 
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

// test
app.get('/',(req, res)=>{
    res.send('All is working ')
})

app.use('/api/auth', authRoutes)
const PORT  = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

