const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        select: false, //prevents from sharing the password.
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    following: {
        type: Array,
        default: () =>[]
    },
    avatar: {
        type: String,
        default: ()=> ''
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;