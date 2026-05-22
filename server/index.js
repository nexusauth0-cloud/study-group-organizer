const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const connectDB = require('./config/db');
const { PORT, CLIENT_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const setupSocket = require('./socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const SELF_URL = process.env.RENDER_EXTERNAL_URL || CLIENT_URL;
if (process.env.NODE_ENV === 'production') {
  cron.schedule('*/10 * * * *', () => {
    const ts = new Date().toISOString();
    https.get(`${SELF_URL}/api/health`, (res) => {
      console.log(`[KeepAlive] ${ts} - ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[KeepAlive] ${ts} - ${err.message}`);
    });
  });
  console.log(`Keep-alive active: pinging ${SELF_URL} every 10min`);
}

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadsDir));
app.set('io', io);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/groups/:groupId/sessions', require('./routes/sessions'));
app.use('/api/groups/:groupId/resources', require('./routes/resources'));
app.use('/api/groups/:groupId/messages', require('./routes/messages'));
app.use('/api/mentors', require('./routes/mentor'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.use(errorHandler);

connectDB().then(() => {
  setupSocket(io);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
