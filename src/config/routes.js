const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')
const jwt = require('jsonwebtoken')

const auth = (req, res, next)=>{
    const token = req.headers['authorization'];
    console.log(token);
    try {
        var decoded = jwt.verify(token, 'yarin');
        next();
        res.json(decoded);
    } catch (err) {
        //err
        console.log(err);
        res.status(403).send('Not Nice')
    }
}
router.post('/user', usersController.create);

router.get('/get', usersController.getAllUsers);

router.post('/sign-in', usersController.login)

router.get('/health',(req, res) => {
    res.sendStatus(200); // indication for checking if server is online.
});

module.exports = router;