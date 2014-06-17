var config = require('../utils/Config').getConfig();
var client = require('./client.js').newClient();

var mappings = config.mapping;

exports.init = function(){


    var mappingCallback = function(err, results){
        if (err){
            console.log(err);
        } else {
            console.log("Mapping added for " + this.source);
        }
    };

    var createCallback = function(err, results){

        if (err){
            console.log(err);
        }

        client.indices.putMapping(this.mapping, mappingCallback.bind({source: this.source}));
    };

    for (var source in mappings){
        if (mappings.hasOwnProperty(source)){
            var mapping = mappings[source];
            var indexName = mapping.index;

            client.indices.create({
                index: indexName
            }, createCallback.bind({source: source, mapping: mapping}));
        }
    }
};