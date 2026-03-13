const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'taskdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

// Redis client setup
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Redis error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

// Initialize database table
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database init error:', err);
  }
};

initDB();

// Health check endpoint (enhanced with Redis check)
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown'
    }
  };
  
  // Check database
  try {
    await pool.query('SELECT 1');
    health.services.database = 'connected';
  } catch (err) {
    health.services.database = 'disconnected';
    health.status = 'unhealthy';
  }
  
  // Check Redis
  try {
    await redisClient.ping();
    health.services.redis = 'connected';
  } catch (err) {
    health.services.redis = 'disconnected';
    health.status = 'degraded'; // Can work without cache
  }
  
  res.json(health);
});

// Get all tasks (WITH CACHING!)
app.get('/api/tasks', async (req, res) => {
  try {
    const cacheKey = 'tasks:all';
    
    // Try to get from cache first
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      console.log('✅ Cache HIT - Returning from Redis');
      return res.json(JSON.parse(cached));
    }
    
    console.log('❌ Cache MISS - Querying database');
    
    // Cache miss - query database
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    
    // Store in cache with 5 minute TTL
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result.rows));
    console.log('💾 Stored in cache for 5 minutes');
    
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create task (WITH CACHE INVALIDATION!)
app.post('/api/tasks', async (req, res) => {
  const { title, description, due_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
      [title, description, due_date]
    );
    
    // Invalidate cache - data changed!
    await redisClient.del('tasks:all');
    console.log('🗑️  Cache invalidated - new task created');
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Toggle task completion (WITH CACHE INVALIDATION!)
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );
    
    // Invalidate cache - task updated!
    await redisClient.del('tasks:all');
    console.log('🗑️  Cache invalidated - task toggled');
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete task (WITH CACHE INVALIDATION!)
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    
    // Invalidate cache - task deleted!
    await redisClient.del('tasks:all');
    console.log('🗑️  Cache invalidated - task deleted');
    
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// CI/CD test - automatic deployment!
