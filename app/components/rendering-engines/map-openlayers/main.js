define([
    './map/core',
    'text!./map-openlayers.css',
    'text!./map-openlayers.hbs',
    './map-api-publisher',
    './map-api-subscriber',
    'handlebars'], function (mapCore,
                             olMapRendererCSS,
                             olMapRendererHBS,
                             olMapRendererPublisher,
                             olMapRendererSubscriber){
    return {
        initialize: function() {
            var context = this;
            this.sandbox.utils.addCSS(olMapRendererCSS, 'rendering-engines-map-openlayers-component-style');

            var olMapRendererTemplate = Handlebars.compile(olMapRendererHBS);
            var html = olMapRendererTemplate();
            this.html(html);

            mapCore.init(context);
            olMapRendererPublisher.init(context);
            olMapRendererSubscriber.init(context);
        },
        getMap: mapCore.getMap
    };
});
