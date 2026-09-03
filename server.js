try {
  process.loadEnvFile();
} catch (error) {
  console.log("no .env found, using default variables if any");
}

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/artist-db")
  .then(() => {
    console.log("connected to the database yeah!");
  })
  .catch(() => {
    console.log("error connetecting to the database");
  });

const app = express();

// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(
  cors({
    origin: "*",
  }),
);

// below two configurations will help express routes at correctly receiving data.
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array

// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" });
});

app.get("/test/:userId", (req, res, next) => {
  console.log("req.body", req.body);
  console.log("req.params", req.params);
  console.log("req.query", req.query);

  res.json({ message: "all good here from / test!" });
});

//* routes fro Artists
const Artist = require("./models/artist.model");

app.post("/artists", (req, res, next) => {
  console.log(req.body);

  Artist.create({
    name: req.body.name,
    awardsWon: req.body.awardsWon,
    isTouring: req.body.isTouring,
    genre: req.body.genre,
  })
    .then(() => {
      console.log("artist created");
      res.send("artist created all good");
    })
    .catch((error) => {
      console.log("error", error);
      res.status(500).json({
        message: "Error creating artist",
        error: error.message,
      });
    });
});

app.get("/artists", (req, res, next) => {
  Artist.find(req.query) //  for small filter, can be also :Artist.find({})
    .select({ name: 1, awardsWon: 1 }) // only sending these two properties to client
    .sort({ name: 1 }) // same as mongoCompass

    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
});

//get one by ID
app.get("/artists/:artistId", async (req, res, next) => {
  try {
    const response = await Artist.findById(req.params.artistId);
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//edit

app.put("/artists/:artistId", async (req, res, next) => {
  console.log(req.params);
  console.log(req.body);

  try {
    const response = await Artist.findByIdAndUpdate(
      req.params.artistId,
      {
        name: req.body.name,
        awardsWon: req.body.awardsWon,
        isTouring: req.body.isTouring,
        genre: req.body.genre,
      },
      {
        returnDocument: "after", // give the document after the update was applied
        runValidators: true, // check schema validators before making modifiations
      },
    );

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//routes for songs
const Song = require("./models/song.model");

app.post("./songs", async (req, res, next) => {
  console.log(req.body);
  res.send("all good in post/songs");

  try {
    await Song.create({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      artist: req.body.artist,
    });
    res.send("song created!");
  } catch (error) {
    console.log(error);
  }
});

app.get("./songs/:songId", async (req, res, next) => {
  try {
    const response = await Song.findById(req.params.songId).populate({
      path: "artist",
      select: { name: 1, isTouring: 1 },
    });

    //.poputlate("artist", "name"). same way to only show one of the property
    //.poputlate("artist", "name isTouring" ) to show more than one of property

    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

app.get("./songs", async (req, res, next) => {
  try {
    const response = await Song.findById()
      .populate("artist")
      .populate({
        path: "collaboratingArtists",
        sort: { awardsWon: -1 },
        limit: 1,
      });

    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

//nested populate
app.get("./songs", async (req, res, next) => {
  try {
    const response = await Song.findById()
      .populate({
        path: "artist",
        populate: {
          path: "favOtherArtist",
        },
      })

      .populate({
        path: "collaboratingArtists",
        sort: { awardsWon: -1 },
        limit: 1,
      });

    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// server listen & PORT
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
