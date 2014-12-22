define([
    './map/core',
    'text!./map-openlayers.css',
    'text!./map-openlayers.hbs',
    './map-api-publisher',
    './map-api-subscriber',
    'handlebars'],
    function (core, componentCSS, componentHBS, publisher, subscriber){
    var exposed = {
        initialize: function() {
            var template = Handlebars.compile(componentHBS),
                html = template();
            this.sandbox.utils.addCSS(componentCSS, 'rendering-engines-map-openlayers-component-style');

            this.html(html);

            core.init(this);
            publisher.init(this);
            subscriber.init(this);
        }
    };

    return exposed;
});
