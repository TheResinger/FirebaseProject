var firebaseConfig = {
    apiKey: "AIzaSyB7CYadkluQXQmPC1jZl5TQd4-33faktCE",
    authDomain: "rock-paper-scissors-ad1ae.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-ad1ae.firebaseio.com",
    projectId: "rock-paper-scissors-ad1ae",
    storageBucket: "",
    messagingSenderId: "277356354275",
    appId: "1:277356354275:web:06014972c2da84df"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

var playerSelected = false;
var p1Name = "None";
var p1Choice = "Click to Play!";
var p2Name = "None";
var p2Choice = "Click to Play!";

database.ref(`Player1/`).on("value",function(snapshot){
    if(snapshot.child("name").exists() && snapshot.child("choice").exists()){
        p1Name = snapshot.val().name;
        p1Choice = snapshot.val().choice;
    };
    $("#player1").text(p1Name);
    $("#player1Choice").text(p1Choice);
},function(errorObject){
    console.log("The read Failed: " + errorObject.code);
});
database.ref(`Player2/`).on("value",function(snapshot){
    if(snapshot.child("name").exists() && snapshot.child("choice").exists()){
        p2Name = snapshot.val().name;
        p2Choice = snapshot.val().choice;
    };
    $("#player2").text(p2Name);
    $("#player2Choice").text(p2Choice);
},function(errorObject){
    console.log("The read Failed: " + errorObject.code);
});
function addPlayerTextBox()
{
    $("#name").remove();
    $("#header").append($("<form>",{"id":"name", "class" : "text-center"}));
    $("#name").append($("<div>",{"class":"form-group"}));
    $("#name div").append($("<label>",{"for" : "playerName","text":"Enter Your Name"}));
    $("#name div").append($("<input>",{"class" : "form-control","id":"playerName","type":"text"}));
    $("#name").append($("<button>",{"class" : "btn btn-primary float-right","id":"addPlayerName","text":"Submit"}));
}
    $(document).on("click","#player1Card",function(){
        // No Player Registered
        playerSelected = true;
        console.log(playerSelected);
        if(playerSelected === false)
        {
            if($("#player1").text().indexOf("None") > -1) 
            {
                addPlayerTextBox();
                $(document).on("click", "#addPlayerName",function(event) {
                    event.preventDefault();
                    var tempName = $("#playerName").val();
                    $("#name").remove();
                    console.log(tempName);
                    database.ref(`Player1/`).set({
                        name : tempName,
                        choice : "",
                    });
                });
            }
            // Player Registered and Name Changed
            else if ($("#player1").text().indexOf("None") === -1)
            {
                $("#header").append($("<h3>",{"text" : "Player already registered.","class":"text-center"}))
            }
        }
        else
        {
            console.log("Player Slected Already");
        }
    });
    
    $(document).on("click","#player2Card",function(){
        playerSelected = true;
        console.log(playerSelected);
        if(playerSelected === false)
        {
            if($("#player2").text().indexOf("None") > -1) //No player Registered
            {
                $("#header h3").remove();
                addPlayerTextBox();
                $(document).on("click", "#addPlayerName",function(event) {
                    event.preventDefault();
                    var tempName = $("#playerName").val();
                    $("#name").remove();
                    console.log(tempName);
                    database.ref(`Player2/`).set({
                        name : tempName,
                        choice : "",
                    });
                });
            }
            else if ($("#player2").text().indexOf("None") === -1) //Player Registered and name changed
            {
                console.log("Not Found");
            }
        }
        else
        {
            console.log("Player Slected Already");
        }
    });

function reset()
{
    database.ref(`Player1/`).set({
        name : "None",
        choice : "Click to Play!",
    })
    database.ref(`Player2/`).set({
        name : "None",
        choice : "Click to Play!",
    })
};