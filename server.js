const WebSocket = require("ws");

const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port });

let searching = [];

function tryMatch() {
    if (searching.length < 2) return;

    let p1 = searching.shift();
    let p2 = searching.shift();

    p1.ws.send(JSON.stringify({
        player: p1.team,
        enemy: p2.team
    }));

    p2.ws.send(JSON.stringify({
        player: p2.team,
        enemy: p1.team
    }));
}

wss.on("connection", ws => {

    ws.on("message", msg => {

        const data = JSON.parse(msg);

        if(data.type === "search"){
            searching.push({
                ws: ws,
                number: data.number,
                team: data.team
            });

            tryMatch();
        }

    });

});

console.log("Server running");
