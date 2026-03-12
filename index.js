<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Battle Finder</title>
<style>
body{
    font-family: Arial;
    background:#111;
    color:white;
}

button{
    padding:10px;
    font-size:16px;
}

#status{
    margin-top:20px;
}
</style>
</head>

<body>

<h2>Battle Finder</h2>

<label>Your Number:</label>
<input id="number" type="number" value="10">

<br><br>

<button onclick="search()">Battle</button>

<div id="status"></div>

<script>

const team = ["Leafimp","Shellhog","Starwyrm"]; // your team

const ws = new WebSocket("ws://localhost:8080");

ws.onmessage = (event)=>{
    const data = JSON.parse(event.data);

    if(data.type === "match"){

        document.getElementById("status").innerHTML =
        "player: " + data.player.join(", ") +
        "<br>enemy: " + data.enemy.join(", ");
    }
};

function search(){

    document.getElementById("status").innerText = "Searching...";

    ws.send(JSON.stringify({
        type:"search",
        number: Number(document.getElementById("number").value),
        team: team
    }));

}

</script>

</body>
</html>
