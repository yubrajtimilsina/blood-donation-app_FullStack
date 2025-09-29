const mongoose = require("mongoose");

const ProspectSchema = mongoose.Schema({
    name:{
        type:String,
         required:true
        },
    email:{
        type:String,
         required:true
    },
    address:{
        type:String
    },
    tel:{
        type:String
    },
    bloodgroup:{
        type:String,
            required:true
    },
    weight:{
        type:Number
    },
    date:{type:String},
    diseases:{type:String},
    age:{type:Number},
    bloodpressure:{
        type:Number,
        required:true
    },
    status:{type:Number, default:0}
})

module.exports=mongoose.model("Prospect", ProspectSchema);