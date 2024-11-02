import express from 'express';
import session from 'express-session';
import path from 'path';
import cors from 'cors';
import {fileURLToPath} from 'url';

const PORT = process.env.PORT || 8080;
const app = express();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

app.disable('x-powered-by');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Ensures the cookie is accessible only by the web server
        sameSite: 'strict', // Protects against CSRF attacks by not sending the cookie with cross-site requests
        maxAge: 60 * 1000 // 1 minute in milliseconds
    }
}));

function isChromeToolRequestUrl(url) {
    return (url === '/json/version' || url === '/json/list');
}

// Define color codes
const reset = '\x1b[0m';
const red = '\x1b[31m';
const green = '\x1b[32m';
// const yellow = '\x1b[33m';
const blue = '\x1b[34m';

app.use((req, res, next) => {
    res.on('finish', () => {
        if (!isChromeToolRequestUrl(req.originalUrl)) {
            console.log(`Request: ${req.method} ${req.originalUrl} -> ${res.statusCode} (${res.statusMessage}) - ${green}SID(${req.session.id})${reset}`);
            // console.log('Session Data:', req.session);
        }
    });
    next();
});

app.get('/api/count', (req, res) => {
    if (req.session) {
        req.session.views = (req.session.views || 0) + 1;
        const body = {
            views: req.session.views,
            localTimeExpire: new Date(req.session.cookie.expires).toLocaleString()
        };
        res.json(body);
    } else {
        res.send('Session not initialized');
    }
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
    return;
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve the React frontend
app.get('*', (req, res) => {
    if (!isChromeToolRequestUrl(req.originalUrl)) {
        console.log(`${red}* Request: ${req.originalUrl}${reset}`);
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`${blue}Express server running on http://localhost:${PORT}${reset}`);
});
