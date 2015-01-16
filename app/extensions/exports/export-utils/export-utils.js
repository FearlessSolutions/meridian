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
        }

    };//exposed

    return exposed;
});