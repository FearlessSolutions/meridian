define([
    'text!./clear-toggle.hbs',
    './clear-toggle',
    './clear-toggle-mediator',
    'handlebars'
], function (clearHBS, clear, clearMediator) {

    return {
        initialize: function() {
            var clearTemplate = Handlebars.compile(clearHBS);
            var html = clearTemplate();

            this.html(html);

            clearMediator.init(this);
            clear.init(this, clearMediator);
        }
    };

});