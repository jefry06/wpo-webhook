/* load library */
var async   = require("async");
var request = require('request');
/* REDIS */
var redis = require('redis');
var redis_conf = require("../config/redis.conf.js").redis_conf;
var client = '';//redis.createClient(redis_conf.port, redis_conf.host);

/* logger */
var logger = require('../helper/logger.js').logger;

var Inbox = require('../models/inbox.model.js');
var inboxModel = new Inbox();

var InboxService = module.exports = function(config) {

};

InboxService.prototype.receiveLabelJob = function(params, callback){    
    var self = this;
    
    /* whatever will be will be, the future not ours to see */   
    var intervalId = setInterval(function(){
        self.addLabel(params, function(resultAddLabel){
            var result = resultAddLabel.result;

            if(resultAddLabel.status){
                logger.info('[MSGID : ' + result.ID + '] SMSCNumber Found : ' + result.SMSCNumber);
                clearInterval(intervalId);

                /* get factory configuration */
                inboxModel.getFactory(result.RecipientID, function(factoryResult){
                    var factory = factoryResult.data;
                    var factory_config = JSON.parse(factory.configuration);

                    /* hit api to get label list*/
                    var label_options = {
                        url : factory_config.RelayersAPIURL + "/api/v1/labels.json?name=question",
                        headers: {
                            'Authorization': 'Token ' + factory_config.RelayersAPIToken
                        }
                    };
                    logger.info('[MSGID : ' + result.ID + '] Get label UUID from RAPIDPRO ');
                    request.get(label_options, function(error, response, body){
                        if (!error && response.statusCode == 200) {
                            var info = JSON.parse(body);
                            var label_uuid = info.results[0].uuid;

                            /* uuid label found then set message label as question */
                            var question_options = {
                                url : factory_config.RelayersAPIURL + "/api/v1/message_actions.json",
                                json : JSON.stringify({
                                    messages : result.SMSCNumber,
                                    action : 'label',
                                    label_uuid : label_uuid
                                }),
                                headers: {
                                    'Authorization': 'Token ' + factory_config.RelayersAPIToken
                                }
                            };
                            logger.info('[MSGID : ' + result.ID + '] POST Message to RAPIDPRO ');
                            request.post(question_options, function(error_, response_, body_){
                                if (!error_ && response_.statusCode == 200) {
                                    logger.info("[MSGID : ' + result.ID + '] SMSCNumber : " + result.SMSCNumber + " labeled As Question ");
                                }
                            });
                        }                                                
                    });

                });

            }else{
                logger.info('[MSGID : ' + result.ID + '] SMSCNumber from ' + params.phone + ' still null, waiting for 20 seconds then check again');
            }
        });
    }, 20*1000);


    callback({ statusCode : 200, message : "success" }); 
    
};


InboxService.prototype.addLabel = function(params, callback){    
    var self = this;
    /* get SMSC Number from inbox table */
    inboxModel.getSMSCNumberFromContact(params.phone, function(result){
        /* if found SMSCNumber */
        if(result.data.SMSCNumber){
            callback({ status: true, result : result.data });
        }else{
            /* call it self till SMSCNumber is found */            
            callback({ status: false, result : result.data });            
        }
    });    
    
};
