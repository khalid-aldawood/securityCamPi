const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const path = require('path')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

 const server  = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.use(
  cors({origin: '*',
  methods:['GET','POST']})
);

app.use(express.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(cookieParser('secret'));

// Express session
const sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })

app.use(sessionMiddleware);


const io = require('socket.io')(server,{ cors:{origin:"*"}});

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

io.use(async(socket, next) => {
next();
});



io.on('connect', async(socket) => {



  socket.on('videocam', async(cb) => {

  io.emit('livefeed',cb);
  
  });

    socket.on('temp', async(cb) => {

    io.emit('livetemp',cb);

  });

  socket.on('detection', async(cb) => {

    io.emit('trigger',cb);

  });




});


const storedinfo = require('./routes/readings');

app.use('/api/storedinfo', storedinfo);



app.use(express.static(path.join(__dirname, 'build')));

 app.get('/',(req,res)=>{
    res.sendFile(path.resolve('build/index.html'));
 })
 app.get('*',(req,res)=>{
   res.sendFile(path.resolve('build/index.html'));
 })
