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
            var template = Handlebars.compile(componentHBS);

            this.sandbox.utils.addCSS(componentCSS, COMPONENT_NAME + '-style');

            this.html(template({
                exports: this.sandbox.export.options
            }));

            publisher.init(this);
            component.init(this);
            subscriber.init(this);
        }
    };

});
