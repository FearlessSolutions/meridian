define([
    'text!./visual-mode-toggle.css',
    'text!./visual-mode-toggle.hbs',
    './visual-mode-toggle',
    './visual-mode-toggle-mediator',
    'handlebars'
], function (
    visualModeCSS, 
    visualModeHBS, 
    visualMode,  
    visualModeMediator
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(visualModeCSS, 'controls-visual-mode-toggle-component-style');

            var uiVisibile = (this.options.ui === false) ? false : true,
                visualModeTemplate = Handlebars.compile(visualModeHBS),
                html = visualModeTemplate();

            if(uiVisibile) {
                this.html(html);
            }

            visualModeMediator.init(this);
            visualMode.init(this, visualModeMediator);
        }
    };

});