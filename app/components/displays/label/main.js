define([
	'./label',
    './label-subscriber',
	'text!./label.hbs',
	'text!./label.css',
    'handlebars'
], function (labelDisplay, labelSubscriber, labelHBS, labelCSS) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(labelCSS, 'display-label-component-style');

            var labelTemplate = Handlebars.compile(labelHBS);
            var html = labelTemplate();

            this.html(html);

            labelDisplay.init(this);
            labelSubscriber.init(this);

        }
    };
                
});