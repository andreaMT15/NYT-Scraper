$(document).ready(function() {
  $("#article-container").empty();
  $("#click-card").show();
});

function getArticles() {
  $.getJSON("/articles", function(data) {
    $("#article-container").empty();
    for (var i = 0; i < data.length; i++) {
      $("#article-container").append(`<div class="card" data-id=${data[i]._id}>
        <div class="card-header">
        <a href="https://www.nytimes.com${data[i].link}">${data[i].headline}</a>
        <button type="button" class="btn btn-light save-btn">Save Article </button>
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
      $(".saved-articles").append(`<div class="card" data-id=${
        data[i]._id
      } id=article${i}>
        <div class="card-header saved-title"><h5>
        <a href="https://www.nytimes.com${data[i].link}">${
        data[i].headline
      }</a></h5>
        <button type="button" class="btn btn-light remove-btn"> Remove</button>
        <button type="button" class="btn btn-light comment-btn">Comment</button>
        </div>
        <div class="card-body">
        <p class="card-text">${data[i].description}</p>
        </div> `);
    }
  });
}

getSavedArticles();

function populateNotes(data) {
  console.log(data);
  data.notes.map(note => {
    $(".form-group").prepend(`<h3>${note.body}</h3>`);
  });
}

$("#scrape-btn").on("click", function() {
  $("#article-container").append("<div class='loader'></div>");
  $.get("/scrape").then(function() {
    getArticles();
  });
});

$(document).on("click", ".save-btn", function() {
  var saved = $(this)
    .parents(".card")
    .data("id");

  var favorite = { id: saved };
  $.post("/saved", favorite);
});

$(document).on("click", ".remove-btn", function() {
  var id = $(this)
    .parents(".card")
    .data("id");
  var favorite = { id };
  $.post("/remove-save", favorite).then(location.reload(true));
});

$(document).on("click", ".comment-btn", function() {
  $(".form-group").empty();
  var id = $(this)
    .parents(".card")
    .data("id");
  $.get("/articles/" + id).then(data => {
    populateNotes(data);
    $(".form-group")
      .append(
        "<textarea id='comment-input' name='comment' placeholder='comment on this article'></textarea><br>"
      )
      // A button to submit a new note, with the id of the article saved to it
      .append(
        `<button type='button' class='btn btn-dark' data-id=${id} id='savenote'>Save Note</button>`
      );
  });
  $("#comment-input").val("");
});

$(document).on("click", "#savenote", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  console.log(id);
  axios({
    method: "POST",
    url: "/articles/" + id,
    data: {
      // Value taken from note textarea
      body: $("#comment-input").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      populateNotes(data);
      // Empty the notes section
      $("#notes").empty();
    });
});

$(document).on("click", "#clear-btn", function() {
  $("#article-container").empty();
});

$(document).on("click", "comment-btn", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var id = $(this).attr("data-id");

  //axios call to get the article
  axios({
    method: "GET",
    url: "/articles/" + id
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("I hit this route", data);

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button type ='button' class='btn btn-dark' data-id='" +
          data._id +
          "' id='savenote'>Save Comment</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
