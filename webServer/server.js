var express = require('express');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,username,password');
  next();
});

var url = "mongodb://localhost:27017/";

app.get('/toplist', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("keyTracker");

    //Getting the users with most keypresses
    dbo.collection("users").find({},
      { fields: { "username": 1, "total": 1, _id: 0 } })
      .sort({ total: -1 })
      .limit(10)
      .toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        res.status(200);
        res.send(result);
      });
  });
});


app.get('/getdata', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("keyTracker");

    //getting data for one user
    var query = { username: req.header("username"), password: req.header("password") };
    dbo.collection("users").findOne(query, function (err, result) {
      if (err) throw err;
      if (result !== null) {
        res.status(200);
        res.send(result.data);
      } else {
        res.status(401);
        res.send();
      }
      db.close();
    });

  });
});


app.post('/saveclicks', function (req, res) {
  var body = req.body;
  body.data = JSON.parse(body.data);
  var userdata;
  var failed = true;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("keyTracker");

    //Checking if user exist
    dbo.collection("users").findOne({ "username": body.username, "password": body.password },
      function (err, result) {
        if (err) throw err;
        if (result !== null) {
          userdata = result;
          failed = false;
        }
        db.close();

        //if user exist
        if (!failed) {
          MongoClient.connect(url, function (err, db) {
            var dbo = db.db("keyTracker");
            var newTotal = 0;
            for (let [key, value] of Object.entries(body.data)) {
              console.log("key: " + key);

              //saving total new clicks
              newTotal += value;
              //update amount of key presses for one key
              dbo.collection("users").updateOne(
                { "username": body.username },
                { $inc: { ['data.' + key]: value } },
                function (err, result) {
                  if (err) throw err;
                });
            }

            //updating total new clicks
            dbo.collection("users").updateOne(
              { "username": body.username },
              { $inc: { total: newTotal } },
              function (err, result) {
                if (err) throw err;
              });

            db.close();
          });
        }
        if (!failed) {
          res.status(202);
          res.send();
        } else {
          res.status(401);
          res.send();
        }
      });
  });
})


app.post('/createuser', function (req, res) {
  var userExist = true;
  var success = false;
  var body = req.body;

  MongoClient.connect(url, function (err, db) {

    if (err) throw err;
    var dbo = db.db("keyTracker");

    //Checking if user exist
    dbo.collection("users").findOne({ "username": body.username }, function (err, result) {
      if (err) throw err;
      if (result !== null) {
        console.log(result);
        userExist = true;
      } else {
        userExist = false
      }
      db.close();

      if (!userExist) {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("keyTracker");

          //creating user if it dosent exist
          userObject = {
            "username": body.username,
            "password": body.password,
            "total": 0,
            "data": {}
          }
          dbo.collection("users").insertOne(userObject, (err, res) => {
            if (err) {
              throw err
            }
            db.close();
          });

        });
      }
      if (userExist) {
        res.status(409);
        res.send();
      } else {
        res.status(200);
        res.send();
      }
    });
  });
})

app.post('/auth', function (req, res) {
  //checking if username password combo is valid
  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("keyTracker");
    var query = { username: req.body.username, password: req.body.password }

    dbo.collection("users").findOne(query, function (err, result) {
      if (result !== null) {
        res.status(200);
      } else {
        res.status(401);
      }
      res.send();
    });
  });
});


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
})