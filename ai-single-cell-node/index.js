const express = require('express');
const fs = require('fs')
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));
app.use(bodyParser.json());
app.use(cookieParser());

const dbConfig = JSON.parse(fs.readFileSync('./configs/dbconfigs.json'));

// Create a connection pool to handle multiple connections to the database
const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    connectionLimit: dbConfig.connectionLimit
});

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

// Route to handle user signup
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.json({ status: 500, message: 'Internal Server Error' });
            return;
        }

        // Insert the user into the database
        pool.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], (err) => {
            if (err) {
                console.error(err);
                res.json({ status: 500, message: 'An Account is already present with the given email or username. Please try to login or create a new account using different email.' });
                return;
            }

            res.json({ status: 200, message: 'User account created successfully' });
        });
    });
});

// Route to handle user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            res.json({ status: 500, message: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.json({ status: 401, message: 'Invalid credentials' });
            return;
        }

        const user = results[0];

        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.error(err);
                res.json({ status: 500, message: 'Internal Server Error' });
                return;
            }

            if (!isMatch) {
                res.json({ status: 401, message: 'Invalid credentials' });
                return;
            }

            // Create JWT token and send it back to the client
            const jwtToken = jwt.sign({ username, password }, 'secret', { expiresIn: '1h' });

            // the cookie will be set with the name "jwtToken" and the value of the token
            // the "httpOnly" and "secure" options help prevent XSS and cookie theft
            // the "secure" option is only set if the app is running in production mode
            // set the cookie with the JWT token on the response object
            res.cookie("jwtToken", jwtToken, {
                //httpOnly: true,
                maxAge: 60 * 60 * 1000,
                path:"/"
                //secure: process.env.NODE_ENV === "production",
            });

            console.log(req.cookies);
            res.json({ status:200,message: 'Logged in successfully', jwtToken });
        });
    });
});

// Route to handle protected resource
app.get('/protected', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({ message: 'You have access to the protected resource', authData });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
