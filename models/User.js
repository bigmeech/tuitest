var mongoose = require(__("lib/database.js"));
var ObjectId = mongoose.Schema.ObjectId;
var hasher = require("hash-password-default");

var UserSchema = new mongoose.Schema({
    id:Number,
    firstname:{ type:String },
    lastname:{ type:String },
    email:{ type:String, unique:true},
    hash:{ type:String },
    bio:{ type:String }
});


UserSchema.virtual("password").get(function(){
    return this.hash;
});

UserSchema.virtual("password").set(function(password){
    this.hash = hasher.hashPassword(password);
});

module.exports = mongoose.model('User', UserSchema);
