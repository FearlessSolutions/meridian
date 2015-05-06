define([
    'text!./legend-toggle.hbs',
    './legend-toggle',
    './legend-toggle-mediator',
    'handlebars'
], function (
    legendToggleHBS,
    legendToggle,
    legendToggleMediator
){
    return {
        initialize: function() {
            var legendToggleTemplate = Handlebars.compile(legendToggleHBS);
            var html = legendToggleTemplate();
            this.html(html);

            legendToggleMediator.init(this);
            legendToggle.init(this, legendToggleMediator);
        }
    };

});