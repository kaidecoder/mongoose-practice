
&
MongooseJS
mongoose

Recap
Previously in class you created a MongoDB Atlas account
Even though you created that account we haven't yet used that account
In order to get you used to working with MongoDB you used my MongoDB Atlas account.
The thought process behind this is so that you see how MongoDB fits into your application
Today we are going to learn more about MONGODB itself before coming back to the Fruits and Vegetables App
CRUD, MVC, REST, INDUCES and JSX: Remember where we are going
arthur_node_jsx_diagram_photoshopped

mvc-meme

mongoose

Learning Objectives
Describe the Use Case of Databases
Describe the Format of a Document
Describe Embedding & Referencing
Create and Set Up Our Own MongoDB Database
Explain what an ODM is
Connect to Mongo via vs code editor
Create a Schema for a collection
Create a model and save it
find a specific model
update a model already in the database
remove a model already in the database
What's a Database?
Remember when we added new Fruits in Express and we would "lose" them when nodemon restarted the server?

If we were saving those Fruits in a database, they would remain there until we deleted them.

Databases are a way to organize and save, or persist, data.

There are lots of different database systems - check out this site that tracks the popularity of different database systems.

As you can see, Relational Database Management Systems (RDMS) are by far the most popular - they've been around since the 1960s. They are more commonly referred to as SQL Databases because they are designed and accessed using Structured Query Language.

However, you'll also see that MongoDB is by far the most popular NoSQL database system.

There are several varieties of NoSQL databases. MongoDB is of the document-based variety because it stores and retrieves documents.

MongoDB vs. Relational SQL Databases
Terminology

As diagramed above, there is a one-to-one mapping of the key concepts of a database.

Key Differences
Use Cases
Either a SQL database or MongoDB can be used for most applications.

However, in general:

Relational Databases are preferred in mission-critical financial applications such as banking, stock trading, etc., due to their strength of handling transactions. They are not very good however on handling data that can't be strictly organized into tables of structured columns because they have a strict schema (structure) they must adhere to.
MongoDB is preferred for storing vast amounts of unstructured data, such as in social-media type applications. MongoDB is also a great choice when prototyping applications because it is schema-less and more adaptable to change. Now I know you here schema-less and think but we have schema but the schemas we create in Mongoose are enforced by JavaScript not the Database itself, so if we ever want to change the schema we just change our code and viola 9/10 times the schema is changed and MongoDB doesn't care about the fact that the data has different rules (with 1 exception, data marked unique but we'll cover this on a later date)
More About MongoDB

MongoDB puts the "M" in the MEAN/MERN Stack, technology stacks that emphasizes the use of JavaScript on both the front-end and back-end.

Instead of SQL (Structured Query Language), MongoDB uses JavaScript as its native language for database operations.

You're going to see that working with data in MongoDB is like working with JavaScript objects.

MongoDB Documents
In MongoDB, we save and retrieve documents to and from a collection.

Lets take a look of what a MongoDB document might look like:

{
    _id: ObjectId("5099803df3f4948bd2f98391"),
    name: { first: "Alan", last: "Turing" },
    birth: ISODate("1912-06-23T00:00:00Z"),
    death: ISODate("1954-06-07T00:00:00Z"),
    contribs: [ "Turing machine", "Turing test", "Turingery" ],
    views: 1250000
}
As you can see, this format looks very much like a JavaScript object.

In fact, you'll be working with documents using JavaScript, therefore they absolutely are JS objects!

The Document _id
The _idis a special field that represents the document's unique identifier. If you're familiar with SQL databases, a document's _idis like a primary key.

MongoDB automatically creates the _idwhen documents are saved for the first time.

MongoDB uses a special ObjectIddatatype for the value of _id.

ObjectIds are JS objects, but we'll be able to use their string representation most of the time when we work with them in Mongoose.

The value that MongoDB creates for the _idis guaranteed to be globally unique.

Creating a Database and Inserting Documents
Data Modeling - Intro
Data Entities
A data entity represents a certain type of data in an application.

Examples include: User, Account, Post, Comment, Category etc.

Relationships
Relationships exist between entities, for example:

A User has many Posts; and a Post belongs to a User
This relationship is called a one-to-many.
A Post has and belongs to many Categories; and an Category has and belongs to many Posts
This relationship is called a many-to-many.
There is also a less common one-to-one relationship. For example, A User has a Profile; and a Profile belongs to a User

You will be asked to model the relationships as part the planning for your CRUD projects. Here's a link that talks more about data relationships and how to create what's called an Entity Relationship Diagram (ERD).

Database Implementation
SQL Databases
In SQL Databases, by design, there would be a table for each data entity.

Related data is joined together using SQL queries.

MongoDB
In MongoDB, unlike with SQL tables, there might not be a collection for every data entity.

Unlike in SQL, there's no requirement to break different entity types into separate collections.

The reason is that some entities are better off being embedded with its parent document instead, for example, comments that belong to a post. It would not make sense to have to query a separate comments collection to obtain the comments for a given post...

Data Modeling in MongoDB
There are two ways to model related data in MongoDB:

Using embedding, where "subdocuments" are contained inside of its document.
Using referencing, where a document contains just the related document's ObjectId.
Both approaches can be used simultaneously in the same document.

Embedded Documents
Here's what an embedding looks like:

A document in the peoplecollection:

// assume a document from a people collection
{
  _id: ObjectId("5099803df3f4948bd2e983a4"),
  name: "Joe Smith",
  contacts: [
    {
      type: "mobile",
      contact: "(555) 555-5555"
    },
    {
      type: "email",
      contact: "joe@smith.com"
    }
  ]
}
In a relational database, those contacts would have to be in a separate table.

Embedding data is more efficient than referencing data because it takes extra queries to fetch related data.

FYI, when we use Mongoose, even those subdocuments will automatically have their own _id.

Referencing Documents (linking)
Here's how the above person --< contactmodel would be implemented via referencing:

// assume a document from a people collection
{
  _id: ObjectId("5099803df3f4948bd2e983a4"),
  name: "Joe Smith",
  contacts: [
    ObjectId("5099803df3f4948bd2f98391"),
    ObjectId("5099803df3f4948bd1f97203")
  ]
}    
Two referenced documents in the contactscollection:

{
  _id: ObjectId("5099803df3f4948bd2f98391"),
  type: "mobile",
  contact: "(555) 555-5555"
}
and

{
  _id: ObjectId("5099803df3f4948bd1f97203"),
  type: "email",
  contact: "joe@smith.com"
}
As you can see, the related contacts are separate documents.

We would have to make separate queries to get to that data, although, Mongoose can do this automatically using the populatemethod.

Which Document Should Hold the "Reference"?
When referencing data in MongoDB, you can hold the ObjectIdin either document or both!

The decision depends upon the design and functionality of your application and it's not always clear-cut.

If Embedding is More Efficient, Why Reference at All?
If the amount of data can exceed the 16MB size limit for a document, an uncommon situation however - the entire body of work of Shakespeare can be stored in 5 megabytes!
When multiple parent documents need access the same child document and that child's data changes frequently. For example, a document modeling a bank account should be referenced because
If it makes sense for your application. For example, if you wanted to view all posts on your landing page, regardless of the user that posted them, it would certainly take more effort to extract the posts from each user if they were embedded. However, it would be gravy to get the posts from their own collection.
For more details regarding data modeling in MongoDB, start with this section of mongoDB's documentation or this hour long YouTube video

Built-in Validators in Mongoose: A Quick Review
Mongoose is an Object Data Modeling (ODM) library for MongoDB that provides a convenient and structured way to interact with the database, that's what we will be using in class. One of its powerful features is built-in validation, which ensures data integrity and consistency by validating data before it is saved to the database.

Built-in validators in Mongoose help maintain data integrity by enforcing specific rules on fields within a schema. They allow developers to set requirements for fields, such as required fields, unique fields, minimum or maximum values, and even custom validation functions.

For example, Mongoose provides validators such as required, unique, min, max, enum, match, and validate. These validators can be applied to various field types, including strings, numbers, dates, and arrays. By using built-in validators, developers can prevent incorrect or incomplete data from being stored in the database, thus improving the overall quality and reliability of the application.

required: Ensures that a field must have a value before a document can be saved. For example, setting required: trueon a username field ensures that a user cannot be created without a username.
unique: Ensures that a field value must be unique across all documents in the collection. This is particularly useful for fields like email addresses, where each user must have a unique email.
min and max: Enforces minimum and maximum numeric values for number fields.
enum: Specifies a list of allowed values for a field, which is especially useful when dealing with a predefined set of options.
match: Enforces that a field value must match a given regular expression pattern, which is helpful when validating formats like email addresses or URLs.
In conclusion, Mongoose's built-in validators are a powerful tool for ensuring data consistency and integrity in MongoDB-based applications. By leveraging these validators, developers can enforce specific rules and constraints on their data, reducing the likelihood of errors and improving the overall quality of the application.

Now Lets connect to our MongoDB Database with Mongoose and MongoDB Atlas
Mongoose is the go to when it comes to working with a MongoDB.
We define Mongoose schemas, which are then compiled using the mongoose.modelmethod into Models.
We use a Model to perform all CRUD for a given MongoDB collection.
Create a cloud-based MongoDB database with Atlas
While developing an application that requires a MongoDB, you can only connect to your local MongoDB engine for so long. This is because the application, once deployed, will have to connect to a MongoDB engine accessible via the Internet. So we are going to use MongoDB Atlas from the beginning so that your application data always persists in the Cloud.

Some application hosting services we deploy our projects to are capable of supplying a MongoDB. However, delaying connecting to a hosted database until the time of deployment is not ideal...

It makes sense to set up and connect to a hosted MongoDB sooner, rather than later. Doing this will ensure that any data, users, etc., created will be there upon deployment.

In addition, it's advantageous to use a service to host MongoDB databases other than the deployment service, so that you can create databases anytime you want.

The most popular service for hosting MongoDB databases, not surprisingly, is MongoDB's own Atlas. ALSO NOTE: YOU WILL ONLY DO THIS ONCE !!!!! DON'T CREATE MULTIPLE CLUSTERS




Create an Atlas Account
First you will need to signup for a free account here:


Create a New Cluster
Once logged in, Atlas will request that you create a cluster. (click on build a New cluster, if you don't see create)

Atlas allows one free cluster per account.

A cluster can contain multiple MongoDB databases - which Atlas refers to as namespaces.

Be sure to select the Cloud Provider & Region nearest to you that shows a FREE TIER AVAILABLE:


Next, in the Cluster Tier section, select the M0 Sandboxtier:


Finally, you can optionally change the name of the cluster, then click the Create Clusterbutton:


It may take several minutes for Atlas to build your cluster.




Add a User for the Cluster
Each cluster must have a user created whose credentials will be provided in the database connection string when connecting to a database.

First click the Security tab:


Click the + ADD NEW USERbutton, then enter a username, password, select the Read and write to any database option, then click the Add Userbutton also note password should be letters and number only no special characters no spaces no underscores:




Update the Whitelisted IPs
Atlas has a security feature that allows the databases to be accessed by whitelisted (approved) IP addresses only.

However, you must whitelist all IPs to ease development and deployment of your application, once you are ready to deploy you will restrict it to only your ip and the ip of your deployed server (It's not time to do that yet though)

While still in the Security tab, click IP Whitelist, then click the + ADD IP ADDRESSbutton.

In the dialog, first click ALLOW ACCESS FROM ANYWHEREthen click the Confirmbutton:




Obtain the Connection String
To obtain the connection string for your .envfile, first click the CONNECTbutton:


Select the Connect Your Application option:


Next, ensure that the Node.js driver and latest version is selected. Then click the Copybutton to add the connection string to your clipboard:




Use the Connection String in Your App
You can now paste the connection string in the app's .envfile, assigning it to a MONGO_URIenvironment variable once we are ready to set up our app:

MONGO_URI=mongodb+srv://sei:<THISISTHEPASSWORD___REMOVE___THE___CARATS>@sei-w0kys.azure.mongodb.net/<THISISTHEDATABASENAME___REMOVE___THE___CARATS>?retryWrites=true
You're almost done, but you need to update the connection string as follows:

Replace <password>with the password of the database user you created earlier.
IMPORTANT The connection string by default connects to a namespace (database) named test(...mongodb.net/test?retryWrites=true...). However, the testnamespace must be updated to your preferred namespace (database) name. For example, "movies" (...mongodb.net/movies?retryWrites=true...).
You're good to go!




Explain what is an ODM/ Intro to Mongoose
ODM stand for Object Document Model. It translates the documents in Mongo into upgraded JavaScript Objects that have more helpful methods and properties when used in conjunction with express.

Rather than use the Mongo shell to create, read, update and delete documents, we'll use an npm package called mongoose. Mongoose will allow us to create schemas, do validations and make it easier to interact with Mongo inside an express app.

Mongoose Visual

Make a Schema
A schema will allow us to set specific keys in our objects. So if we have a key of name, we won't be able to insert other keys that don't match like firstNameor names. This helps keep our data more organized and reduces the chance of errors.

We can also specify the datatypes. We can set the datatype of nameto a string, ageto a number, dateOfBirthto a Date, bffto a Boolean etc.

We can also make some fields required and we can set default values as well.

Here is a sample Schema, with many options. We'll be making a smaller variation of this

const articleSchema = new Schema(
  {
    title: { type: String, required: true, unique: true }, //can say whether we want properties to be required or unique
    author: { type: String, required: true },
    body: String,
    comments: [{ body: String, commentDate: Date }], // can have arrays of objects with specific properties
    publishDate: { type: Date, default: Date.now }, // can set defaults for properties
    hidden: Boolean,
    meta: {
      // can have properties that are objects
      votes: Number,
      favs: Number,
    },
  },
  { timestamps: true }
);
Basic Set Up
In student_examples

mkdir intro_to_mongoose
cd intro_to_mongoose
touch app.js
npm init -yand go through the prompts
npm i mongoose dotenv
touch tweet.js .gitignore .env
code .
Remember Our MongoDB information is a secret so we need to set up Environment Variables
Update .gitignoreto include .env (always do this before you commit anything in .env)
lets add our connection string into the .env
update our app.jsto add our require('dotenv').config()to the very top of the file
this places every kvp in our .envinto a javascript object called process.env



Set Up Mongoose
Inside app.js

require mongoose
require('dotenv').config()
// Dependencies
const mongoose = require("mongoose");
const Tweet = require("./tweet.js");
tell Mongoose where to connect with Mongo and have it connect with the sub-database tweets(if it doesn't exist, it will be created)
set mongoose.connectionto a shorter variable name
// Global configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;
Connect to mongo
// Connect to Mongo
mongoose.connect(mongoURI);
Getting a warning like this? depreciation

Warnings are ok, it'll still work, for now. But in later versions it may stop working and you'll have to update your code.

This should clear up the errors:

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
OPTIONAL provide error/success messages about the connections
// Connection Error/Success
// Define callback functions for various events
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("open", () => console.log("mongo connected: ", mongoURI));
db.on("close", () => console.log("mongo disconnected"));
While the connection is open, we won't have control of our terminal. If we want to regain control, we have to close the connection. Let's set leave the connection open for 5 seconds to demonstrate that the app will hang and then we'll get our close message.
Otherwise we have to press control c. When we run an express app, we typically want to leave the connection open, we don't need to get control of terminal back, we just let the app run.

// Automatically close after 5 seconds
// for demonstration purposes to see that you must use `db.close()` in order to regain control of Terminal tab
setTimeout(() => {
  db.close();
}, 5000);
The entire configuration for mongoose:
Don't memorize it, just set a bookmark and refer back to this as you need it.
note the setTimeout was just to demonstrate what db.close()does, you don't always need it
// Dependencies
const mongoose = require("mongoose");
const Tweet = require("./tweet.js");

// Global Configuration
const mongoURI = process.env.MONGO_URI;
const db = mongoose.connection;

// Connect to Mongo
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connection Error/Success - optional but can be helpful
// Define callback functions for various events
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("open", () => console.log("mongo connected: ", mongoURI));
db.on("close", () => console.log("mongo disconnected"));
Set Up Tweet Schema
In tweet.js

const mongoose = require("mongoose"); // require mongoose
const Schema = mongoose.Schema; // create a shorthand for the mongoose Schema constructor
const model = mongoose.model // shorthand for model function

// create a new Schema
// This will define the shape of the documents in the collection
// https://mongoosejs.com/docs/guide.html
const tweetSchema = new Schema(
  {
    title: String,
    body: String,
    author: String,
    likes: { type: Number, default: 0 },
    sponsored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Creating Tweet model : We need to convert our schema into a model-- will be stored in 'tweets' collection.  Mongo does this for you automatically
// Model's are fancy constructors compiled from Schema definitions
// An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB Database
// from here: https://mongoosejs.com/docs/models.html
const Tweet = model("Tweet", tweetSchema);

//make this exportable to be accessed in `app.js`
module.exports = Tweet;
Create a Document with Mongoose
In app.js

Let's make ourselves an object to insert into our database. When we connect with an express app, our data will be coming in as an object from the browser.

const myFirstTweet = {
  title: "Deep Thoughts",
  body: "Friends, I am the realest coder alive",
  author: "Arthur",
};
Tweet.create(myFirstTweet)
// if database transaction succeeds
.then((tweet) => {
  console.log(tweet)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
Let's run this with node app.js

We should see:

created via mongoose

Timestamps, deleted, and likes had default values, a unique _id has been generated

Every time we run node app.jsit will run the code, and thus insert this object over and over again. Let's not do that. Let's comment it out.

Let's insert many more tweets

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
Let's insert all these tweets:

Tweet.insertMany(manyTweets)
// if database transaction succeeds
.then((tweets) => {
  console.log(tweets)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
node app.js
and let's comment it out so we don't insert duplicates

Find Documents with Mongoose
Mongoose has 4 methods for this
find- generic
findById- finds by ID - great for Show routes!
findOne- limits the search to the first document found
where- allows you to build queries, we won't cover this today
Let's find all

Tweet.find({})
// if database transaction succeeds
.then((tweets) => {
  console.log(tweets)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
Let's limit the fields returned, the second argument allows us to pass a string with the fields we are interested in:

Tweet.find({}, "title body")
// if database transaction succeeds
.then((tweets) => {
  console.log(tweets)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
Let's look for a specific tweet:

Tweet.find({ title: "Water" })
// if database transaction succeeds
.then((tweet) => {
  console.log(tweet)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
We can also use advanced query options. Let's find the tweets that have 20 or more likes

Tweet.find({ likes: { $gte: 20 } })
// if database transaction succeeds
.then((tweets) => {
  console.log(tweets)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
Delete Documents with Mongoose
We have two copies of our first tweet and a few options to delete it

remove()danger! Will remove all instances
findOneAndRemove()- this seems like a great choice
.findByIdAndRemove()- finds by ID - great for delete routes in an express app!
Tweet.findOneAndRemove({ title: "Deep Thoughts" })
// if database transaction succeeds
.then((tweet) => {
  console.log(tweet)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
Update Documents with Mongoose
Finally, we have a few options for updating

update()- the most generic one
findOneAndUpdate()- Let's us find one and update it
findByIdAndUpdate()- Let's us find by ID and update - great for update/put routes in an express app!
If we want to have our updated document returned to us in the callback, we have to set an option of {new: true}as the third argument

Tweet.findOneAndUpdate(
  { title: "Vespa" },
  { sponsored: true },
  { new: true })
// if database transaction succeeds
.then((tweet) => {
  console.log(tweet)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
We'll see the console.logged tweet will have the value of sponsored updated to true. Without {new: true}we would get the original unaltered tweet back.

Intermediate
We can count how many tweets we have with likes greater than 20

Tweet.countDocuments({ likes: { $gte: 20 } })
// if database transaction succeeds
.then((count) => {
  console.log(count)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
We can check out all the things we can do at the Mongoose API docs

Advanced!
It has an updated query builder that chains much like jQuery.

Do a search, limit the number of returned queries to 2, sort them by title

Tweet.find({ likes: { $gte: 20 } }, "title -_id")
  .limit(2)
  .sort("title")
  .exec()
// if database transaction succeeds
.then((tweets) => {
  console.log(tweets)
})
// if database transaction fails
.catch((error) => {
  console.log(error)
})
// close db connection either way
.finally(() => {
 db.close()
})
Mongoose Cheat Sheet
HTTP Action	CRUD Operator
GET	Read
POST	Create
PUT	Update
DELETE	Delete
CREATE
/*
  .create(data, callback function(error, new doc){})
  .insertMany([data], callback function(error, new docs){})
*/
READ
/*
  .find({filter}, callback function(err, docs){})
  .findOne({filter}, callback function(err, doc){})
  .findById("id", callback function(err, doc){})
*/
UPDATE
// filter _> id, data, { new:true }  , callback
/*
  .findByIdAndUpdate("id", data, {new:true}, callback function)
  .updateOne({filter}, data, {new:true, multi: true}, callback function)
*/

// findByIdAndUpdate
// restful route update
DELETE
/*
  // this is the method you should use when delete
    .findByIdAndDelete("id", callback function(error, deleted doc){})
  // another one you COULD use
    .deleteOne({filter}, callback function(error, deleted doc){})
  // only use this IF you know exactly what you are doing
    .deleteMany({filter}, callback function(error, deleted docs){})
*/

// restful route delete
Describe REST and list the various routes
REST stands for Representational state transfer
It's just a set of principles that describe how networked resources are accessed and manipulated
Even though Mongoose Has Many Different Method in a basic REST implementation we restrict the methods to the below table
URL	HTTP Verb	Action	Used For	Mongoose Function
/things/	GET	index	Displaying a list of all things	.find
/things/new	GET	new	Display HTML form for creating a new thing	N/A
/things	POST	create	Create a new thing	.create
/things/:id	GET	show	Display a specific thing	.findById
/things/:id/edit	GET	edit	Return an HTML form for editing a thing	.findById
/things/:id	PATCH/PUT	update	Update a specific thing	.findByIdAndUpdate
/things/:id	DELETE	destroy	Delete a specific thing	.findByIdAndDelete
Making A Model with Mongoose
// 1. require mongoose
const mongoose = require("mongoose");
// 2. pull out the schema class
const Schema = mongoose.Schema;

// 3. define the schema for the model we want to make
// schema provides field validation to ensure consitent data within our database
// its the bouncer at the club
const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  friendsOnly: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Date,
    default: Date.now,
  },
});

// 4. provide the schema and make the model, a Model needs a Schema
const Post = mongoose.model("Post", PostSchema);

// 5. export the model so that it can be used in our MVC Application
module.exports = Post;
Now that you see what Mongoose and MongoDB do Look At This Diagram and Your Previous Code
arthur_node_jsx_diagram_photoshopped

Review Questions
❓ In your own words, describe the use case for Mongoose (what is it's purpose and when might you choose to use it?).

❓ A Mongoose _ is compiled into a Mongoose Model.

❓ We use a Mongoose _ to perform CRUD operations on a MongoDB Collection..




References
MongoDB homepage

MongoDB Atlas - MongoDB Cloud Hosting

MongooseJS - ODM

Copyright © Per Scholas 2024

