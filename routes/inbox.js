var express = require('express');
var router = express.Router();

var Inbox = require('../services/counter.service.js');
var InboxService = new Inbox();

/* Post Counter Add Hit. */
router.get('/label/:label_name', function(request, response, next) {
    var params = {
        label : request.params.label_name,
        phone : request.params.phone,
        run   : request.params.run,
        time  : request.params.time,
    };

    InboxService.addLabel(params, function(result){
        response.status(result.statusCode);
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("X-Powered-By", "microsolutions.workplaceoptions.com v1.0" );
        response.write(JSON.stringify(result), null);
        response.end();
    });
});


module.exports = router;
