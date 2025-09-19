const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//DB
const DB_URI = process.env.DB_URI;

const dbConnection = async() =>{
    try {
        await mongoose.connect(DB_URI).then(()=>{
            console.log("Background Database connected Successfully")
        })
    } catch (error) {
        console.log(error);
        setTimeout(dbConnection,5000);
    }
}

module.exports=dbConnection;