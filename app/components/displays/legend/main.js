define([
    'text!./legend.css',
    'text!./legend.hbs',
    './legend',
    './legend-subscriber',
    './legend-publisher',
    'handlebars'
], function (legendCSS, legendHBS, legend, legendSubscriber, legendPublisher) {

    return {
        initialize: function() {
            var legendTemplate = Handlebars.compile(legendHBS);
            var html = legendTemplate();
            this.html(html);
            this.sandbox.utils.addCSS(legendCSS, 'display-legend-component-style');

            legend.init(this);
            legendSubscriber.init(this);
            legendPublisher.init(this);
        }
    };
                
});