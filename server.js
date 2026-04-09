// const express  = require('express')
// const app = express()
// const dotenv = require('dotenv')
// const cors = require('cors')
// const helmet = require('helmet')
// const morgan = require('morgan')
// const connectDB = require('./config/db')
// require('./models/User');     // ← User model pehle load hona chahiye
// require('./models/Batch');
// const authRoutes = require('./routes/authRoutes')
// const userRoutes = require('./routes/userRoutes')
// const batchRoutes = require('./routes/batchRoutes')
// // ENV Load krne ke liye hum .env file ko load kr lenge 
// dotenv.config()
// connectDB()


// // 
// app.use(helmet())
// // app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.use(morgan('dev'))
// // 
// // cors

// app.use(cors({
//   origin: '*',           // development ke liye (production mein specific origin daalna)
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.get('/',(req, res)=>{
//     res.send('All is working ')
// })

// app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/batches',batchRoutes)

// const PORT  = process.env.PORT || 5000
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })







const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');

// ====================== MODELS REGISTER (Sabse Pehle) ======================
require('./models/User');      // User model pehle
require('./models/Batch');     // Phir Batch model

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const batchRoutes = require('./routes/batchRoutes');

dotenv.config();

// MongoDB Connect
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Test Route
app.get('/', (req, res) => {
    res.send('Backend is working ✅');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/batches', batchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});