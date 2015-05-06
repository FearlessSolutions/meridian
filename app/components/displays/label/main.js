define([
	'./label',
    './label-mediator',
	'text!./label.hbs',
	'text!./label.css',
    'handlebars'
], function (
    labelDisplay, 
    labelMediator, 
    labelHBS, 
    labelCSS
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(labelCSS, 'display-label-component-style');

            var labelTemplate = Handlebars.compile(labelHBS);
            var html = labelTemplate();

            this.html(html);

            labelMediator.init(this);
            labelDisplay.init(this, labelMediator);

        }
    };
                
});