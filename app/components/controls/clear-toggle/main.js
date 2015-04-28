define([
    'text!./clear-toggle.hbs',
    './clear-toggle',
    './clear-toggle-publisher',
    'handlebars'
], function (clearHBS, clear, clearPublisher) {

    return {
        initialize: function() {
            var clearTemplate = Handlebars.compile(clearHBS);
            var html = clearTemplate();

            this.html(html);

            clear.init(this);
            clearPublisher.init(this);
        }
    };

});
