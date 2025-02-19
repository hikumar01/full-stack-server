import express, {Router as router} from 'express';
import session from 'express-session';
import cors from 'cors';
import RedisDB from './redisDB.js';
import staticFileHandling from './staticFileHandling.js';
import Compare from './compare.js';

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.disable('x-powered-by');

app.use(session({
    store: RedisDB.redisStore,
    secret: 'your-secret-key', // Should be read from ENV varibale, should not be hardcoded
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Not using HTTPS
        httpOnly: true, // accessible only by the web server, not by JavaScript
        sameSite: 'strict', // Protects against CSRF attacks by not sending the cookie with cross-site requests
        maxAge: 5 * 60 * 1000 // 5 minute
    }
}));

function isChromeToolRequestUrl(url) {
    return (url === '/json/version' || url === '/json/list');
}

app.use((req, res, next) => {
    res.on('finish', () => {
        if (!isChromeToolRequestUrl(req.originalUrl)) {
            console.log(' '.repeat(9), `${req.method} ${req.originalUrl} -> ${res.statusCode} (${res.statusMessage}) - SID(${req.session.id})`);
        }
    });
    if (!isChromeToolRequestUrl(req.originalUrl)) {
        console.log(`Request: ${req.method} ${req.originalUrl}`);
    }
    next();
});

// req.session.userID = '12345-updated';
// await req.session.save((err) => {
//     if (err) {
//         console.error('Error saving session:', err);
//     } else {
//         console.log('Session saved', req.session.id);
//     }
// });

app.get('/api/count', async (req, res) => {
    if (req.session) {
        console.log('Session ID:', req.session.id, JSON.stringify(req.session));
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

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        // res.redirect('/login');
    });
});

// Compare
Compare.addRoutes(app);

// Redis DB
const redisRouter = router();
RedisDB.addRoutes(redisRouter);
app.use('/redis', redisRouter);

// Serve static files from the dist directory
staticFileHandling.addRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});
