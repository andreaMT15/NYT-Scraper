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
      $(".saved-articles").append(`<div class="card" data-id=${data[i]._id}>
        <div class="card-header"><h5>
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
  $(".form-group h3").remove();
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
  console.log(saved);
  var favorite = { id: saved };

  $.post("/saved", favorite).then(function(data) {
    console.log(data);
  });
});

$(document).on("click", ".remove-btn", function() {
  var id = $(this)
    .parents(".card")
    .data("id");
  console.log(id);
  var favorite = { id };

  $.post("/remove-save", favorite).then(function(data) {
    console.log(data);
  });
  //I would just remove that article on the front end using jquery instead of reloading
  location.reload(true);
});

$(document).on("click", ".comment-btn", function() {
  $(".form-group").empty();
  var id = $(this)
    .parents(".card")
    .data("id");
  console.log(id);

  $.get("/articles/" + id).then(data => {
    console.log(data);
    populateNotes(data);
    $(".form-group")
      .append(
        "<textarea id='comment-input' name='comment' placeholder='comment on this article'></textarea>"
      )
      // A button to submit a new note, with the id of the article saved to it
      .append(
        `<button class="btn btn-dark" data-id=${id} id='savenote'>Save Note</button>`
      );
  });
  $("#comment-input").val("");
});
$(document).on("click", "#savenote", function(event) {
  event.preventDefault();
  var id = $(this).attr("data-id");
  console.log(id);
  $.ajax({
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
      $("#comment-input").val("");
    });
});

$(document).on("click", "#clear-btn", function() {
  $("#article-container").empty();
});
