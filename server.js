var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var ANIMALS_COLLECTION = "animals";
var DOCTORS_COLLECTION = "doctors";
var OWNERS_COLLECTION = "owners";
var VISITS_COLLECTION = "visits";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server. 
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/animals", function(req, res) {
  db.collection(ANIMALS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get animals.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

app.get("/doctors", function(req, res) {
  db.collection(DOCTORS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get doctors.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

app.get("/owners", function(req, res) {
  db.collection(OWNERS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get owners.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

app.get("/visits", function(req, res) {
  db.collection(VISITS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get visits.");
    } else {
      res.status(200).json(docs);  
    }
  });
});