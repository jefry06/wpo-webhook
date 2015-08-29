var winston = require('winston');
var moment  = require('moment');

var logger = new(winston.Logger)({
    exitOnError: false,
    transports: [
        new(winston.transports.DailyRotateFile)({
            filename: 'webhook.log',
            dirname: __dirname + '/../log/',
            //datePattern: cfg.rollingDatePattern,
            timestamp: timeFormatFn
        }),
        new(winston.transports.Console)({
            colorize: true,
            timestamp: timeFormatFn
        })
    ]
});


var timeFormatFn = function() {
    'use strict';
    return moment().format(cfg.timeFormat);
};
exports.logger = logger;