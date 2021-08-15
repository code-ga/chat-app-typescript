import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import express from "express";
import { ExpressPeerServer } from "peer";
import bodyParser from "body-parser"
import morgan from "morgan"
const app = express();
const httpServer = createServer(app);
const port: number = parseInt(process.env.PORT as string) || 8000;

// real-time server set up
const io = new Server(httpServer);
const peerServer = ExpressPeerServer(httpServer, {
  path: "/",
});
app.use("/peerjs", peerServer);

io.on("connection", (socket: Socket) => {
  // ...
});



app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(morgan("dev"));



app.get("/", (req, res) => {
  res.send("server is running");
});

httpServer.listen(port, () => {
  console.log(`server is start at port ${port}`);
});
