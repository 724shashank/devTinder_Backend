const mongoose = require("mongoose");
const connectionRequest = new mongoose.Schema({

    toUserID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
    },
    fromUserID:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,

    },
    status:{
        required:true,
        type:String,
        enum:{
            values:["interested","accepted","rejected","pass"],
            message:`{VALUE} not allowed`
        }

    }

},{timeStamps:true})

module.exports = mongoose.model("ConnectionRequest",connectionRequest,"connectionRequest");