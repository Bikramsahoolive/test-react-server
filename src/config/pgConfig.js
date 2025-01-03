
const { Pool } = require('pg');

const client = new Pool({
  user: 'postgres',         
  host: 'localhost',             
  database: 'userDB',     
  password: 'password',     
  port: 5432,                    
});


client.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch((err) => console.error('Connection error', err.stack));


// client.query('SELECT * FROM "UserData"')
//   .then(res => console.log(res.rows))
//   .catch(err => console.error(err));

  module.exports = client;
