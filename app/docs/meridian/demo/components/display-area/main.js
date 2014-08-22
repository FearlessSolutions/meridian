define([
    'text!./displayArea.css',
    'text!./displayArea.hbs',
    './displayArea',
    './displayArea-subscriber',
    'handlebars'
], function (displayAreaToolCSS, displayAreaToolHBS, displayAreaTool, displayAreaToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(displayAreaToolCSS, 'tool-displayArea-component-style');

            var displayAreaToolTemplate = Handlebars.compile(displayAreaToolHBS);
            var html = displayAreaToolTemplate();
            this.html(html);

            displayAreaToolSubscriber.init(this);
            displayAreaTool.init(this);
        }
    };                
});