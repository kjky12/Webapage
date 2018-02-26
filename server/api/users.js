var express = require('express');
var router = express.Router();
var User = require('../models/users');
var mongoose = require('mongoose');
var util = require('../util');



// index
router.get('/', util.isLoggedin, function (req, res, next) {
    console.log("test1");
    User.find({})
        .sort({ username: 1 })
        .exec(function (err, users) {
            console.log("test1-1");
            res.json(err || !users ? util.successFalse(err) : util.successTrue(users));
        });
});

// create
router.post('/', function (req, res, next) {
    console.log("test2");
    var newUser = new User(req.body);

    newUser.save(function (err, user) {
        console.log("test2-1");
        console.log(user);
        res.json(err || !user ? util.successFalse(err) : util.successTrue(user));
    });
});

// show
/*
router.get('/:username', util.isLoggedin, function (req, res, next) {
    console.log("test3");
    User.findOne({ username: req.params.username })
        .exec(function (err, user) {
            res.json(err || !user ? util.successFalse(err) : util.successTrue(user));
        });
});
*/

// update
router.put('/:username', util.isLoggedin, checkPermission, function (req, res, next) {
    User.findOne({ username: req.params.username })
        .select({ password: 1 })
        .exec(function (err, user) {
            if (err || !user) return res.json(util.successFalse(err));

            // update user object
            user.originalPassword = user.password;
            user.password = req.body.newPassword ? req.body.newPassword : user.password;
            for (var p in req.body) {
                user[p] = req.body[p];
            }

            // save updated user
            user.save(function (err, user) {
                if (err || !user) return res.json(util.successFalse(err));
                else {
                    user.password = undefined;
                    res.json(util.successTrue(user));
                }
            });
        });
});

// destroy
router.delete('/:username', util.isLoggedin, checkPermission, function (req, res, next) {
    User.findOneAndRemove({ username: req.params.username })
        .exec(function (err, user) {
            res.json(err || !user ? util.successFalse(err) : util.successTrue(user));
        });
});

module.exports = router;

// private functions
function checkPermission(req, res, next) { //*
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err || !user) return res.json(util.successFalse(err));
        else if (!req.decoded || user._id != req.decoded._id)
            return res.json(util.successFalse(null, 'You don\'t have permission'));
        else next();
    });
}







// Create
/*
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
*/


module.exports = router;
