var mongoose = require('mongoose');

//! 회원 가입 정보에 대한 구조체
var st_userSchema = mongoose.Schema({
    id: { type: Number, required: true, },
    username: { type: String, required: true, },
    password: { type: String, required: true, },
    name: { type: String, required: true, },
    email: { type: String},
    passwordConfirmation: { type: String, required: true, },

});



//model('ㅁ1', ㅁ2) : ㅁ1, ㅁ2가 똑같아야 되나본데??
var UserData = mongoose.model('st_userSchema', st_userSchema);
module.exports = UserData;