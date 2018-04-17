define([
    'text!./legend.css',
    'text!./legend.hbs',
    './legend',
    './legend-mediator',
    'handlebars'
], function (
    legendCSS, 
    legendHBS, 
    legend, 
    legendMediator,
    Handlebars
) {

    return {
        initialize: function() {
            var legendTemplate = Handlebars.compile(legendHBS);
            var html = legendTemplate();
            this.html(html);
            this.sandbox.utils.addCSS(legendCSS, 'display-legend-component-style');

            legendMediator.init(this);
            legend.init(this, legendMediator);
        }
    };
                
});