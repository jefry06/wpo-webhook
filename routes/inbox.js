var express = require('express');
var router = express.Router();

/* logger */
var logger = require('../helper/logger.js').logger;

var Inbox = require('../services/inbox.service.js');
var InboxService = new Inbox();

/* Post Counter Add Hit. */
router.post('/label/:labelname', function(request, response, next) {     
    var params = {
        label : request.params.labelname,
        phone : request.body.phone,
        run   : request.body.run,
        time  : request.body.time,
    };
    logger.info(params);
    InboxService.receiveLabelJob(params, function(result){
        response.status(result.statusCode);
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("X-Powered-By", "microsolutions.workplaceoptions.com v1.0" );
        response.write(JSON.stringify(result), null);
        response.end();
    });
});

module.exports = router;
