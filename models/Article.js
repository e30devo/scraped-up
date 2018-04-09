var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  summary: {
    type: String,    
  },
  url: {
    type: String,
  },
  saved: {
    type: Boolean,
    default: false
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments"
    }
  ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
