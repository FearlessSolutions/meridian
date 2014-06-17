define([
    'text!./locator.css',
    'text!./locator.hbs',
    './locator',
    './locator-publisher',
    './locator-subscriber',
    'handlebars'
], function (locatorToolCSS, locatorToolHBS, locatorTool, locatorToolPublisher, locatorToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(locatorToolCSS, 'tool-locator-component-style');

            var locatorToolTemplate = Handlebars.compile(locatorToolHBS);
            var html = locatorToolTemplate();
            this.html(html);

            locatorToolPublisher.init(this);
            locatorToolSubscriber.init(this);
            locatorTool.init(this);
        }
    };                
});