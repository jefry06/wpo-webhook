/* load library */
var async   = require("async");

/* REDIS */
var redis = require('redis');
var redis_conf = require("../config/redis.conf.js").redis_conf;
var client = redis.createClient(redis_conf.port, redis_conf.host);

var Inbox = require('../models/inbox.model.js');
var inboxModel = new Inbox();

var InboxService = module.exports = function(config) {

};

InboxService.prototype.addLabel = function(params, callback){
    var self = this;
    /* get SMSC Number from inbox table */
    inboxModel.getSMSCNumberFromContact(params.phone, function(result){
        /* if found SMSCNumber */
        if(result){
            console.log("masuk");
            /*clear interval */
            clearInterval(self);
        }else{
            /* call it self till SMSCNumber is found */
            console.log("masuk interval");
            setInterval(self.addLabel(params), (10*1000));
        }
    });


    /*add redis counter*/
    if(parseInt(content_id) > 0 && parseInt(channel_id) > 0){
        client.incr("hit:" + content_id, function(err_incr, id){
            // do something after insert to redis
            if(parseInt(id) == 1){ //for the first time
                inboxModel.insertHit(content_id, channel_id, id, function(result){
                    /* do something if needed */
                });
            }else{
                inboxModel.updateHit(content_id, id, function(result){
                    /* do something if needed */
                });
            }
            callback({ statusCode : 200, totalHit : id });
        });
    }else{
        callback({ statusCode : 404, totalHit : 0 });
    }
};
