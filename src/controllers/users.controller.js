const User = require('../models/user');
const jwt = require('jsonwebtoken');


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
module.exports = {
    create,
    login,
    getAllUsers
}


// module.exports = {
//     create: (req, res)=> {
//
//     }
// };