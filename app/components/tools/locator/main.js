define([
    'text!./locator.css',
    'text!./locator.hbs',
    './locator',
    './locator-publisher',
    './locator-subscriber',
    'handlebars'
], function (componentCSS, componentHBS, component, publisher, subscriber) {
    return {
        initialize: function() {
            var locatorToolTemplate = Handlebars.compile(componentHBS),
                html = locatorToolTemplate();
            this.sandbox.utils.addCSS(componentCSS, 'tool-locator-component-style');

            this.html(html);

            publisher.init(this);
            subscriber.init(this);
            component.init(this);
        }
    };                
});