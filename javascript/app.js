$(document).ready(function () {
    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var firstTrain = "0:00";
    var frequency = 0;
    var minAway = 0;
    $("form").on("submit", function (e) {
        e.preventDefault();
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#startTime").val().trim();
        frequency = $("#frequency").val().trim();

        database.ref().push({
            trainName: trainName,
            destination : destination,
            firstTrain : moment(firstTrain, 'HH:mm').format("hh:mm a"),
            frequency: parseInt(frequency)
        });

    });

    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val());
        var mainContainer = $("tbody");
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        firstTrain = snapshot.val().firstTrain;
        frequency = snapshot.val().frequency;
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        // Minute Until Train
        minAway = frequency - tRemainder;
        
        $(".form-control").val("");
        var row = $("<tr>");
        row.append("<td>"+ trainName +"</td>");
        row.append("<td>"+ destination +"</td>");
        row.append("<td>"+ firstTrain +"</td>");
        row.append("<td>"+ frequency +"</td>");
        row.append("<td>"+ minAway +"</td>");
        mainContainer.append(row);
        
    });    
});
