var elasticsearch = require('elasticsearch');
var fs = require('fs');


var context,
    singletonClient;

exports.init = function(thisContext){
    context = thisContext;
};


/**
 * Returns the singleton client, creating a new one if one doesn't exist
 *
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
exports.getClient = function(options){

    if(singletonClient){
        return singletonClient;
    }

    // If no options are provided, use the default ones
    if (!options) {
        options = context.sandbox.config.getConfig().client;
    }

    var esOptions = {host:{}, agentConfig:{}};
    if (options.protocol) { esOptions.host.protocol = options.protocol; }
    if (options.host) { esOptions.host.host = options.host; }
    if (options.port) { esOptions.host.port = options.port; }
    if (options.pfxLocation) { esOptions.agentConfig.pfx = fs.readFileSync(options.pfxLocation); }
    if (options.passphraseLocation) {
        esOptions.agentConfig.passphrase = fs.readFileSync(options.passphraseLocation, 'utf-8').trim();
    }
    if (options.rejectUnauthorized !== 'undefined') { esOptions.agentConfig.rejectUnauthorized = options.rejectUnauthorized; }

    singletonClient = new elasticsearch.Client(esOptions);
    return singletonClient;
};

/**
 * Manually refresh the indicies to make waiting documents available
 * @param callback
 */
exports.refresh = function(callback){

    //If there is not a client, no need to refresh
    if(!singletonClient){
        callback();
    }

    singletonClient.indices.refresh('',callback);

};