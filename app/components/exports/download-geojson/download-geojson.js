define([
], function(){

    var context;

    var exposed = {
        init: function(app) {
            context = app;
        },
        //TODO: Expand this to allow for an array of featureIds
        /**
         * Expected params
         *
         * featureId:String - featureId of the feature to be downloaded
         *
         * @param params
         */
        downloadGeoJSONById: function(params){
            window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + params.featureId);
        }
    };

    return exposed;

});
