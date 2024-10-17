const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const app = express();


dotenv.config();

app.use(express.json());
app.use(cors());

connectDB();


const PORT = process.env.PORT || 7000

app.use('/api/home',userRoutes)


app.listen(PORT,()=>{
    console.log(`server is running in ${PORT}`)
})
