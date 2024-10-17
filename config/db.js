const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,   
            useUnifiedTopology: true,
        });
        console.log('mongoDB connected successfully')
    }catch(error){
        console.error('error connecting DB')
    }
}

module.exports = connectDB;