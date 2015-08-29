/* MYSQL */
var mysql = require('mysql');
var db_config = require("../config/database.conf.js").database_conf;


/* create connection pooling */
handleDisconnect();

var InboxModel = module.exports = function(config) {

};

InboxModel.prototype.updateHit = function(content_id, hit, callback){
    var query = connection.query("update td_content_hit set hit = ? where content_id = ? ", [hit, content_id], function(err, result) {
        var response;
        if (err) {
            response = {
                message : err,
                statusCode : err.code
            };
            callback(response);
        };
        callback({ statusCode : 200, result : result });
    });
};


function handleDisconnect() {
    console.log("connect db");
    connection = mysql.createPool(db_config);               // Recreate the connection, since
    // the old one cannot be reused.

    connection.getConnection(function(err) {                // The server is either down
        if(err) {                                           // or restarting (takes a while sometimes).
            console.log('[DATABASE] error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);             // We introduce a delay before attempting to reconnect,
        }                                                   // to avoid a hot loop, and to allow our node script to
    });                                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('[DATABASE] CONNECTION LOST, RETRY CONNECT', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {       // Connection to the MySQL server is usually
            handleDisconnect();                             // lost due to either server restart, or a
        } else {                                            // connnection idle timeout (the wait_timeout
            throw err;                                      // server variable configures this)
        }
    });
}

