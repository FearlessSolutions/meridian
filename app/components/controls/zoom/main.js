define([
    'text!./zoom.css', 
    'text!./zoom.hbs',
    './zoom',
    './zoom-publisher',
    'handlebars'
], function (zoomControlCSS, zoomControlHBS, zoomControl, zoomControlPublisher) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(zoomControlCSS, 'control-zoom-component-style');

            var zoomControlTemplate = Handlebars.compile(zoomControlHBS);
            var html = zoomControlTemplate();
            this.html(html);

            zoomControlPublisher.init(this);
            zoomControl.init(this);
        }
    };
                
});
