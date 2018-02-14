var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs"); // 암호화를 위한 모듈



//! 회원 가입 정보에 대한 구조체
var userSchema = mongoose.Schema({
    username:
        {
            type: String,
            required: [true, "Username is required!"],
            //match: [/^.{4,12}$/, "Should be 4-12 characters!"],
            trim: true,
            unique: true
        },
    password:
        {
            type: String,
            required: [true, "Password is required!"],
            select: false
        },
    name:
        {
            type: String,
            required: [true, "Name is required!"],
            //match: [/^.{4,12}$/, "Should be 4-12 characters!"],
            trim: true
        },
    email:
        {
            type: String,
            //match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/, "Should be a vaild email address!"],
            trim: true

        }
}, {
        toObject: { virtuals: true }
    });


// hash password // 저장할때 여기 와서 암호화처리가 됨!!
userSchema.pre("save", function (next) {
    var user = this;
    console.log("설마");
    
    if (!user.isModified("password")) { // 3-1
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password); // 3-2
        return next();
    }
});

// model methods // 암호화된 데이터랑 지금 데이터랑 확인해봄
userSchema.methods.authenticate = function (password) {
    var user = this;

    console.log("!!!!!!!!!!!!!!!!!");
    console.log(password);
    console.log(user.password);
    console.log("!!!!!!!!!!!!!!!!!");
    

    var returnT = bcrypt.compareSync(password, user.password);
    console.log(returnT);
    return returnT
};

//model('ㅁ1', ㅁ2) : ㅁ1, ㅁ2가 똑같아야 되나본데??
var UserData = mongoose.model('user', userSchema);
module.exports = UserData;