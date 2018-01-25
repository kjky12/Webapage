var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: { type: string, required: true, },
    username: { type: string, required: true, },
    password: { type: string, required: true, },
    name: { type: string, required: true, },
    email: { type: string, required: true, },
    passwordConfirmation: { type: string, required: true, },
    currentPassword: { type: string, required: true, },
    newPassword: { type: string, required: true, },

});

var user = mongoose.model('user', userSchema);
module.exports = user;