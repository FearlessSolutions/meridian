exports.init = function(context){

    var config = context.sandbox.config.getConfig();
    var client = context.sandbox.elastic.client.newClient();
    var mappings = config.mapping;


    var mappingCallback = function(err, results){
        if (err){
            console.log(err);
        } else {
            console.log("Mapping added for " + this.source);
        }
    };

    var createCallback = function(err, results){

        if (err && err.message && err.message.indexOf("IndexAlreadyExistsException") === -1){
            console.log("Elastic Create Error: " + err.message);
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