import RedisStore from 'connect-redis';
import {createClient} from 'redis';

const redisClient = createClient({
    host: 'localhost',
    port: 6379
    // password: 'password'
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:'
});

if (!redisClient) {
    console.error('Redis client not initialized. Exiting...');
    process.exit(1);
}

const setKeyValue = async (req, res) => {
    const {key, value} = req.params;
    await redisClient.set(key, value);
    res.send(`Key '${key}' set with value '${value}'`);
};

const getValueByKey = async (req, res) => {
    const {key} = req.params;
    const value = await redisClient.get(key);
    if (value) {
        res.send(`Value for key ${key} is ${value}`);
    } else {
        res.send(`Key ${key} not found`);
    }
};

const deleteKey = async (req, res) => {
    const {key} = req.params;
    const result = await redisClient.del(key);
    if (result) {
        res.send(`Key ${key} deleted`);
    } else {
        res.send(`Key ${key} not found`);
    }
};

function addRoutes(router) {
    router.get('/set/:key/:value', setKeyValue);
    router.get('/get/:key', getValueByKey);
    router.get('/delete/:key', deleteKey);
}

export default {redisStore, addRoutes};
