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
    tel:{
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
        type:Number
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
        type:Number
    },
    status:{
        type:Number,
        default:0
    }

},{
    timestamps:true
});

const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;
