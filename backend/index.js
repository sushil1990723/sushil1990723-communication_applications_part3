
const express = require('express');
const users = require('./user');
const chats = require('./chat');
const {getUploads, uploadFile, updateUpload, deleteUpload } = require('./upload');
const cors = require('cors'); // Import middleware
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World!!!!');
})

// users api
app.get('/users', users.getUsers);
app.get('/users/:id', users.getUserById);
app.delete('/users/:id', users.deleteUserById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);

// login api
app.post('/login', users.loginUser);

// chats api
app.get('/chats', chats.getChat);
app.post('/chats', chats.addChat);

// uploads api
app.get('/uploads', getUploads);
app.post('/uploads', uploadFile);
app.put('/uploads/:id', updateUpload);
app.delete('/uploads/:id', deleteUpload);

// start server
app.listen(3001);