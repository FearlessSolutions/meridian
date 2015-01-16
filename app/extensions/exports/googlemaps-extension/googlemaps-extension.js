define([
'./googlemaps-configuration'
], function(configuration) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                throw 'Requires export-utils extension to be loaded.'
            }

            app.sandbox.export.utils.addExport({
                id: configuration.id,
                option: configuration,
                export: exportFunction,
                validate: validate
            });
        }
	};

    function exportFunction(params){

    }

    function validate(params){
        var valid = true;

        if(params.featureId){
            valid = false
        } else if(params.layerIds){
            context.sandbox.utils.each(params.layerIds, function(index, layerId){
                //Check allocated datasources for this export
                if(context.sandbox.export.options[configuration.id].datasources.indexOf(layerId) === -1){
                    valid = false;

                    return false; //Stop the loop
                }
            });

        } else {
            //error?
            valid = false;
        }

        params.callback(valid);
    }

	return exposed;
});