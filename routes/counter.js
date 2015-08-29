var express = require('express');
var router = express.Router();

var Counter = require('../services/counter.service.js');
var CounterService = new Counter();

/* Post Counter Add Hit. */
router.get('/add/:content_id/:channel_id', function(request, response, next) {
    var content_id =  request.params.content_id;
    var channel_id =  request.params.channel_id;

    CounterService.addHit(content_id, channel_id, function(result){
        response.status(result.statusCode);
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("X-Powered-By", "Okezone.com v1.0" );
        response.write(JSON.stringify(result), null);
        response.end();
    });
});

router.get('/get/:content_id', function(request, response, next) {
    var content_id =  request.params.content_id;

    CounterService.getHit(content_id, function(result){
        response.status(result.statusCode);
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("X-Powered-By", "Okezone.com v1.0" );
        response.write(JSON.stringify(result), null);
        response.end();
    });
});


module.exports = router;
