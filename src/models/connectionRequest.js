const mongoose = require("mongoose");
const connectionRequest = new mongoose.Schema(
  {
    toUserID: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
      
    },
    fromUserID: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    status: {
      required: true,
      type: String,
      enum: {
        values: ["interested", "accepted", "rejected", "ignore"],
        message: `{VALUE} not allowed`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.index({ _id: 1, toUserID: 1, status: 1 }); 
connectionRequest.index({ fromUserID: 1, status: 1 });
connectionRequest.index({ toUserID: 1, status: 1 });
connectionRequest.index({ fromUserID: 1,toUserID: 1});
//create index is for pure mongoDB driver and we use only "index" while using mongoose framework and we define it in schema for query optimization
//single compound index and for multiple compound Index we write as compoundIndexes and it expects an array of compoundIndex one compound index looks like { _id:1,toUserID:1,status:1} this whole object.

module.exports = mongoose.model(
  "ConnectionRequest",
  connectionRequest,
  "connectionRequest"
);
