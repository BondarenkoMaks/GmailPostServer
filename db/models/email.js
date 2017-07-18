const mongoose = require("../../db").mongoose;

const emailSchema = mongoose.Schema({
    subject: {
        type: String
    },
    message: {
        type: String
    },
    emailTo: {
        type: String
    },
    emailFrom: {
        type: String
    }
    //,
   // createdAt  : {type : Date, default : Date.now}
});

let Email = module.exports = mongoose.model("Email", emailSchema);
