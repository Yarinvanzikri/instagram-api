const Post = require("../models/post.js");
const User = require("../models/user.js");
const Comment = require("../models/comment.js");
const mongoose = require("mongoose");


async function create(req, res) {
    // console.log("req: ", req.body)
    const { body ,filter} = req.body;
    const tempPost = {
        body,
        image: req.file.filename,
        author: req.userId,
        filter: filter
    }
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
        const post = await Post.findById(id).populate('author');
        res.json(post);
    } catch (e) {
        console.error(e)
    }

}

async function getAll(req, res) {
    const allPosts = await Post.find({}).populate("author");
    res.json(allPosts);
}
async function like(req, res) {
    // console.log("userid" , req.userId)
    // console.log("params", req.params)
    await Post.findByIdAndUpdate(req.params.id,
        {$addToSet: { likes: mongoose.Types.ObjectId(req.userId)}}
        );
    res.sendStatus(200);
}

async function unlike(req, res) {
    await Post.findByIdAndUpdate(req.params.id,
        {$pull: { likes: mongoose.Types.ObjectId(req.userId)}}
    );
    res.sendStatus(200);
}

async function createComment(req, res) {
    console.log(req.userId);
    console.log(req.params.id);
    console.log(req.body.content);
    const comment = new Comment({
        author: req.userId,
        post: req.params.id,
        content: req.body.content
    });
    try {
        const createdComment = await comment.save();
        res.json(createdComment);
    } catch(e) {
        console.log(e)
        res.sendStatus(400);
    }

}


async function getComments(req, res) {
    const { id } = req.params;
    try {
    const comments = await Comment.find({ post: id });
    res.json(comments);
    } catch(e) {
        res.sendStatus(500);
    }

}

module.exports = {
    create,
    getPosts,
    getPost,
    like,
    unlike,
    createComment,
    getComments,
    getAll

}