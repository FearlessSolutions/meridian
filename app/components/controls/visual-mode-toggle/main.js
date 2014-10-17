define([
    'text!./visual-mode-toggle.css',
    'text!./visual-mode-toggle.hbs',
    './visual-mode-toggle',
    './visual-mode-toggle-publisher',
    './visual-mode-toggle-subscriber',
    'handlebars'
], function (visualModeCSS, visualModeHBS, visualMode, visualModePublisher, visualModeSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(visualModeCSS, 'controls-visual-mode-toggle-component-style');

            var uiVisibile = (this.options.ui === false) ? false : true,
                visualModeTemplate = Handlebars.compile(visualModeHBS),
                html = visualModeTemplate();

            if(uiVisibile) {
                this.html(html);
            }

            visualMode.init(this);
            visualModePublisher.init(this);
            visualModeSubscriber.init(this);
        }
    };

});