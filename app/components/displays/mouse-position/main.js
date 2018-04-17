define([
    'text!./mouse-position.css', 
    'text!./mouse-position.hbs',
    './mouse-position',
    './mouse-position-mediator',
    'handlebars'
], function (
    mousePositionCSS, 
    mousePositionHBS, 
    mousePosition, 
    mousePositionMediator,
    Handlebars
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(mousePositionCSS, 'display-mouse-position-component-style');

            var showCursorLocationDefault = true;

            if(this.sandbox.cursorLocation && 
                typeof this.sandbox.cursorLocation.defaultDisplay !== undefined) {
                showCursorLocationDefault = this.sandbox.cursorLocation.defaultDisplay; 
            }

            // If showCursorLocationDefault is true, start the UI side of the feature
            if(showCursorLocationDefault) {
                var mousePositionTemplate = Handlebars.compile(mousePositionHBS);
                var html = mousePositionTemplate();
                this.html(html);
                
                mousePositionMediator.init(this);
                mousePosition.init(this, mousePositionMediator);
            }
        }
    };
                
});