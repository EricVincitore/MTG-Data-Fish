var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    // `title` is of type String
    title:{
        type: String
    },
    // `body` is of type String
    body: {
        type: String
    },

    user: String
});

var Comment = mongoose.model("Comment", CommentSchema);


module.exports = Comment;
