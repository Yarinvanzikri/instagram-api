const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const postsController = require('../controllers/post.contoroller');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const fileName = (Math.random() + 1).toString(36).substring(7);
        cb(null, fileName+ '.' + extension);
    }
})
const upload = multer({ storage });


const auth = (req, res, next)=>{
    const token = req.headers['authorization'];
    console.log(token);
    try {
        const user = jwt.verify(token, 'yarin'); // check if the key is matched and the token created ny this key
        req.userId = user.id
        next();
    } catch (err) {
        //err
        console.log(err);
        res.status(403).send()
    }
}

router.get('/user/me', auth, usersController.me);

router.get('/post', postsController.getAll);
router.post('/post', auth, upload.single('image'), postsController.create);

router.post('/user', usersController.create);

router.get('/get', usersController.getAllUsers); //change with tirgul system to user

router.post('/sign-in', usersController.login);

router.get('/health', (req, res) => {
    res.sendStatus(200); // indication for checking if server is online.
});

module.exports = router;