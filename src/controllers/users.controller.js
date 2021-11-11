const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const mongoose = require("mongoose");


async function create(req, res){
    const user = new User(req.body);
    // try {
        const savedUser = await user.save();
        console.log(savedUser)
        res.status(201).send(savedUser);
    // } catch (err) {
    //     res.status(400).send(err);
    // }
}

async function login(req, res) {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(403).send();
        return;
    }
    const userExist = await User.findOne({username, password});
    if(!userExist) {
        res.status(403).send();
        return;
    }
    console.log(userExist._id)
    const token = jwt.sign({id: userExist._id}, 'yarin')
    console.log({token})
    res.json({token});

}
async function getAllUsers(req, res)
{
    const users = await User.find({});
    res.send(users);
}
async function me(req, res) {
    try {
        const user =  await User.findById(req.userId);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        res.send(user)
    } catch (err) {
        res.sendStatus(500);
    }
}
async function getUser(req, res) {
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if(!user) {
            res.sendStatus(404);
        } else {
            // res.send({...user._doc, posts: posts.length})
            res.send(user);
        }
    } catch (err) {
        res.sendStatus(500);
    }
}
async function search(req, res) {
    try{
        const { username } = req.params;
        const users = await User.find({username: new RegExp (username, "ig" ) })
        res.json(users)
    } catch (e) {
        console.error(e)
        res.sendStatus(500);
    }
}
async function follow(req, res) {
    const { username } = req.params;
    const myId = req.userId;
    try {
        const whoToFollow = await User.findOne({ username });
        if(!whoToFollow) {
            res.sendStatus(400);
            return false;
        }
        await User.findByIdAndUpdate(myId,
            {$addToSet: { following: mongoose.Types.ObjectId(whoToFollow._id) } }
        );
        res.send()
    } catch(err) {
        res.sendStatus(500);
    }

}
async function unfollow(req, res) {
    const { username } = req.params;
    const myId = req.userId;
    try {
        const whoToUnfollow = await User.findOne({ username });
        if(!whoToUnfollow) {
            res.sendStatus(400);
            return false;
        }
        await User.findByIdAndUpdate(myId,
            {$pull: { following: mongoose.Types.ObjectId(whoToUnfollow._id) } }
        );
        res.send()
    } catch(err) {
        res.sendStatus(500);
    }

}


module.exports = {
    create,
    login,
    getAllUsers,
    me,
    getUser,
    follow,
    unfollow,
    search
}


// module.exports = {
//     create: (req, res)=> {
//
//     }
// };