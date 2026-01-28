import { createClient } from 'redis';

const db = await createClient()
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

export default db;
