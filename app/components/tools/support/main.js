define([
    'text!./support.css',
    'text!./support.hbs',
    'text!./about.hbs',
    './support',
    './support-publisher',
    './support-subscriber',
    'handlebars'
], function (
    supportToolCSS, 
    supportToolHBS, 
    aboutHBS,
    supportTool, 
    supportPublisher, 
    supportSubscriber
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(supportToolCSS, 'tools-support-component-style');

            var supportToolTemplate = Handlebars.compile(supportToolHBS);
            var supportHTML = supportToolTemplate();
            
            var aboutTemplate = Handlebars.compile(aboutHBS);
            var aboutHTML = aboutTemplate({
                "version": this.sandbox.systemConfiguration.version,
                "releaseDate": this.sandbox.systemConfiguration.releaseDate,
                "cmapiVersion": this.sandbox.systemConfiguration.cmapiVersion,
            });
            var html = supportHTML + aboutHTML

            this.html(html);

            supportPublisher.init(this);
            supportTool.init(this);
            supportSubscriber.init(this);
        }
    };

});
