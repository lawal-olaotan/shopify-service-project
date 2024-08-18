import { createClient } from 'redis'
import dotenv from "dotenv"

dotenv.config();

export const client = createClient({
    password:process.env.REDIS_PASS,
    socket:{
        host:process.env.REDIS_CLIENT,
        port:11516
    }

})


// Handle connection events
client.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  client.on('ready', () => {
    console.log('Redis client ready');
  });
  
  client.on('end', () => {
    console.log('Redis client disconnected');
  });
  
  client.on('error', (err) => {
    console.error('Redis error:', err);
  });
  
  client.on('reconnecting', () => {
    console.log('Redis client reconnecting');
  });
  
  // Connect the client
  (async () => {
    try {
      await client.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  })();