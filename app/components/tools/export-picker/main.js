define([
    'text!./export-picker.css',
    'text!./export-picker.hbs',
    './export-picker',
    './export-picker-publisher',
    './export-picker-subscriber',
    'handlebars'
], function (
    componentCSS,
    componentHBS,
    component,
    publisher,
    subscriber
) {
    var COMPONENT_NAME = 'tools-export-picker';

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(componentCSS, COMPONENT_NAME + '-style');

            var template = Handlebars.compile(componentHBS);
            var html = template();
            this.html(html);

            publisher.init(this);
            component.init(this);
            subscriber.init(this);
        }
    };

});
