define([
    'text!./visual-mode-toggle.hbs',
    './visual-mode-toggle',
    './visual-mode-toggle-publisher',
    './visual-mode-toggle-subscriber',
    'handlebars'
], function (visualModeHBS, visualMode, visualModePublisher, visualModeSubscriber) {

    return {
        initialize: function() {
            
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