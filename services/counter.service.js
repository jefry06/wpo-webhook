/* load library */
var async   = require("async");

/* REDIS */
var redis = require('redis');
var redis_conf = require("../config/redis.conf.js").redis_conf;
var client = '';//redis.createClient(redis_conf.port, redis_conf.host);

var News = require('../models/news.model.js');
var newsModel = new News();

var CounterService = module.exports = function(config) {

};

CounterService.prototype.addHit = function(content_id, channel_id, callback){
    var self = this;
    /*add redis counter*/
    if(parseInt(content_id) > 0 && parseInt(channel_id) > 0){
        client.incr("hit:" + content_id, function(err_incr, id){
            // do something after insert to redis
            if(parseInt(id) == 1){ //for the first time
                newsModel.insertHit(content_id, channel_id, id, function(result){
                    /* do something if needed */
                });
            }else{
                newsModel.updateHit(content_id, id, function(result){
                    /* do something if needed */
                });
            }
            callback({ statusCode : 200, totalHit : id });
        });
    }else{
        callback({ statusCode : 404, totalHit : 0 });
    }
};

CounterService.prototype.getHit = function(content_id, callback){

    /* check to redis */
    client.get('hit:' + content_id, function(err_get, totalHit){
        if(parseInt(totalHit) > 0){
            callback({ statusCode : 200, totalHit : parseInt(totalHit) });
        }else{
            callback({ statusCode : 404, totalHit : 0 });
        }
    });

};

CounterService.prototype.initLoadHit = function(callback){
    /* load to redis */
    newsModel.getAllContentHit(function(result){
        async.eachSeries(result.content_list,function(item, continues){
            client.set('hit:' + item.content_id, item.hit);
            continues();
        },function(err){
            callback('SERVER IS READY TO ROCK AND ROLL');
        });
    });
};
