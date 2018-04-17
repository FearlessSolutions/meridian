define([
    'text!./locator.css',
    'text!./locator.hbs',
    './locator',
    './locator-mediator',
    'handlebars'
], function (
    locatorCSS, 
    locatorHBS, 
    locator, 
    locatorMediator,
    Handlebars
) {
    return {
        initialize: function() {
            var locatorToolTemplate = Handlebars.compile(locatorHBS),
                html = locatorToolTemplate();
            this.sandbox.utils.addCSS(locatorCSS, 'tool-locator-component-style');

            this.html(html);

            locatorMediator.init(this);
            locator.init(this, locatorMediator);
        }
    };                
});