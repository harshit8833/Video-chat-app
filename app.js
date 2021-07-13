/////////////////////////////////////////////////////////////
// REQUIRE PACKAGES
/////////////////////////////////////////////////////////////
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const morgan = require('morgan')
const bodyParser = require("body-parser");
const passport = require('passport')
const session  = require('express-session')
const MongoStore = require('connect-mongo')(session)

dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)
connectDB()

var app = express();


const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

/////////////////////////////////////////////////////////////
// CONFIGURE EXPRESS APP AND MIDDLEWARE
/////////////////////////////////////////////////////////////


app.use(express.static("public"));
app.use('/peerjs', peerServer);
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use('/public', express.static(__dirname + '/public'))

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 3000
/////////////////////////////////////////////////////////////
// Connection through socket.IO
/////////////////////////////////////////////////////////////
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId, displayName) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId , displayName);
    // messages
     setInterval(function(){ io.in(roomId).emit('addparticipant',displayName);}, 1000);
    
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message , displayName);
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(PORT, console.log(`server running on http://localhost:${PORT}`))