$(document).ready(function() {
  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrain = "0:00";
  var frequency = 0;
  var minAway = 0;
  var updatedAttr = "";
  var updatedRowName = "";
  $("form").on("submit", function(e) {
    e.preventDefault();
    trainName = $("#trainName")
      .val()
      .trim();
    destination = $("#destination")
      .val()
      .trim();
    firstTrain = $("#startTime")
      .val()
      .trim();
    frequency = $("#frequency")
      .val()
      .trim();

    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: moment(firstTrain, "HH:mm").format("hh:mm a"),
      frequency: parseInt(frequency)
    });
  });

  database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());
    var mainContainer = $("tbody");
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrain = snapshot.val().firstTrain;
    frequency = snapshot.val().frequency;
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    // Difference between the times
    //var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var diffTime = moment.utc(
      moment().diff(moment(firstTimeConverted, "minutes"))
    );
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // Minute Until Train
    minAway = frequency - tRemainder;

    $(".form-control").val("");
    var row = $('<tr id="' + snapshot.key + '">');
    row.append('<td id="test" class="trainName">' + trainName + "</td>");
    row.append('<td id="test" class="destination">' + destination + "</td>");
    row.append('<td id="test" class="firstTrain">' + firstTrain + "</td>");
    row.append('<td id="test" class="frequency">' + frequency + "</td>");
    row.append('<td id="minAway">' + minAway + "</td>");
    row.append('<button id="deleteRow">X</button>');
    mainContainer.append(row);
    var intervalId = setInterval(function() {
      var minAway = parseInt($("#" + snapshot.key + " #minAway").text());
      if (minAway) {
        console.log(snapshot.key + ": " + minAway);
        minAway--;
        $("#" + snapshot.key + " #minAway").text("");
        $("#" + snapshot.key + " #minAway").text(minAway);
      } else {
        clearInterval(intervalId);
      }
    }, 60 * 1000);
    $("#" + snapshot.key + " #deleteRow").on("click", function() {
      $("#" + snapshot.key).remove();
      database.ref("/" + snapshot.key).remove();
    });
     
    $(document.body).on("click", "#test", function() {
      updatedAttr = $(this).attr("class");
      updatedRowName = $(this).parent().attr("id");
      var input = $("<input>", {
        id: "test",
        val: $("#test").text(),
        type: "text"
      });
      $(this).replaceWith(input);
      input.select();
    });

    $(document.body).on("focusout", "#test", function() {
      console.log(updatedAttr);
      console.log(updatedRowName);
      var $span = $("<span id='test'>" + $("#test").val() + " </span>");
      $("#test").replaceWith($span);
      database.ref("/"+ updatedRowName + "/" + updatedAttr).set($("#test").text());
    });
  });
});
