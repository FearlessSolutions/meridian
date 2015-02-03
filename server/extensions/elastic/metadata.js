var save = require('./save');
var query = require('./query');
var _ = require('underscore');
var moment = require('moment');

exports.getMetadataByQueryId = function(userId, queryId, callback){
    query.getMetadataByQueryId(userId, queryId, function(err, meta){
        if (err){
            callback(err);
        } else {
            callback(null, new MetadataBuilder(meta._source));
        }
    });
};

exports.getMetadataBySessionId = function(userId, sessionId, callback){
    query.getMetadataBySessionId(userId, sessionId, function(err, meta){
        if (err) {
            callback(err);
        } else {
            var ret = {};
            meta.hits.hits.forEach(function(ele){
                ret[ele._source.queryId] = new MetadataBuilder(ele._source);
            });
            callback(null, ret);
        }
    });
};
exports.getMetadataByTerm = function(userId, callback){
    query.getMetadataByTerm(userId, function(err, meta){
        if (err) {
            callback(err);
        } else {
            var ret = {};
            meta.hits.hits.forEach(function(ele){
                ret[ele._source.queryId] = new MetadataBuilder(ele._source);
            });
            callback(null, ret);
        }
    });
};

exports.getMetadataByUserId = function(userId, callback){
    query.getMetadataByUserId(userId, function(err, meta){
        if (err) {
            callback(err);
        } else {
            var ret = {};
            meta.hits.hits.forEach(function(ele){
                ret[ele._source.queryId] = new MetadataBuilder(ele._source);
            });
            callback(null, ret);
        }
    });
};

function saveMetadata(userName, sessionId, queryId, metadata, callback){
    save.writeMetadata(userName, sessionId, queryId, metadata, callback);
};


// TODO: ExpireAt should be calculated from a config and that config should
// TODO: be the same as the TTL for features
exports.create = function(userName, sessionId, queryId){
    var seedMeta = {
        userId: userName,
        sessionId: sessionId,
        queryId: queryId,
        keys: {},
        createdOn: moment().format('X'),
        expireOn: moment().add(7, 'days').format('X'),
        environment: process.env.NODE_ENV,
        queryBbox: {},
        numRecords: 0,
        queryName: "",
        rawQuery: {},
        dataSource: ""
    }

    return new MetadataBuilder(seedMeta);
}

var MetadataBuilder = function(seedMeta){
    var meta = seedMeta;

    return {
        addKeys: function(keyArray){
            _.each(keyArray, function(key){
                meta.keys[key] = true;
            });
            return this;
        },
        setQueryName: function(queryName){
            meta.queryName = queryName;
            return this;
        },
        setRawQuery: function(rawQuery){
            meta.rawQuery = rawQuery;
            return this;
        },
        setDataSource: function(dataSource){
            meta.dataSource = dataSource;
            return this;
        },
        setQueryBbox: function(boxObj){
            meta.queryBbox.top = boxObj.top || boxObj.maxLat;
            meta.queryBbox.bottom = boxObj.bottom || boxObj.minLat;
            meta.queryBbox.left = boxObj.left || boxObj.minLon;
            meta.queryBbox.right = boxObj.right || boxObj.maxLon;
            return this;
        },
        setNumRecords: function(numRecords){
            meta.numRecords = numRecords;
            return this;
        },
        getCreateTime: function(){
            return meta.createdOn;
        },
        getExpireTime: function(){
            return meta.expireOn;
        },
        getKeys: function(){
            return meta.keys;
        },
        getNumRecords: function(){
            return meta.numRecords;
        },
        toJSON: function(){
            return meta;
        },
        commit: function(callback){
            saveMetadata(meta.userId, meta.sessionId, meta.queryId, meta, callback || function(){})
        }
    }
}