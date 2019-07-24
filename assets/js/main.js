var firebaseConfig = {
    apiKey: "AIzaSyADHAMt5aqGzw9zMmZvTjimr3dWKkNRuIo",
    authDomain: "rockpaperscissors-d1eb1.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-d1eb1.firebaseio.com",
    projectId: "rockpaperscissors-d1eb1",
    storageBucket: "",
    messagingSenderId: "103566512039",
    appId: "1:103566512039:web:0cdfdce65b8f9388"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var p1 = null;
var p2 = null;
var p1Name = "";
var p2Name = "";
var currentName = "";
var p1Choice = "";
var p2Choice = "";
var turn = 1;

database.ref("/players/").on("value",function(snapshot){
    if(snapshot.child("p1").exists())
    {
        p1 = snapshot.val().p1;
        p1Name = p1.name;
        $("#player1").text(p1Name);
        $("#p1Wins").text(p1.wins);
        $("#p1Ties").text(p1.tie);
        $("#p1Losses").text(p1.losses);
    }
    else
    {
        // console.log("No player");
        p1 = null;
        p1Name = "";
        $("#player1").text("Waiting for Player...");
        database.ref("/outcome/").remove();  
    }
    if(snapshot.child("p2").exists())
    {
        p2 = snapshot.val().p2;
        p2Name = p2.name;
        $("#player2").text(p2Name);
        $("#p2Wins").text(p2.wins);
        $("#p2Ties").text(p2.tie);
        $("#p2Losses").text(p2.losses);
    }
    else
    {
        // console.log("No Player");
        p2 = null;
        p2Name = "";
        $("#player2").text("Waiting for Player...");
        database.ref("/outcome/").remove(); 
    }
    if(p1 && p2)
    {
        $("#result").text("Waiting on " + p1Name + " to choose");
    }
    if(!p1 && !p2)
    {
        database.ref("/chat/").remove();
        database.ref("/turn/").remove();
        database.ref("/outcome/").remove();
        $("#messages").empty();
        $("#result").text("");
    }
});

database.ref("/players/").on("child_removed", function(snapshot){
    var msg = snapshot.val().name + " has left the game.";
    var chatKey = database.ref().child("/chat/").push().key;
    database.ref("/chat/" + chatKey).set(msg);
});

database.ref("/chat/").on("child_added", function(snapshot){
    var msg = snapshot.val();
    $("#messages").append($("<p>",{"text": msg}));
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
});
database.ref("/turn/").on("value", function(snapshot){
    if(snapshot.val() === 1)
    {
        turn = 1;
        if(p1 && p2)
        {
            $("#result").text("Waiting on " + p1Name + " to choose");
        }
    }
    else if (snapshot.val() === 2)
    {
        turn = 2;
        if(p1 && p2)
        {
            $("#result").text("Waiting on " + p2Name + " to choose");
        }
    }
});

$("#addPlayerName").on("click",function(event){
    event.preventDefault();
    console.log(p1);
    console.log(p2);
    if(($("#nameInput").val().trim() !== "") && !(p1 && p2))
    {
        if(p1 === null)
        {
            currentName = $("#nameInput").val().trim();
            p1 = {
                name : currentName,
                wins : 0,
                tie : 0,
                losses : 0,
                choice : "",
            };
            database.ref().child('/players/p1').set(p1);
            database.ref().child("/turn").set(1);
            database.ref("/players/p1").onDisconnect().remove();
        }
        else if ((p1 !== null) && (p2 === null))
        {
            currentName = $("#nameInput").val().trim();
            p2 = {
                name : currentName,
                wins : 0,
                tie : 0,
                losses : 0,
                choice : "",
            };
            database.ref().child('/players/p2').set(p2);
            database.ref("/players/p2").onDisconnect().remove();
        }
        var msg = currentName + " has joined the game.";
        var chatKey = database.ref().child("/chat/").push().key;
        database.ref("/chat/" + chatKey).set(msg);
        $("#nameInput").val("");
    }
});
$("#addMessage").on("click", function(event){
    event.preventDefault();
    if((currentName !== "") && ($("#messageInput").val().trim() !== ""))
    {
        var msg = currentName + " : " + $("#messageInput").val().trim();
        $("#messageInput").val("");
        var chatKey = database.ref().child("/chat/").push().key;
        database.ref("/chat/" + chatKey).set(msg);
    }
});
$("#p1Choices").on("click", ".option", function(event){
    $("#roundOutcome").text("");
    event.preventDefault;
    if(p1 && p2 && (currentName === p1.name) && (turn === 1))
    {
        var choice = $(this).text().trim();
        p1Choice = choice;
        database.ref().child("/players/p1/choice").set(choice);
        turn = 2;
        database.ref().child("/turn/").set(2);
    }
});
$("#p2Choices").on("click", ".option", function(event){
    event.preventDefault;
    if(p2 && p2 && (currentName === p2.name) && (turn === 2))
    {
        var choice = $(this).text().trim();
        p2Choice = choice;
        database.ref().child("/players/p2/choice").set(choice);
        rps();
    }
});
function rps()
{
    if((p1.choice === "Rock") || (p1.choice === "Paper") || (p1.choice === "Scissors"))
    {
        if((p1.choice === "Rock" && p2.choice === "Scissors") || (p1.choice === "Scissors" && p2.choice === "Paper") || (p1.choice === "Paper" && p2.choice === "Rock"))
        {
            database.ref().child("/outcome/").set(p1Name + " wins!");
            database.ref().child("/players/p1/wins").set(p1.wins + 1);
            database.ref().child("/players/p2/losses").set(p2.losses + 1);
            var msg = p1Name + " Wins!";
            var chatKey = database.ref().child("/chat/").push().key;
            database.ref("/chat/" + chatKey).set(msg);
        }
        else if(p1.choice === p2.choice)
        {
            database.ref().child("/outcome/").set("Tie Game!");
            database.ref().child("/players/p1/tie").set(p1.tie + 1);
            database.ref().child("/players/p2/tie").set(p2.tie + 1);
            var msg = "Tie Game!";
            var chatKey = database.ref().child("/chat/").push().key;
            database.ref("/chat/" + chatKey).set(msg);
        }
        else
        {
            database.ref().child("/outcome/").set(p2Name + " wins!");
            database.ref().child("/players/p2/wins").set(p2.wins + 1);
            database.ref().child("/players/p1/losses").set(p1.losses + 1);
            var msg = p2Name + " Wins!";
            var chatKey = database.ref().child("/chat/").push().key;
            database.ref("/chat/" + chatKey).set(msg);
        }
    }
    turn = 1;
    database.ref().child("/turn").set(1);
    database.ref().child("/outcome/").set("");
}