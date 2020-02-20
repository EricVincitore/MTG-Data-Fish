// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].description + "<br />" +data[i].link + "</p>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<b>" + "Comment Title" + "</b>");
        $("#notes").append("<input id='titleInput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<b>" + "Comment Body" + "</b>");
        $("#notes").append("<textarea id='bodyInput' name='body'></textarea>");
        // An input for user to add name
        $("#notes").append("<b>" + "User" + "</b>");
        $("#notes").append("<input id='userInput' name='User' >");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='saveNote'>Save Comment</button>");
  
        // If there's a note in the article
        if (data.comment) {
          // Place the title of the note in the title input
          $("#titleInput").val(data.comment.title);
          // Place the body of the note in the body textarea
          $("#bodyInput").val(data.comment.body);
          //place the user of the note in the user input
          $("#userInput").val(data.comment.user);
        };

        $.ajax({
          method: "GET",
          url: "/api/comments"
        })
        .then(function (data) {

          $("#comments").empty();
          for (let i = 0; i < data.length; i++) {
            $("#comments").append("<p>" + "Title: " + data[i].title + "</p>");
            $("#comments").append("<p>" + "Body: " + data[i].body + "</p>");
            $("#comments").append("<p>" + "User: " + data[i].user + "</p>");

            $("#comments").append("<button data-id='" + data[i]._id + "' class='deleteNote'>Delete Comment</button>");
          };
          $(".deleteNote").on("click", function () {
            var id = $(this).attr("data-id")
            $.ajax({
              url: "/api/comments/" + id,
              method: "DELETE"
            })
            .then(function (data) {
              console.log("delete")
            });
          });
        });
      });
  });
  
  // When you click the save note button
  $(document).on("click", "#saveNote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleInput").val(),
        // Value taken from note textarea
        body: $("#bodyInput").val(),
        //value taken from user text area
        user: $("#userInput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleInput").val("");
    $("#bodyInput").val("");
    $("#userInput").val("");
  });
  