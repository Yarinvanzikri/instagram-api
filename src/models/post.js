const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    likes: {
        type: Array,
        default: () =>[]
    },
    author: {
      type: schema.Types.ObjectId,
        ref: "User",
      required: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    image : {
        type: String,
        required: true
    },
    filter : {
        type: String
    }

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;