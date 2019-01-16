var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
module.exports = function(app) {
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    // Create a new Note in the db
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { notes: dbNote._id } },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        // If the User was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios
      .get("https://www.nytimes.com/section/politics")
      .then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        $(".css-4jyr1y").each(function(i, element) {
          // Save an empty result object
          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.headline = $(this)
            .children("a")
            .children("h2")
            .text();
          result.description = $(this)
            .children("a")
            .children("p")
            .text();
          result.link = $(this)
            .children("a")
            .attr("href");
          console.log(result.link);

          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        });
      });
    // Send a message to the client
    res.send("Scrape Complete");
  });

  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
};
