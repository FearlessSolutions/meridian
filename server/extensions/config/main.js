var config = require('./Config');

exports.init = function(context){
    context.sandbox.config = config;
};