const mongoose = require("mongoose");
const Artist = require("./artist.model");

// creating the schema ==> gives format
const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  releaseDate: {
    type: Date,
    require: true,
  },

  //create realtionship with other collection
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    require: true,
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
