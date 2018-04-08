var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  summary: {
      type: String,
      unique: true,
  },
  url: {
      type: String,
    //   match: [/([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g, "This is not a valid URL."],
      unique: true,
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
