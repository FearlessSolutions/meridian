define([
    'text!./zoom.css', 
    'text!./zoom.hbs',
    './zoom',
    './zoom-mediator',
    'handlebars'
], function (
    zoomControlCSS, 
    zoomControlHBS, 
    zoomControl, 
    zoomControlMediator
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(zoomControlCSS, 'control-zoom-component-style');

            var zoomControlTemplate = Handlebars.compile(zoomControlHBS);
            var html = zoomControlTemplate();
            this.html(html);

            zoomControlMediator.init(this);
            zoomControl.init(this);
        }
    };
                
});
