define([
], function() {
    var context,
        exposed;

    exposed = {
        initialize: function(app) {
            context = app;

            app.sandbox.export = {
                export: {},
                options: {},
                validate: {},
                datasources: {},
                utils: exposed
            };
        },

        /**
         * Add a datasource to the export option objects
         * @param params
         */
        addDatasource: function(params){
            var datasourceId = params.id;

            params.exports.forEach(function(exportId){
                if(exportId in context.sandbox.export.options){
                    context.sandbox.export.options[exportId].datasources.push(datasourceId);
                }
            });
        },

        /**
         * Set up the export option on the sandbox
         * @param params
         */
        addExport: function(params){
            var id = params.id;

            context.sandbox.export.options[id] = params.option;
            if(! Array.isArray(params.option.datasources)){
                context.sandbox.export.options[id].datasources = [];
            }
            context.sandbox.export.export[id] = params.export;
            context.sandbox.export.validate[id] = params.validate;
        },

        validateExportForLayerByDatasource: function(exportId, layerIds){
            var found = true;

            if(layerIds.length === 0){
                return false;
            }

            context.sandbox.utils.each(layerIds, function(index, layerId){
                var layerInfo = context.sandbox.dataStorage.datasets[layerId];

                //Check allocated datasources for this export
                if(context.sandbox.export.options[exportId].datasources.indexOf(layerInfo.dataService) === -1){
                    found = false;

                    return false; //Stop the loop
                }
            });

            return found;
        },
        /**
         * Check server for file export by calling HEAD
         * @param datasetIds
         * @param callback
         */
        checkFileHead: function(datasetIds, callback){
            var suffix = $.param({
                ids: datasetIds
            });

            context.sandbox.utils.ajax({
                type: 'HEAD' ,
                url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/export/file?' + suffix,
                cache: false
            })
                .done(function(responseText, status, jqXHR) {
                    if (jqXHR.status === 204){
                        callback({
                            messageType: 'warning',
                            messageText: 'No data'
                        }, null);
                    } else {
                        callback(null, true);

                    }
                })
                .error(function(e) {
                    callback({
                        messageType: 'warning',
                        messageText: 'No data'
                    }, null);
                });
        },
        getFileExportUrl: function(datasetIds, filename, fileType){
            var query;

            //Make sure the file ends with the correct type, case insensitive
            if(! context.sandbox.utils.endsWith(filename.toLowerCase(), '.' + fileType.toLowerCase())){
                filename += '.' + fileType;
            }
            query = $.param({
                filename: filename,
                ids: datasetIds
            });

            return context.sandbox.utils.getCurrentNodeJSEndpoint() + '/export/file/' + fileType + '?' + query;
        },
        verifyOnlyPointsInLayer: function(layerIds){
            var valid = true;

            context.sandbox.utils.each(layerIds, function(index, layerId){
                var layer = context.sandbox.dataStorage.datasets[layerId];

                context.sandbox.utils.each(layer.models, function(index, feature){
                    valid = exposed.verifyFeatureIsPoint(feature);

                    if(!valid){ //If not valid, exit the loop
                        return false;
                    }
                });

                if(!valid){
                    return false; //If not valid, exit the loop
                }
            });

            return valid;
        },
        /**
         * Make sure that the given filename could be saved
         * @param filename
         * @returns {Array|{index: number, input: string}|*}
         */
        validateFilename: function(filename){
            return filename.match(/[\\/:*?"<>|&]/) ? false : true;
        },
        verifyFeatureIsPoint: function(feature){
            return feature.attributes.geometry.type === 'Point' ;
        }
    };//exposed

    return exposed;
});