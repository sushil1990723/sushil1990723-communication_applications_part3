const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API endpoint to get all chat messages
const getChat = ('/chats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chats ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
});

const addChat = ('/chats', async (req, res) => {
    const { dateTime, fullname, userChatMessage } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO chats (datetime, fullname, message) VALUES ($1, $2, $3) RETURNING *',
            [dateTime, fullname, userChatMessage]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding chat message:', error);
        res.status(500).json({ error: 'Failed to send chat message' });
    }
});


module.exports = {
    getChat,
    addChat
};
