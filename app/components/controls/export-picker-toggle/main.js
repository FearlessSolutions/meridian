define([
    'text!./export-picker-toggle.hbs',
    './export-picker-toggle',
    './export-picker-toggle-publisher',
    './export-picker-toggle-subscriber',
    'handlebars'
], function(componentHBS, component, publisher, subscriber){

    return {
        initialize: function() {

            var componentTemplate = Handlebars.compile(componentHBS);
            var html = componentTemplate();

            this.html(html);

            component.init(this);
            publisher.init(this);
            subscriber.init(this);

        }
    };
});