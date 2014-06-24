define([
    'text!./map-openlayers.css', 
    'text!./map-openlayers.hbs',
    './map-openlayers',
    './map-openlayers-publisher',
    './map-openlayers-subscriber',
    './clustering/clustering',
    './clustering/clustering-publisher',
    './clustering/clustering-subscriber',
    './heat/heatmap',
    './heat/heatmap-subscriber',
    './heat/heatmap-publisher',
    'handlebars'
], function (olMapRendererCSS, olMapRendererHBS, olMapRenderer, olMapRendererPublisher, olMapRendererSubscriber,
                olClustering, olClusteringPub, olClusteringSub, olHeatmap, olHeatmapSub, olHeatmapPub) {

    return {
        initialize: function() {

            this.sandbox.utils.addCSS(olMapRendererCSS, 'rendering-engines-map-openlayers-component-style');

            var olMapRendererTemplate = Handlebars.compile(olMapRendererHBS);
            var html = olMapRendererTemplate();
            this.html(html);

            olMapRendererPublisher.init(this);
            olMapRenderer.init(this);
            olMapRendererSubscriber.init(this);
            olClustering.init(this);
            olClusteringPub.init(this);
            olClusteringSub.init(this);
            olHeatmap.init(this);
            olHeatmapSub.init(this);
            olHeatmapPub.init(this);
        }
    };
});
