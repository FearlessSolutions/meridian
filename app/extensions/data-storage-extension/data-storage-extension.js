define([
    'jquery',
    'backbone'
], function($, Backbone){
    /**
     * @exports data-storage-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.dataStorage} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         */
        "initialize": function(app) {
            /**
             * @namespace Sandbox.dataStorage
             * @memberof Sandbox 
             */
            /**
             * @var
             * @instance
             * @property {Object} datasets - 
             * @property {Object} columns -
             * @property {String} columns.featureId - Property value: Feature ID
             * @property {String} columns.layerId - Property value: Layer ID
             * @property {String} columns.lat - Property value: Lat
             * @property {String} columns.lon - Property value: Lon
             * @property {String} columns.dataService - Property value: Data Service  
             * @property {Function} addData
             * @memberof Sandbox.dataStorage 
             */
            var dataStorage = {
				"datasets": {
                },
                "columns": {
                    "featureId":"Feature ID",
                    "layerId":"Layer ID",
                    "lat": "Lat",
                    "lon": "Lon",
                    "dataService": "Data Service"
                },
                /**
                 * @function
                 * @instance
                 * @param {Object} params 
                 * @memberof Sandbox.dataStorage
                 */

                 
                "addData": function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
                    if(dataStorage.datasets) {
                        dataStorage.updateColumns({"data": params.data});
                    }
                },
                "getDatasetWhere": function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                "updateColumns": function(params) {
                    $.each(params.data, function(k, v) {
                        // Skipping id field because it is for backbone modeling
                        if(($.type(v) === 'string' || $.type(v) === 'number' || $.type(v) === 'boolean') && k !== 'id' && k !== 'type') {
                            if(!dataStorage.columns[k]) {
                                dataStorage.columns[k] = k;
                            }
                        }
                    });
                },
                "getColumns": function() {
                    return dataStorage.columns;
                },
                "clear": function() {
                    dataStorage.datasets = {};
                },
                "getFeatureById": function(params, callback) {
                    var featureId = params.featureId;
                    var feature = {};
                    var ajax = $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + featureId
                    }).done(function(data){
                        callback(data);
                    });

                    return ajax;
                }
			};

            app.sandbox.dataStorage = dataStorage;

        }
    };

    return exposed;

});
