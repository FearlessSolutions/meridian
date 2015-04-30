define([
    'text!./clear.hbs',
    'text!./clear.css',
    './clear',
    './clear-mediator',
    'handlebars'
], function (
    clearHBS, 
    clearCSS, 
    clear,  
    clearMediator
) {

    return {
        initialize: function() {
            var clearTemplate = Handlebars.compile(clearHBS);
            var html = clearTemplate();

            this.sandbox.utils.addCSS(clearCSS, 'clear-component-style');

            this.html(html);

            clearMediator.init(this);
            clear.init(this, clearMediator);
        }
    };

});