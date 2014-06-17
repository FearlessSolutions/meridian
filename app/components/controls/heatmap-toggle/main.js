
define([
    'text!./heatmap-toggle.css',
    'text!./heatmap-toggle.hbs',
    './heatmap-toggle',
    './heatmap-toggle-publisher',
    './heatmap-toggle-subscriber',
    'handlebars'
], function (
    heatmapToggleControlCSS,
    heatmapToggleControlHBS, 
    heatmapToggleControl,
    heatmapToggleControlPublisher, 
    heatmapToggleControlSubscriber
){

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(heatmapToggleControlCSS, 'tools-heatmap-toggle-component-style');

            var heatmapToggleControlTemplate = Handlebars.compile(heatmapToggleControlHBS);
            var html = heatmapToggleControlTemplate();
            this.html(html);

            heatmapToggleControlPublisher.init(this);
            heatmapToggleControlSubscriber.init(this);
            heatmapToggleControl.init(this);
        }
    };

});




