const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
});

// Get all users
const getUsers = (request, response) => {
    pool.query("SELECT * FROM users", function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send(results.rows);
    })
}
    
// get user by id 
const getUserById = (request, response) => {
    let id = +(request.params.id);

    if (isNaN(id)) {
        return response.status(200).json({ info: "use number only" });
    }

    pool.query(`SELECT * FROM users where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send(results.rows);
    })
}

// Delete user by id 
// const deleteUserById = (request, response) => {
//     let id = +(request.params.email);
//     pool.query(`DELETE FROM users where id = ${email}`, function (error, results) {
//         if (error) {
//             throw error
//         }
//         return response.status(200).send(`Deleted User ID:${email}`);
//     })
// }

const deleteUserById = ('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Database error' });
    }
  });
  


// Add User
const addUser = async (req, res) => {
    const { fullname, email, password, confirmpassword } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedconfirmPassword = await bcrypt.hash(confirmpassword, 10);
    
    const sqlQuery = `INSERT INTO users (fullname, email, password, confirmpassword) VALUES ($1, $2, $3, $4) RETURNING id`;
    const values = [fullname, email, hashedPassword, hashedconfirmPassword];

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Failed to add user' });
        }
        res.status(200).json({ success: true, message: 'Added User', userId: results.rows[0].id });
    });
};

// const updateUser = async (request, response) => {
//     const id = parseInt(request.params.id);
//     const { fullname, email } = request.body;

//     if (isNaN(id)) {
//         return response.status(400).json({ success: false, message: 'Invalid user ID' });
//     }

//     try {
//         let query = 'UPDATE users SET fullname = $1, email = $2 WHERE id = $3 RETURNING *';
//         const values = [fullname, email, id];
        
//         const result = await pool.query(query, values);

//         if (result.rowCount === 0) {
//             return response.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Optionally return the updated user
//         return response.status(200).json({ success: true, message: `User ID ${id} updated successfully`, user: result.rows[0] });
//     } catch (error) {
//         console.error('Error updating user:', error.message);
//         return response.status(500).json({ success: false, message: 'Failed to update user' });
//     }
// };

const updateUser = ('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { fullname, email } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE users SET fullname = $1, email = $2 WHERE id = $3 RETURNING *',
      [fullname, email, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// const loginUser = ('/login', (req, res) => {
//     // Handle login logic here
//     res.status(200).json({
//       success: true,
//       message: 'Login successful'
//     });
//   });

const loginUser = ('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
      }
  
      // If everything is correct, send success response
      res.status(200).json({ success: true, message: 'Login successful', email });
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
  });
  

module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    addUser,
    updateUser,
    loginUser
};