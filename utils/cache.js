const redis = require('redis');

const redisClient = redis.createClient(); // Connects to localhost by default

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect the client
redisClient.connect().catch(console.error); 

module.exports = redisClient;
