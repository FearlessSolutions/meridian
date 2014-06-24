define([], function (){
    var exposed = {
        initialize: function() {
            if(this.sandbox.mapConfiguration.defaultMapEngine === 'OpenLayers') {
                requireStuff(this);
            }

            this.sandbox.on('map.renderer.change', function(params) {
                if(params.provider === 'OpenLayers') {
                    requireStuff(this);
                } else {
                    // Destroy OL Map
                }
            });
        }
    };

    function requireStuff(thisContext) {
        var context = thisContext;
        
        //Require modules needed for OpenLayers
        require([
            './components/rendering-engines/map-openlayers/map/core',
            'text!./components/rendering-engines/map-openlayers/map-openlayers.css', 
            'text!./components/rendering-engines/map-openlayers/map-openlayers.hbs',
            './components/rendering-engines/map-openlayers/map-api-publisher',
            './components/rendering-engines/map-openlayers/map-api-subscriber',
            'handlebars'
        ], function(
            mapCore,
            olMapRendererCSS,
            olMapRendererHBS,
            olMapRendererPublisher,
            olMapRendererSubscriber
        ){
            //do something
            context.sandbox.utils.addCSS(olMapRendererCSS, 'rendering-engines-map-openlayers-component-style');

            var olMapRendererTemplate = Handlebars.compile(olMapRendererHBS);
            var html = olMapRendererTemplate();
            context.html(html);

            mapCore.init(context);
            olMapRendererPublisher.init(context);
            olMapRendererSubscriber.init(context);
        });
    }

    return exposed;
});
