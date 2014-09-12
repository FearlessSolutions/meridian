define([
    'jquery',
    'backbone'
], function($, Backbone){
    var exposed = {
        "initialize": function(app) {
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
