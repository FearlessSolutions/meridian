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
                 * Variable used to hold all datasets.
                 * @namespace Sandbox.dataStorage.datasets
                 * @memberof Sandbox.dataStorage
                 */
				"datasets": {
                },
                /**
                 * These properties are used by the datagrid as the columns shown in the grid.
                 * @namespace Sandbox.dataStorage.columns
                 * @property {String} columns.featureId   - Property value: Feature ID
                 * @property {String} columns.layerId     - Property value: Layer ID
                 * @property {String} columns.lat         - Property value: Lat
                 * @property {String} columns.lon         - Property value: Lon
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
                 * Add data to {@link Sandbox.dataStorage.datasets datasets} and 
                 * update {@link Sandbox.dataStorage.columns columns} using
                 * {@link Sandbox.dataStorage#updateColumns updateColumns} function.
                 * @function
                 * @instance
                 * @param {Object} params      - Contains the data to be added.
                 * @param {Object} params.data - Property added to {@link Sandbox.dataStorage.datasets}.
                 * @memberof Sandbox.dataStorage
                 */
                "addData": function(params) {
                    dataStorage.datasets[params.datasetId].add(params.data);
                    if(dataStorage.datasets) {
                        dataStorage.updateColumns({"data": params.data});
                    }
                },
                /**
                 * Get a dataset based on an Id and criteria provided.
                 * @function
                 * @instance
                 * @param {Object} params           - Object with the required properties.
                 * @param {String} params.datasetId - Id of the dataset.
                 * @param {String} params.criteria  - Criteria used to get the desired dataset.
                 * @return {Object|Array} Matching dataset with the criteria provided. 
                 * If no value found it returns and empty array.
                 * @memberof Sandbox.dataStorage
                 */
                getDatasetWhere: function(params) {
                    return (dataStorage.datasets[params.datasetId]) ? dataStorage.datasets[params.datasetId].where(params.criteria) : [];
                },
                /**
                 * Update all {@link Sandbox.dataStorage dataStorage} {@link Sandbox.dataStorage.columns columns}.
                 * @function
                 * @instance
                 * @param {Object} params      - Contains the data used to update the columns.
                 * @param {Object} params.data - Properties used to update {@link Sandbox.dataStorage.columns}.
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
                 * @function
                 * @instance
                 * @return {Object} {@link Sandbox.dataStorage.columns}
                 * @memberof Sandbox.dataStorage
                 */
                getColumns: function() {
                    return dataStorage.columns;
                },
                /**
                 * Clear all contents in {@link Sandbox.dataStorage.datasets datasets}.
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
                clear: function() {
                    dataStorage.datasets = {};
                },
                /**
                 * Retrieves feature by id using server end point: 
                 * {@link Sandbox.utils#getCurrentNodeJSEndpoint endpoint}/feature/featureId
                 * @function
                 * @instance
                 * @param {Object}   params          
                 * @param {String}   params.featureId - Id of the desired feature.
                 * @param {Function} callback         - Used when ajax.done occurs. 
                 * @memberof Sandbox.dataStorage
                 */
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
                /**
                 * Retrieves results based on query and session Id using: 
                 * {@link Sandbox.utils#getCurrentNodeJSEndpoint endpoint}
                 * /feature/query/queryId/session/sessionId?start=param&size=param
                 * @param  {String}   queryId   - Id of the query where results want to be found.
                 * @param  {String}   sessionId - Id of the session where results want to be found.
                 * @param  {String}   start     - Description needed.
                 * @param  {String}   size      - Description needed.
                 * @param  {Function} callback  - Used when ajax.done occurs.
                 * @function
                 * @instance
                 * @memberof Sandbox.dataStorage
                 */
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
