const mongoose = require('mongoose');

const DonorSchema = mongoose.Schema({
    name:{
        type:String,                
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    bloodgroup:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    diseases:{
        type:String,      
    },
    bloodpressure:{
        type:Number,
    },
    status:{
        type:Number,
        default:0
    }

},{
    timestamps:true
});
 
module.exports = mongoose.model('Donor', DonorSchema);  
