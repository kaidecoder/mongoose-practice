require("dotenv").config();

//dependencies
const mongoose = require("mongoose");
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const app = express()
const Tweet = require("./models/tweet");
const movieRoute = require("./routes/movie")


//global configuration
// const mongoURI = process.env.DB_URL;
// const db = mongoose.connection;

// //connect to mongo
// mongoose.connect(mongoURI);

port = 3000

//view engine
app.set("view engine", "ejs");

// app.use(express.json())
// app.use(express.urlencoded( {extended: true}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/movies", movieRoute)

app.use((req, res, next) => {
    const error = new Error("Not found");
    //error.status is correct
    error.status = 404;
    //forward the request and attach the error msg
    res.render("404");
    // next(error);
  });
  
  //this handles all kinds of errors, not just 404
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });

//When we connect as an express app, our data will be coming in to the database as an object from the browser.
const myFirstTweet = {
    title: "Deep Thoughts",
    body: "Friends, I am the realest coder alive",
    author: "Arthur",
};
//
// Tweet.create(myFirstTweet)
// .then((tweet) => {
    //     console.log(tweet)
    // })
    // .catch((error => {
//     console.log(error)
// }))
// .finally(() => {
//     db.close()
// })

const manyTweets = [
  {
    title: "Deep Thoughts",
    body: "Friends, I am the realest coder alive",
    author: "Arthur",
  },
  {
    title: "Sage Advice",
    body: "Friends, I am awesome and you are too",
    author: "Arthur",
    likes: 20,
  },
  {
    title: "Is TI the Jadakiss of the South",
    body: "TI is severely underrated and we need to fix that expeditiously",
    author: "Arthur",
    likes: 40,
  },
  {
    title: "Crypto",
    body: "Friends, I have spent $2300 to be one of the first people to own a random jpeg and that makes me cool",
    author: "Arthur",
    likes: 162,
  },
  {
    title: "Confusion",
    body: "Friends, why do you just respond with the word `dislike`? Surely you mean to click the like button?",
    author: "Arthur",
    likes: -100,
  },
  {
    title: "Vespa",
    body: "Friends, my Vespa has been upgraded to run on old french fry oil. Its top speed is now 11 mph",
    author: "Arthur",
    likes: 2,
  },
  {
    title: "Licensed",
    body: "Friends, I am now officially licensed to teach yogalates. Like this to get 10% off a private lesson",
    author: "Arthur",
    likes: 3,
  },
  {
    title: "Water",
    body: "Friends, I have been collecting rain water so I can indulge in locally sourced raw water. Ask me how",
    author: "Arthur",
  },
];

//   Tweet.insertMany(manyTweets)
//   .then(tweets => {
//     console.log(tweets)
//   })
//   .catch(error => {
//     console.log(error)
//   })
//   .finally(() => {
//     db.close()
//   })

//find documents with Mongoose - 4 methods
//find - generic to find all documents
//findById - finds by ID - great for Show routes
//findOne - limits the search to the first document found

//NOTE: find all documents
// Tweet.find({})
//   .then((tweets) => {
//     console.log("All of em", tweets);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => {
//     db.close();
//   });

// //NOTE: Choose which fields you want to print out
// Tweet.find({}, "title body")
//   .then((tweets) => {
//     console.log("title & body only", tweets);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => {
//     db.close();
//   });

// //NOTE: Find a specific tweet - by title
// Tweet.find({ title: "Water" })
//   .then((tweet) => {
//     console.log(tweet);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => {
//     db.close();
//   });

// //NOTE: Tweets with 20 or more likes
// Tweet.find({ likes: { $gte: 20 } })
//   .then((tweet) => {
//     console.log(tweet);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => {
//     db.close();
//   });

// //NOTE: How to delete documents with mongoose
// //remove() This removes ALL instances
// //findOneAndDelete()
// //FindByIdAndRemove() - great for delete routes

// //NOTE: find a tweet by ID
// Tweet.findById('65bc07abcfea624af83488b7')
//   .then((tweet) => {
//     console.log("I found it", tweet);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
//   .finally(() => {
//     db.close();
//   });

//NOTE: Find all tweets by title and delete them all
// Tweet.deleteMany({title: "Is TI the Jadakiss of the South"})
// .then(tweets => {
//     console.log("delete many", tweets)
// })
// .catch(err => {
//     console.log(err)
// })
// .finally(() => {
//     db.close()
// })

//update
//update()
//fineOneAndUpdate()
//findByIdAndUpdate() - great for update/put routes in express
//..If we want to have our updated document returned to us in the callback, we have to set an option of {new: true}as the third argument


//NOTE: Find one tweet and update it
// Tweet.findOneAndUpdate(
//     {title: "Vespa"},
//     {sponsored: true},
//     {new: true}
//     )
//     .then(tweet => {
//         console.log("find and update", tweet)
//     })
//     .catch(err => {
//         console.log(err)
//     })
//     .finally(() => {
//         db.close()
//     })

//NOTE: Find a tweet by the id and update it
// Tweet.findByIdAndUpdate(
//         { _id:'6392352a629fa85f9f98b1c4' },
//         { author: "Tishana" },
//         { new: true })
//       // if database transaction succeeds
//       .then((tweet) => {
//         console.log(tweet)
//       })
//       // if database transaction fails
//       .catch((error) => {
//         console.log(error)
//       })
//       // close db connection either way
//       .finally(() => {
//        db.close()
//       })    

// NOTE: Count how many documents have likes greater than 20, and titled "Sage Advice"
// Tweet.countDocuments({ likes: { $gte: 20 }, title: "Sage Advice" })
// // if database transaction succeeds
// .then((count) => {
//   console.log(count)
// })
// // if database transaction fails
// .catch((error) => {
//   console.log(error)
// })
// // close db connection either way
// .finally(() => {
//  db.close()
// })

//exec() method of the Mongoose API is used on the Query objects. It allows us to execute the query operation to get the resulted data.
//NOTE: Find tweets with a like count greater than 20, limit to two tweets, sort by title, and only show the title and id
// Tweet.find({ likes: { $gte: 20 } }, "title _id")
//   .limit(2)
//   .sort("title")
//   .exec()
// // if database transaction succeeds
// .then((tweets) => {
//   console.log(tweets)
// })
// // if database transaction fails
// .catch((error) => {
//   console.log(error)
// })
// // close db connection either way
// .finally(() => {
//  db.close()
// })

//connection error/success - optional but helpful
// db.on("error", (err) => console.log(err.message + " is mongoDB not running?"));
// db.on("open", () => console.log("mongo connected: "));
// db.on("close", () => console.log("mongo disconnected"));

const start = async () => {
    try {
      await mongoose.connect(process.env.DB_URL);
  
      app.listen(port, () => {
        console.log(`Listening for requests on port ${port}, DB started `);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  start();