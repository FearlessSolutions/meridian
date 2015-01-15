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
                    context.export.options[exportId].datasources.push(datasourceId);
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
            context.sandbox.export.validate[id] = params.export;
        }
    };//exposed

    return exposed;
});