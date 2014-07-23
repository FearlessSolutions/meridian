var elasticsearch = require('elasticsearch');
var fs = require('fs');


var context;

exports.init = function(thisContext){
    context = thisContext;
};


/**
 * Config options we allow:
 *
 * protocol -- http / https
 * host - host the ES instance sits on
 * port - port the ES instance sits on
 * pfxLocation - pfx/pcks12 certificate path
 * rejectUnauthorized - true / false
 *
 * @returns {es.Client}
 */
exports.newClient = function(options){

    // If no options are provided, use the default ones
    if (!options) {
        options = context.sandbox.config.getConfig().client;
    }

    console.log(options);
    var esOptions = {host:{}, agentConfig:{}};
    if (options.protocol) { esOptions.host.protocol = options.protocol; }
    if (options.host) { esOptions.host.host = options.host; }
    if (options.port) { esOptions.host.port = options.port; }
    if (options.pfxLocation) { esOptions.agentConfig.pfx = fs.readFileSync(options.pfxLocation); }
    if (options.rejectUnauthorized !== 'undefined') { esOptions.agentConfig.rejectUnauthorized = options.rejectUnauthorized; }

    return new elasticsearch.Client(esOptions);
};