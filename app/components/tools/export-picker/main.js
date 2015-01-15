define([
    'text!./export-picker.css',
    'text!./export-picker.hbs',
    'text!./export-picker-simplified.hbs',
    './export-picker',
    './export-picker-publisher',
    './export-picker-subscriber',
    'handlebars'
], function (
    componentCSS,
    componentHBS,
    simpleComponentHBS,
    component,
    publisher,
    subscriber
) {
    var COMPONENT_NAME = 'tools-export-picker';

    return {
        initialize: function() {
            var template = Handlebars.compile(componentHBS),
                html,
                tabs;

            this.sandbox.utils.addCSS(componentCSS, COMPONENT_NAME + '-style');

            html = template({
                exports: this.sandbox.export.options
            });
            this.html(html);


//            template = Handlebars.compile(simpleComponentHBS);
//            html = html + template();

            publisher.init(this);
            component.init(this);
            subscriber.init(this);
        }
    };

});
