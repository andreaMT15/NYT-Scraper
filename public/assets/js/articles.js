function getArticles() {
  $("#article-container").empty();
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#article-container").append(`<div class="card" "data-id-${
        data[i]._id
      }">
        <div class="card-header">
        <a href="https://www.nytimes.com${data[i].link}">${data[i].headline}</a>
        <a href='#' class="btn btn-dark save-btn">Save Article </a>
        </div>
        <div class="card-body">
        <p class="card-text">${data[i].description}</p>
        </div> `);
    }
  });
}
getArticles();

$("#scrape-btn").on("click", function() {
  console.log("about to hit ajax call for scrape!!");
  $.get("/scrape").then(function() {
    location.reload(true);
  });
});

$(document)
  .on("click", ".save-btn", function() {
    var article = {
      headline: $(".card-header").val(),
      description: $(".card-body").val(),
      link: $("card-header").val()
    };
    $.ajax({
      method: "POST",
      url: "/saved",
      data: article
    });
  })
  // With that done
  .then(function(data) {
    // Log the response
    console.log(data);
  });
