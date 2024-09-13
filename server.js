const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config(); // Load environment variables from .env

const PORT = process.env.PORT || 5000;

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

const server = http.createServer(app);
const io = socketIo(server);


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { io };
