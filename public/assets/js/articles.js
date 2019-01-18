function getArticles() {
  $("#article-container").empty();
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#article-container").append(`<div class="card" data-id=${data[i]._id}>
        <div class="card-header">
        <a href="https://www.nytimes.com${data[i].link}">${data[i].headline}</a>
        <button type="button" class="btn btn-dark save-btn">Save Article </button>
        </div>
        <div class="card-body">
        <p class="card-text">${data[i].description}</p>
        </div> `);
    }
  });
}
getArticles();

function getSavedArticles() {
  $.getJSON("/saved-articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#saved-container").append(`<div class="card" data-id=${data[i]._id}>
        <div class="card-header">
        <a href="https://www.nytimes.com${data[i].link}">${data[i].headline}</a>
        <button type="button" class="btn btn-dark remove-btn"> Remove from Saved </button>
        <button type="button" class="btn btn-dark save-btn">Comments </button>
        </div>
        <div class="card-body">
        <p class="card-text">${data[i].description}</p>
        </div> `);
    }
  });
}

getSavedArticles();

$("#scrape-btn").on("click", function() {
  console.log("about to hit ajax call for scrape!!");
  $.get("/scrape").then(function() {
    location.reload(true);
  });
});

$(document).on("click", ".save-btn", function() {
  var saved = $(this)
    .parents(".card")
    .data("id");
  console.log(saved);
  var favorite = { id: saved };

  $.post("/saved", favorite).then(function(tom) {
    console.log("we got this back@!", tom);
  });
});

$(document).on("click", ".remove-btn", function() {
  var saved = $(this)
    .parents(".card")
    .data("id");
  console.log(saved);
  var favorite = { id: saved };

  $.post("/remove-save", favorite).then(function(tom) {
    console.log("we got this back@!", tom);
  });
  location.reload(true);
});
