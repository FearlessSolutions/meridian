var config = require('../utils/Config').getConfig();
var _ = require('underscore');
var uuid = require('node-uuid');
var client = require('./client.js').newClient();
var Metadata = require('./metadata');

/**
 * Username/sessionId are added to enforce that we have some kind of security tag to
 * filter results on. Note: routing strictly tells us which shard to look at and doesn't
 * provide any implicit filtering.
 */
var writeJSON = function(userName, sessionId, routing, index, dataType, data, callback){

    if (!_.isArray(data)){
        data = [data];
    }
    var bulk = [];
    data.forEach(function(record){
        var newIndex = {
            index: {
                _index: index,
                _type: dataType
            }
        };
        if (record.id){ newIndex.index._id = record.id; }
        if (routing){ newIndex.index._routing = routing; }

        bulk.push(newIndex);

        // Inject security tag
        record.data.userId = userName;
        record.data.sessionId = sessionId;

        bulk.push(record.data);
    });
    client.bulk({body: bulk}, callback);
};

exports.writeMetadata = function(userName, sessionId, queryId, metadata, callback){

    var meta = {
        id: queryId,
        data: metadata
    };

    writeJSON(userName, sessionId, null, config.index.metadata, "metadata", meta, callback);
};


exports.writeGeoJSON = function(userName, sessionId, queryId, dataType, geoJSON, callback){

    var routingStr = userName+""+sessionId;
    if (!_.isArray(geoJSON)){
        geoJSON = [geoJSON];
    }

    Metadata.getMetadataByQueryId(queryId, function(err, meta){
        if (!meta || meta.status === 404 && meta.message === 'Not Found'){
            meta = {
                queryId: queryId,
                numRecords: 0
            };
        }

        var records = [];
        geoJSON.forEach(function(record){
            var featureId = uuid.v4();

            // Putting in both locations for now, change them later
            record.properties.featureId = featureId;
            record.properties.queryId = queryId;
            record.featureId = featureId;
            record.queryId = queryId;

            if (!meta.keys){
                meta.keys = {};
            }

            _.each(_.keys(record.properties), function(key){
                meta.keys[key] = true;
            });

            records.push({
                id: featureId,
                data: record
            });
        });

        meta.numRecords += geoJSON.length;
        Metadata.saveMetadata(userName, sessionId, queryId, meta, function(){
            writeJSON(userName, sessionId, routingStr, config.index.data, dataType, records, callback);
        });
    });
};