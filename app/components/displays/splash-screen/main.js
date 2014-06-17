define([
    'text!./splash-screen.css', 
    './splash-screen',
    './splash-screen-publisher',
    'handlebars'
], function (splashScreenCSS, splashScreen, splashScreenPublisher) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(splashScreenCSS, 'displays-splash-screen-component-style');

            var splashScreenTemplate = Handlebars.compile(this.sandbox.splashScreen.template);
            var html = splashScreenTemplate();
            this.html(html);

            splashScreenPublisher.init(this);
            splashScreen.init(this);
        }
    };
                
});