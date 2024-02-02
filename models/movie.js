const mongoose = require("mongoose")
const Schema = mongoose.Schema
const model = mongoose.model

const movieSchema = new Schema({
    title: String,
    plot: String,
    runtime: Number,
    poster: String,
    fullplot: String,
    released: Date,
    rate: String,
    year: Number

},
{timestamps: true}
)

module.exports = mongoose.model("Movies", movieSchema)