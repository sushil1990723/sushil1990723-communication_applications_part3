
const { Pool } = require('pg');
require('dotenv').config();

// Express server example (server.js)
const express = require('express');
const app = express();


const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
});

app.use(express.json());

exports.getUploads = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM uploads');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadFile = async (req, res) => {
    const { filedata, fileDescription } = req.body;
    console.log(req.body);    
    try {
        const result = await pool.query('INSERT INTO uploads (label, originalfilename ) VALUES ($1, $2) RETURNING *', [filedata, fileDescription]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUpload = async (req, res) => {
    const { id } = req.params;
    const { fileDescription } = req.body;
    console.log(req.body);
    try {
        const result = await pool.query('UPDATE uploads SET label = $1 WHERE id = $2 RETURNING *', [fileDescription, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUpload = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM uploads WHERE id = $1', [id]);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};