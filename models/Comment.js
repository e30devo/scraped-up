var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
  comments: {
    type: String,
    unique: false
  },
  commentedAt: {
    type: Date,
    default: Date.now
  }
});

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;