//Created by mgmgmg
//Uncomment the code if you want to run the code as wss intead of ws

const WebSocketServer = require('websocket').server;
//const https = require('https');
const port = 8082;
var clients = new Map()

const fs = require('fs')
var pwds = fs.readFileSync('accounts.txt', 'utf8')

/*
var httpsOptions = {
    key: fs.readFileSync("INSERT HTTPS KEY"),
    cert: fs.readFileSync("INSERT WSS CERTIFICATE")
};

var httpsServer = https.createServer(httpsOptions, function(request, response) {
    console.log(" Received request for " + request.url);
    response.writeHead(404);
    response.end();
});

httpsServer.listen(6502, function() {
    console.log((new Date()) + " Server is listening on port 6502");
});

const wss = new WebSocketServer({port: port, httpServer: httpsServer});
*/
const wss = new WebSocketServer({port: port});

function broadcast(text, author) {
    clients.forEach((_value, client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`MESSAGE:${author}:${text}`);
        }
    });
    console.log(`Broadcasted as ${author}: ${text}`);
}

function encrypt(password) {
    var epwd = 1;
    for(var i = 0; i < password.length; i++) {
        var letter = password.charAt(i);
        switch(letter) {
            case "a":
                epwd *= 151^i
                break;
            case "b":
                epwd *= 2^i
                break;
            case "c":
                epwd *= 3^i
                break;
            case "d":
                epwd *= 5^i
                break;
            case "e":
                epwd *= 7^i
                break;
            case "f":
                epwd *= 11^i
                break;
            case "g":
                epwd *= 13^i
                break;
            case "h":
                epwd *= 17^i
                break;
            case "i":
                epwd *= 19^i
                break;
            case "j":
                epwd *= 23^i
                break;
            case "k":
                epwd *= 19^i
                break;
            case "l":
                epwd *= 31^i
                break;
            case "m":
                epwd *= 37^i
                break;
            case "n":
                epwd *= 41^i
                break;
            case "o":
                epwd *= 43^i
                break;
            case "p":
                epwd *= 47^i
                break;
            case "q":
                epwd *= 53^i
                break;
            case "r":
                epwd *= 59^i
                break;
            case "s":
                epwd *= 61^i
                break;
            case "t":
                epwd *= 67^i
                break;
            case "u":
                epwd *= 71^i
                break;
            case "v":
                epwd *= 73^i
                break;
            case "w":
                epwd *= 79^i
                break;
            case "x":
                epwd *= 83^i
                break;
            case "y":
                epwd *= 89^i
                break;
            case "z":
                epwd *= 97^i
                break;
            case "A":
                epwd *= 163^i
                break;
            case "B":
                epwd *= 167^i
                break;
            case "C":
                epwd *= 173^i
                break;
            case "D":
                epwd *= 179^i
                break;
            case "E":
                epwd *= 181^i
                break;
            case "F":
                epwd *= 191^i
                break;
            case "G":
                epwd *= 193^i
                break;
            case "H":
                epwd *= 197^i
                break;
            case "I":
                epwd *= 199^i
                break;
            case "J":
                epwd *= 211^i
                break;
            case "K":
                epwd *= 223^i
                break;
            case "L":
                epwd *= 227^i
                break;
            case "M":
                epwd *= 229^i
                break;
            case "N":
                epwd *= 233^i
                break;
            case "O":
                epwd *= 239^i
                break;
            case "P":
                epwd *= 241^i
                break;
            case "Q":
                epwd *= 251^i
                break;
            case "R":
                epwd *= 257^i
                break;
            case "S":
                epwd *= 263^i
                break;
            case "T":
                epwd *= 269^i
                break;
            case "U":
                epwd *= 271^i
                break;
            case "V":
                epwd *= 277^i
                break;
            case "W":
                epwd *= 281^i
                break;
            case "X":
                epwd *= 283^i
                break;
            case "Y":
                epwd *= 293^i
                break;
            case "Z":
                epwd *= 307^i
                break;
            case "1":
                epwd *= 101^i
                break;
            case "2":
                epwd *= 103^i
                break;
            case "3":
                epwd *= 107^i
                break;
            case "4":
                epwd *= 109^i
                break;
            case "5":
                epwd *= 113^i
                break;
            case "6":
                epwd *= 127^i
                break;
            case "7":
                epwd *= 131^i
                break;
            case "8":
                epwd *= 137^i
                break;
            case "9":
                epwd *= 139^i
                break;
            case "0":
                epwd *= 149^i
                break;
            case "_":
                epwd *= 151^i
                break;
            case "-":
                epwd *= 157^i
                break;
            default:
                return false;
        }
    }
    return BigInt(epwd);
}

wss.on("connection", (ws, req) => {
    var ip = req.socket.remoteAddress.replace(/:/g,"").replace(/f/g,"");
    var name;
    console.log(ip+" has connected.");

    ws.on("message", data => {
        if(data.toString().startsWith("EPWD:")){
            var epwd=encrypt(data.toString().replace("EPWD:",""));
            if(epwd===false) {ws.send("ERROR:WRONGCHAR");return;}
            epwd = epwd.toString();
            if(pwds.indexOf(epwd)===-1){ws.send("ERROR:WRONGPWD");return;}
            pwds.split(/\r?\n/).forEach((line, idx)=> {
                if(line.includes(epwd)){
                name=line.replace(epwd+":","");
                }
            });
            var uuid = Math.floor(Math.random() * 1000000000000000000000000000);
            ws.send("UUID:"+uuid);
            clients.set(ws,uuid);
            return;
        }
        else if(!clients.has(ws)){ws.send("ERROR:NOLOGIN"); return;}
        else if(!data.toString().startsWith(clients.get(ws)+":")){ws.send("ERROR:INVALIDUUID"); return;}
        console.log(`${ip} (${name}) has sent "${data.toString().split(":")[1]}".`);
        ws.send("MESSAGE_SENT");
        broadcast(data.toString().split(":")[1], name+":"+ip)
    })

    ws.on("close", () => {
        console.log(ip+" has disconnected.");
    });
})

console.log("Server started on port "+port)