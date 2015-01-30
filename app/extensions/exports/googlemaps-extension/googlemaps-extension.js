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
        console.log(JSON.stringify(params.options));
        context.sandbox.dataStorage.getFeatureById({
            featureId: params.featureId
        },
        function(data){
            var lon = data.geometry.coordinates[1],
                lat = data.geometry.coordinates[0];
            window.open('https://www.google.com/maps/place/' + lat + ',' + lon, '_blank')

        });
    }

    //The ajax call isn't required, but it's a good example.
    function validate(params){
         if(params.featureId && params.layerId){
            context.sandbox.dataStorage.getFeatureById({
                    featureId: params.featureId
                },
                function(data){
                    var valid = context.sandbox.export.utils.validateExportForLayerByDatasource(
                        configuration.id,
                        [data.queryId] //Turn it into an array
                    );

                    valid = valid && data.geometry.type === 'Point';
                    params.callback(valid);
                });

        } else if(params.layerIds && params.layerIds.length){
            params.callback(false);  //Google Maps doesn't do layers
        } else{
            params.callback(false);
        }
    }

	return exposed;
});