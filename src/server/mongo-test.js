var MongoClient = require("mongodb").MongoClient;

// Connect to the db
MongoClient.connect(
  "mongodb://localhost:27017/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    
    dbo.collection("Persons", function(err, collection) {
      collection.insertOne({ id: 1, firstName: "Steve", lastName: "Jobs" });
      collection.insertOne({ id: 2, firstName: "Bill", lastName: "Gates" });
      collection.insertOne({ id: 3, firstName: "James", lastName: "Bond" });

      dbo.collection("Persons").countDocuments(function(err, count) {
        if (err) throw err;

        console.log("Total Rows: " + count);
      });
    });
  }
);
