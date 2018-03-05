//util.js

var jwt = require('jsonwebtoken');

var util = {};

util.successTrue = function (data) {
    return {
        success: true,
        message: null,
        errors: null,
        data: data
    };
};

util.successFalse = function (err, message) {
    console.log("successFalse 들어옴");
    if (!err && !message) {
        message = 'data not found';
    }
    console.log("successFalse : " + message);
    return {
        success: false,
        message: message,
        errors: (err) ? util.parseError(err) : null,
        data: null
    };
};

util.parseError = function (errors) {
    console.log("parseError 들어옴");
    var parsed = {};
    if (errors.name == 'ValidationError') {
        for (var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = { message: validationError.message };
        }
    } else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = { message: 'This username already exists!' };
    } else {
        parsed.unhandled = errors;
    }
    return parsed;
};


// middlewares
util.isLoggedin = function (req, res, next) {
    console.log("isLoggedin 확인..");
    var token = req.headers['x-access-token'];
    console.log(token);
    if (!token) {
        return res.json(util.successFalse(null, 'token is required!'));
    }
    else {
        jwt.verify(token, "MySecret", function (err, decoded) {
        //jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.json(util.successFalse(err));
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
};

module.exports = util;
