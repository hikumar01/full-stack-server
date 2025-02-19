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
    res.json({key, value});
};

const setKeyValueWithTtl = async (req, res) => {
    const {key, value, ttl} = req.params;
    const ttlSeconds = parseInt(ttl, 10);
    if (isNaN(ttlSeconds) || ttlSeconds <= 0) {
        return res.status(400).json({'error': 'Invalid TTL value.'});
    }
    await redisClient.set(key, value);
    await redisClient.expire(key, ttlSeconds);
    const updatedTtl = await redisClient.ttl(key);
    res.json({key, value, ttl: updatedTtl});
};

const getValueByKey = async (req, res) => {
    const {key} = req.params;
    const value = await redisClient.get(key);
    if (!value) {
        return res.status(204);
    }
    const result = {key, value};
    const ttl = await redisClient.ttl(key);
    if (ttl >= 0) {
        result.ttl = ttl;
    }
    res.json(result);
};

const getAllKeyValuePairs = async (req, res) => {
    const {namespace} = req.params | 'myapp';
    const pattern = `${namespace}:*`;
    const cursor = '0';
    const reply = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);

    const keyValuePairs = {};
    for (const key of reply.keys) {
        const value = await redisClient.get(key);
        const ttl = await redisClient.ttl(key);
        keyValuePairs[key] = ttl >= 0 ? [value, ttl] : [value];
    }
    res.json(keyValuePairs);
};

const deleteKey = async (req, res) => {
    const {key} = req.params;
    const ret = await redisClient.del(key);
    res.status(ret ? 200 : 204);
};

const deleteAllKey = async (req, res) => {
    const {namespace} = req.params | 'myapp';
    const pattern = `${namespace}:*`;
    const cursor = '0';
    const reply = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);

    const keyList = [];
    for (const key of reply.keys) {
        await redisClient.del(key);
        keyList.push(key);
    }
    res.status(200).json(keyList);
};

function addRoutes(router) {
    router.get('/set/:key/:value', setKeyValue);
    router.get('/set/:key/:value/:ttl', setKeyValueWithTtl);
    router.get('/get/:key', getValueByKey);
    router.get('/getAll/:namespace?', getAllKeyValuePairs);
    router.get('/delete/:key', deleteKey);
    router.get('/deleteAll', deleteAllKey);
}

export default {redisStore, addRoutes};
