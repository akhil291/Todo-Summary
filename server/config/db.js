
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to PostgreSQL database!');
  client.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `, (err, res) => {
    done();
    if (err) {
      console.error('Error creating todos table:', err);
    } else {
      console.log('Todos table checked/created successfully.');
    }
  });
});

module.exports = pool;