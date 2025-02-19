import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.resolve(__dirname, '..');

const favicon = (req, res) => {
    res.status(204).end();
};

// Catch-all route to serve the React frontend
const catchAll = (req, res) => {
    res.status(501).end();
};

function addRoutes(router) {
    router.get('/favicon.ico', favicon);

    // Serve static files from the dist directory
    router.use(express.static(path.join(rootDirectory, 'dist')));

    router.get('*', catchAll);
}

export default {addRoutes};
