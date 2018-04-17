define([
    'text!./boilerplate.css', 
    'text!./boilerplate.hbs',
    './boilerplate',
    './boilerplate-mediator',
    'handlebars'
], function (
    boilerplateCSS, 
    boilerplateHBS, 
    boilerplate, 
    boilerplateMediator,
    Handlebars
) {

    return {
        initialize: function() {
            // Load boilerplateCSS: 
            //   first argument is 'actual' css values (loaded from requiring CSS file as text)
            //   second argument is an ID in the format of {component name}+'component-style'
            this.sandbox.utils.addCSS(boilerplateCSS, 'boilerplate-component-style');

            // Compile 'Template' using Handlebars
            var boilerplateTemplate = Handlebars.compile(boilerplateHBS);
            
            // JSON 'Content' to populate template
            var boilerplateContent = {
                "moduleName": "Boilerplate Module",
                "description": "This is the Boilerplate description."
            };

            // Execute 'Template' with 'Content' if it exists.  Otherwise, no param.
            var html = boilerplateTemplate(boilerplateContent);

            // Output resulting HTML to the module's parent div (access provided by Aura Framework)
            this.html(html);

            // Initialize boilerplateMediator from boilerplate-mediator.js
            boilerplateMediator.init(this);

            // Initialize boilerplate from boilerplate.js
            boilerplate.init(this, boilerplateMediator);
        }
    };
                
});