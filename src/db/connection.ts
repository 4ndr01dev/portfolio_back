const {Pool} = require('pg');

const pool = new Pool({
      user: 'androidev',
  host: 'localhost',
  database: 'portfolio_db',
  password: 'aoie420ndrdv',
  port: 5432,
})

module.exports = pool