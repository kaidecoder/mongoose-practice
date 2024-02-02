const mongoose = require("mongoose")
const Schema = mongoose.Schema
const model = mongoose.model

const tweetSchema = new Schema({
    title: String,
    body: String,
    author: String,
    likes: { type: Number, default: 0},
    sponsored: { type: Boolean, default: false},

},
{timestamps: true}
)

module.exports = mongoose.model("Tweets", tweetSchema)