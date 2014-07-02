// SP: Note none of this code has been tested, please properly test before utilizing.
//
// var config = require('../utils/Config').getConfig();
//var client = require('./client.js').newClient();
//
//exports.deleteRecordsForUserSessionId = function(user, sessionId, callback){
//    client.deleteByQuery({
//        index: config.index.data,
//        routing: user+""+sessionId,
//        body: {
//            query: {
//                "match_all": {}
//            }
//        }
//    }, callback);
//};
//
//exports.deleteAllRecords = function(callback){
//    client.indices.delete({
//        index: config.index.data
//    }, callback);
//};