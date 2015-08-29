var Counter = require('../services/counter.service.js');
var CounterService = new Counter();

exports.loadAllContentHit = function(){
    CounterService.initLoadHit(function(result){
        console.log(result);
    });
};