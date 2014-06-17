define([
    'text!./mouse-position.css', 
    'text!./mouse-position.hbs',
    './mouse-position',
    './mouse-position-subscriber',
    'handlebars'
], function (mousePositionCSS, mousePositionHBS, mousePosition, mousePositionSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(mousePositionCSS, 'display-mouse-position-component-style');

            var mousePositionTemplate = Handlebars.compile(mousePositionHBS);
            var html = mousePositionTemplate();
            this.html(html);

            mousePosition.init(this);
            mousePositionSubscriber.init(this);
        }
    };
                
});