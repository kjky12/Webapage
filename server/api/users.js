var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs"); // 암호화를 위한 모듈


// Create
router.post('/',
    function (req, res, next) {
        console.log("TETET");
        // User.findOne({}) 의 User은 상단에 정의한거..
        User.findOne({})
            .sort({ id: -1 })
            //userTmp 는 하
            .exec(function (err, userTmp) {
                if (err) {
                    res.status(500);
                    return res.json({ success: false, message: err });
                }
                else {
                    res.locals.lastId = userTmp ? userTmp.id : 0;
                    next();
                }
            });
    },

    function (req, res, next) {
        var newUserSchema = new User(req.body);
        newUserSchema.id = res.locals.lastId + 1;

        //! 데이터 암호화
        //const salt = bcrypt.genSaltSync(10); // salt값 생성, 10이 default
        //newUserSchema.password = bcrypt.hashSync(newUserSchema.password, salt);
        newUserSchema.save(function (err, userTmp) {
            console.log(userTmp);
            if (err) {
                res.status(500);
                res.json({ success: false, message: err });
            }
            else {
                res.json({ success: true, data: userTmp });
            }
        });
    }
);


module.exports = router;
