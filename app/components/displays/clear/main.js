define([
    'text!./clear.hbs',
    'text!./clear.css',
    './clear',
    './clear-publisher',
    './clear-subscriber',
    'handlebars'
], function (clearHBS, clearCSS, clear, clearPublisher, clearSubscriber) {

    return {
        initialize: function() {
            var clearTemplate = Handlebars.compile(clearHBS);
            var html = clearTemplate();

            this.sandbox.utils.addCSS(clearCSS, 'clear-component-style');

            this.html(html);

            clear.init(this);
            clearPublisher.init(this);
            clearSubscriber.init(this);
        }
    };

});