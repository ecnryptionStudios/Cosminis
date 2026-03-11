const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let searching = [];

function tryMatch() {
    if (searching.length < 2) return;

    let bestPair = null;
    let bestDiff = Infinity;

    for (let i = 0; i < searching.length; i++) {
        for (let j = i + 1; j < searching.length; j++) {

            let diff = Math.abs(searching[i].number - searching[j].number);

            if (diff < bestDiff) {
                bestDiff = diff;
                bestPair = [i, j];
            }
        }
    }

    if (!bestPair) return;

    let p1 = searching[bestPair[0]];
    let p2 = searching[bestPair[1]];

    p1.ws.send(JSON.stringify({
        type: "match",
        enemy: p2.team,
        player: p1.team
    }));

    p2.ws.send(JSON.stringify({
        type: "match",
        enemy: p1.team,
        player: p2.team
    }));

    searching.splice(bestPair[1], 1);
    searching.splice(bestPair[0], 1);
}

wss.on("connection", ws => {

    ws.on("message", msg => {
        let data = JSON.parse(msg);

        if (data.type === "search") {

            searching.push({
                ws: ws,
                number: data.number,
                team: data.team
            });

            tryMatch();
        }
    });

});
