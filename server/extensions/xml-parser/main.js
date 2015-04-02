var jsxml = require('./jsxml');

exports.init = function(context){
    context.sandbox.jsxml = jsxml;
};