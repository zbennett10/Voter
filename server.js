require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes');

const app = express();

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/votedb`,
                function(error) {
                  if(error) console.log("Error connecting to mongo", error);
                  console.log("Connected to mongo");
                });


app.use(bodyParser.json()); //user body parser middleware
route(app); //connect server to routes
app.use((err,req,res,next) => {
  res.status(422).send({error: err.message});
});

//run server
app.listen(3001, () => {
    console.log("Server running on port 3001.");
  });


module.exports = app;