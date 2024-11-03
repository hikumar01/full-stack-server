import express, {Router as router} from 'express';
import session from 'express-session';
import cors from 'cors';
import RedisDB from './redisDB.js';
import staticFileHandling from './staticFileHandling.js';
import Colors from './constants.js';

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.disable('x-powered-by');

app.use(session({
    store: RedisDB.redisStore,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
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

app.use((req, res, next) => {
    res.on('finish', () => {
        if (!isChromeToolRequestUrl(req.originalUrl)) {
            console.log(`Request: ${req.method} ${req.originalUrl} -> ${res.statusCode} (${res.statusMessage})`,
                ` - ${Colors.Green}SID(${req.session.id})${Colors.Reset}`);
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

app.post('/compare', (req, res) => {
    const {str1, str2} = req.body;
    const body = {str1, str2};
    console.log('Comparing: ', body);
    res.setHeader('Content-Type', 'application/json');
    res.json(body);
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

// Redis DB
const redisRouter = router();
RedisDB.addRoutes(redisRouter);
app.use('/redis', redisRouter);

// Serve static files from the dist directory
staticFileHandling.addRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`${Colors.Blue}Express server running on http://localhost:${PORT}${Colors.Reset}`);
});
