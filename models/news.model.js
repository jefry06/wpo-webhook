/* MYSQL */
var mysql = require('mysql');
var db_config = require("../config/database.conf.js").database_conf;


/* create connection pooling */
handleDisconnect();

var NewsModel = module.exports = function(config) {

};

NewsModel.prototype.updateHit = function(content_id, hit, callback){
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

NewsModel.prototype.insertHit = function(content_id, channel_id, hit, callback){
    var query = connection.query("insert into td_content_hit(content_id, channel_id, hit) VALUES(?, ?, ?)", [content_id, channel_id, hit], function(err, result) {
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

NewsModel.prototype.getHit = function(content_id, callback){
    var query = connection.query("select hit from td_content_hit where content_id = ?", [content_id], function(err, rows, field) {
        var response;
        if (err) {
            response = {
                message : err,
                statusCode : err.code
            };
            callback(response);
        };
        callback({ statusCode : 200, totalHit : rows[0].hit });
    });
};

NewsModel.prototype.getAllContentHit = function(callback){
    var query = connection.query("select content_id, hit from td_content_hit", function(err, rows, field) {
        var response;
        if (err) {
            response = {
                message : err,
                statusCode : err.code
            };
            callback(response);
        };
        callback({ statusCode : 200, content_list : rows });
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

