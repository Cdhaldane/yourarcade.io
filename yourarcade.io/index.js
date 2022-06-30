const http = require("http"),
  express = require("express"),
  app = express(),
  socketIo = require("socket.io");
const fs = require("fs");


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const clients = {};


// Firing up the server on selected port
server.listen(PORT);

server.on("listening", () => {
    console.log("[Server]::LISTEN:%s", PORT);
});

// Callback function for checking connecting or error
server.on("error", error => {
    throw new Error(`[Server]::ERROR:${error.message}`);
});

app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
  // res.sendFile("index.html", { root: __dirname + "/../client" });
  const stream = fs.createReadStream(__dirname + "/../client/public/index.html");
  stream.pipe(res);
});

//TicTacToe
const addClient = socket => {
  console.log("New client connected", socket.id);
  clients[socket.id] = socket;
};
const removeClient = socket => {
  console.log("Client disconnected", socket.id);
  delete clients[socket.id];
};

io.sockets.on("connect", socket => {
  let id = socket.id;

  addClient(socket);

  socket.on("mousemove", data => {
    data.id = id;
    socket.broadcast.emit("moving", data);
  });

  socket.on("disconnect", () => {
    removeClient(socket);
    socket.broadcast.emit("clientdisconnect", id);
  });
});

var players = {},
  unmatched;


function joinGame(socket) {
  // Add the player to our object of players
  players[socket.id] = {
    // The opponent will either be the socket that is
    // currently unmatched, or it will be null if no
    // players are unmatched
    opponent: unmatched,

    // The symbol will become 'O' if the player is unmatched
    symbol: "X",

    // The socket that is associated with this player
    socket: socket
  };

  // Every other player is marked as 'unmatched', which means
  // there is not another player to pair them with yet. As soon
  // as the next socket joins, the unmatched player is paired with
  // the new socket and the unmatched variable is set back to null
  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
}

// Returns the opponent socket
function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  }

  return players[players[socket.id].opponent].socket;
}

io.on("connect", function(socket) {
  joinGame(socket);

  socket.on("updater", function(data){
    socket.emit("move_made", data);
    getOpponent(socket).emit("move_made", data);
  })
  // Once the socket has an opponent, we can begin the game
  if (getOpponent(socket)) {

    socket.emit("game.begin", {
      symbol: players[socket.id].symbol
    });



    socket.on("created", function(data) {
      socket.emit("sync", data);

      getOpponent(socket).emit("sync", data);
    });

    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol
    });


  }

  // Listens for a move to be made and emits an event to both
  // players after the move is completed
  socket.on("make.move", function(data) {
    if (!getOpponent(socket)) {
      return;
    }

    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
  });

  // Emit an event to the opponent when the player leaves
  socket.on("disconnect", function() {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
      }
    });
  });


  //Tron Game >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
