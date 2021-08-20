// import
import {createServer} from 'http'
import {Server, Socket} from 'socket.io'
import cors from 'cors'
import express from 'express'
import {ExpressPeerServer} from 'peer'
import bodyParser from 'body-parser'
import userRoute from './router/user.route'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './utils/db'
// create app
dotenv.config()
const app = express()
const httpServer = createServer(app)
const port: number = parseInt(process.env.PORT as string) || 8000

// connect to database
const mongodbUrl: string = String(process.env.DB_SERVER)
connectDB(mongodbUrl)

// real-time server set up
const options = {
    cors: {
        origin: ['http://localhost:9080'],
    },
}
const io = new Server(httpServer, options)
const peerServer = ExpressPeerServer(httpServer, {
    path: '/',
})
app.use('/peerjs', peerServer)

io.use((socket, next) => {
    const token = socket.request.headers.authorization
    console.log(socket.request.headers.authorization)
    next()
})

io.on('connection', (socket: Socket) => {})
peerServer.on('connection', (client) => {})
peerServer.on('disconnect', (client) => {})

// config app
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.static('public'))


// route check server start
app.get('/', (req, res) => {
    res.sendFile('page/index.html', {root: __dirname})
})

// set up another route
app.use('/user', userRoute)

// start app
httpServer.listen(port, () => {
    console.log(`server is start at port ${port}`)
})
