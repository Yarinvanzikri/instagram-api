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

async function deletePost(req, res) {
    try{
        const { id } = req.params;
        // console.log("deleteParams ", id);
        await Post.where().findOneAndDelete({_id: mongoose.Types.ObjectId(id)});
        res.status(200).send(`Post ${id} Have Been Deleted`);
    }catch (e) {
        console.error(e);
        res.status(400);

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
    // console.log(req.userId);
    // console.log(req.params.id);
    // console.log(req.body.content);
    const comment = new Comment({
        author: req.userId,
        post: req.params.id,
        content: req.body.content
    });
    try {
        let createdComment = await comment.save();
        createdComment = await Comment.findById(createdComment._id).populate('author')
        res.json(createdComment);
    } catch(e) {
        console.log(e)
        res.sendStatus(400);
    }

}


async function getComments(req, res) {
    const { id } = req.params;
    try {
    const comments = await Comment.find({ post: id }).populate("author");
    res.json(comments);
    } catch(e) {
        res.sendStatus(500);
    }
}
async function commentDelete(req, res) {
    const { id } = req.params;
    // console.log('req', req)
    // console.log("id-delete-comment-controller::", id)
    try{
        await Comment.where().findOneAndDelete({_id: mongoose.Types.ObjectId(id)});
        res.status(200).send(`Comment ${id} Have Been Deleted`);
    }catch (e) {
        console.error(e)
        res.sendStatus(400)
    }}



module.exports = {
    create,
    getPosts,
    getPost,
    deletePost,
    like,
    unlike,
    createComment,
    getComments,
    commentDelete,
    getAll

}