const mongoose = require("mongoose");

// creating the schema ==> gives format
const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  awardsWon: {
    type: Number,
    min: 0,
    default: 0,
  },
  isTouring: Boolean,
  genre: {
    type: String,
    enum: ["rock", "alternative","pop","punk","nu-metal"],
  },
  
favOtherArties:{

  type: [mongoose.Schema.Types.ObjectId],
      ref:"Artist",
}

});

// creating the Model ==> tool allow use to go into the collection to create modify etc..

const Artist = mongoose.model("Artist", artistSchema); 
// internal name of the model. Always signular, capitlized and signle word. name is important here .

module.exports = Artist; // export things in ES5 or comonJS
