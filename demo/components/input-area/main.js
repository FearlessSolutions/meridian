define([
    'text!./inputArea.css',
    'text!./inputArea.hbs',
    './inputArea',
    './inputArea-publisher',
    'handlebars'
], function (inputAreaToolCSS, inputAreaToolHBS, inputAreaTool, inputAreaToolPublisher, inputAreaToolSubscriber) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(inputAreaToolCSS, 'tool-inputArea-component-style');

            var inputAreaToolTemplate = Handlebars.compile(inputAreaToolHBS);
            var html = inputAreaToolTemplate();
            this.html(html);

            inputAreaToolPublisher.init(this);
            inputAreaTool.init(this);
        }
    };                
});