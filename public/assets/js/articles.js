$(document).ready(function() {
  $("#article-container").empty();
  $("#click-card").show();
});

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
        <div class="card-header"><h5>
        <a href="https://www.nytimes.com${data[i].link}">${
        data[i].headline
      }</a></h5>
        <button type="button" class="btn btn-dark remove-btn"> Remove</button>
        <button type="button" class="btn btn-dark comment-btn seecomment-btn">Comment</button>
        </div>
        <div class="card-body">
        <p class="card-text">${data[i].description}</p>
        </div> `);
    }
  });
}

getSavedArticles();

$("#scrape-btn").on("click", function() {
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

  $.post("/saved", favorite).then(function(data) {
    console.log(data);
  });
});

$(document).on("click", ".remove-btn", function() {
  var saved = $(this)
    .parents(".card")
    .data("id");
  console.log(saved);
  var favorite = { id: saved };

  $.post("/remove-save", favorite).then(function(data) {
    console.log(data);
  });
  location.reload(true);
});

$(document).on("click", ".comment-btn", function() {
  // $(".form-control").show()

  $(".form-group").append(
    "<textarea id='comment-input' name='comment' placeholder='comment on this article'></textarea>"
  );
  // A button to submit a new note, with the id of the article saved to it
  $(".form-group").append("<button id='savenote'>Save Note</button>");

  var thisId = $(this).attr("data-id");

  $(document).on("click", "#savenote", function() {
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#comment-input").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  });
  $("#comment-input").val("");
});

$(document).on("click", "#clear-btn", function() {
  $("#article-container").empty();
  $("#click-card").hide();
});

// $(document).on("click", "seecomment-btn", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log("I hit this route", data);
//       // The title of the article
//       // $("#notes").append("<h2>" + data.title + "</h2>");
//       // // An input to enter a new title
//       // $("#notes").append("<input id='titleinput' name='title' >");
//       // // A textarea to add a new note body
//       // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // // A button to submit a new note, with the id of the article saved to it
//       // $("#notes").append(
//       //   "<button data-id='" + data._id + "' id='savenote'>Save Comment</button>"
//       // );

//       // // If there's a note in the article
//       // if (data.note) {
//       //   // Place the title of the note in the title input
//       //   $("#titleinput").val(data.note.title);
//       //   // Place the body of the note in the body textarea
//       //   $("#bodyinput").val(data.note.body);
//     });
// });
