
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'nikica076601878',
    database : 'testov_za_proekti'
  });
   
  connection.connect((error) =>{
      if (error) {
          console.log('Problem with conection'+ error.message)
      } else {
        console.log('DB connect')
      } 
  });

  module.exports = connection;