const Post = require("../models/post.js");
const User = require("../models/user.js");


async function create(req, res) {
    console.log(req.file);
    const { body } = req.body;
    const tempPost = {
        body,
        image: req.file.filename,
        author: req.userId
    }
    console.log(tempPost)
    console.log(req.body)
    const post = new Post(tempPost);
    try {
        const savedPost = await post.save();
        res.status(201).send(savedPost);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Could not save post' });
    }
}
async function getPosts(req, res) {
    try {
        const { username } =  req.params;
        const user = await User.findOne({username});
        const posts = await Post.find({author: user._id}).populate('author');
        res.send(posts);
    } catch (e) {
        console.error(e)
    }

}
async function getPost (req, res) {
    try {
        const { id } = req.params;
        console.log(id)
        const post = await Post.findById(id);
        console.log(post)
        res.send(post);
    } catch (e) {
        console.error(e)
    }

}

async function getAll(req, res) {
    const allPosts = await Post.find({}).populate("author");
    res.json(allPosts);
}

module.exports = {
    create,
    getPosts,
    getPost,
    getAll

}