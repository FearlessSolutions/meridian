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
         * @param {Object} app Instance of the Meridian application.
         */
        "initialize": function(app) {
            /**
             * @namespace Sandbox.dataStorage
             * @memberof Sandbox 
             */
            var dataStorage = {
                /**
                 * Place holder object for datasets.
                 * @var
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
				"datasets": {
                },
                /**
                 * @var
                 * @instance
                 * @property {String} columns.featureId - Property value: Feature ID
                 * @property {String} columns.layerId - Property value: Layer ID
                 * @property {String} columns.lat - Property value: Lat
                 * @property {String} columns.lon - Property value: Lon
                 * @property {String} columns.dataService - Property value: Data Service  
                 * @memberof Sandbox.dataStorage
                 */
                "columns": {
                    "featureId":"Feature ID",
                    "layerId":"Layer ID",
                    "lat": "Lat",
                    "lon": "Lon",
                    "dataService": "Data Service"
                },
                /**
                 * Add data to datasets member and update columns using
                 * {@link Sandbox.dataStorage#updateColumns updateColumns} function.
                 * @function
                 * @instance
                 * @param {Object} params - Contains the data to be added.
                 * @param {Object} params.data - Property added to the 
                 * {@link Sandbox.dataStorage#datasets datasets} member found in {@link Sandbox.dataStorage}.
                 * @memberof Sandbox.dataStorage
                 */
                "addData": function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
                    if(dataStorage.datasets) {
                        dataStorage.updateColumns({"data": params.data});
                    }
                },
                /**
                 * getDatasetWhere description needed.
                 * @function
                 * @instance
                 * @param {Object} params - The dataset.
                 * @param {String} params.datasetId - Id of the dataset.
                 * @param {String} params.criteria - Criteria used to get the desired dataset.
                 * @memberof Sandbox.dataStorage
                 */
                getDatasetWhere: function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                /**
                 * Update all datastorage columns.
                 * @function
                 * @instance
                 * @param {Object} params - 
                 * @param {Object} params.data - Properties used to update columns.
                 * @memberof Sandbox.dataStorage
                 */
                updateColumns: function(params) {
                    $.each(params.data, function(k, v) {
                        // Skipping id field because it is for backbone modeling
                        if(($.type(v) === 'string' || $.type(v) === 'number' || $.type(v) === 'boolean') && k !== 'id' && k !== 'type') {
                            if(!dataStorage.columns[k]) {
                                dataStorage.columns[k] = k;
                            }
                        }
                    });
                },
                /**
                 * Returns column member found in {@link Sandbox.dataStorage}.
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
                getColumns: function() {
                    return dataStorage.columns;
                },
                clear: function() {
                    dataStorage.datasets = {};
                },
                getFeatureById: function(params, callback) {
                    var featureId = params.featureId;
                    var feature = {};
                    var ajax = $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/' + featureId
                    }).done(function(data) {
                        callback(data);
                    });

                    return ajax;
                },
                getResultsByQueryAndSessionId: function(queryId, sessionId, start, size, callback) {
                    $.ajax({
                        type: "GET",
                        url: app.sandbox.utils.getCurrentNodeJSEndpoint() + '/feature/query/' + queryId + '/session/' + sessionId +
                            '?start=' + start + '&size=' + size
                    }).done(function(data) {
                        callback(null, data);
                    }).error(function(error) {
                        callback(error, null);
                    });
                }
			};

            app.sandbox.dataStorage = dataStorage;

        }
    };

    return exposed;

});
