const mysql = require('mysql');

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const expectedToken = process.env.token;

  if (data.verification_token !== expectedToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }

  const dbConfig = JSON.parse(process.env.database);

  const connection = mysql.createConnection(dbConfig);

  const insertQuery = 'INSERT INTO donation (email, amount) VALUES (?, ?)';

  return new Promise((resolve, reject) => {
    connection.query(insertQuery, [data.email, data.amount], (error, results, fields) => {
      connection.end();

      if (error) {
        reject({
          statusCode: 500,
          body: JSON.stringify({ message: "Database error" }),
        });
      }

      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: "Donation recorded" }),
      });
    });
  });
};
